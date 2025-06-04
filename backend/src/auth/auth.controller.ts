import { Controller, Post, Body, UseGuards, Get, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto'; // Assumed to be created in a future batch
import { RegisterDto } from './dto/register.dto'; // Assumed to be created in a future batch
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';
import { UsersService } from '../users/users.service'; // For fetching full user profile
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { User as UserEntity } from '../users/entities/user.entity'; // Assumed to be created in a future batch
import { TokenPayload } from './interfaces/token-payload.interface'; // Assumed to be created in a future batch

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService, // Injected to fetch full user details for profile
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User registered successfully. Returns user and access token.'})
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'User with this email already exists.' })
  async register(@Body() registerDto: RegisterDto): Promise<{ accessToken: string; user: Omit<UserEntity, 'password'> }> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in an existing user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User logged in successfully. Returns user and access token.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials.' })
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string; user: Omit<UserEntity, 'password'> }> {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns current user profile.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized. Token is missing or invalid.' })
  async getProfile(@User() tokenPayload: TokenPayload): Promise<Omit<UserEntity, 'password'> | null> {
    // tokenPayload contains { userId, email, roles } from JwtStrategy
    // We use UsersService to fetch the full, fresh user object, excluding the password
    const user = await this.usersService.findById(tokenPayload.sub); // Assuming tokenPayload.sub is userId
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
