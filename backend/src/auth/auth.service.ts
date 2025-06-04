import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto'; // Assumed to be created
import { RegisterDto } from './dto/register.dto'; // Assumed to be created
import { User } from '../users/entities/user.entity'; // Assumed to be created
import { TokenPayload } from './interfaces/token-payload.interface'; // Assumed to be created
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; user: Omit<User, 'password'> }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = this.generateJwtToken(user as User); // Cast because validateUser returns Omit<User, 'password'>
    return { accessToken, user };
  }

  async register(registerDto: RegisterDto): Promise<{ accessToken: string; user: Omit<User, 'password'> }> {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    try {
      // Assuming usersService.createUser accepts an object similar to CreateUserDto
      // and returns the created User entity.
      // Roles might be assigned here by default or based on registerDto.
      const newUser = await this.usersService.createUser({
        ...registerDto, // Spread name, etc.
        password: hashedPassword,
        // roles: ['user'], // Example: default role assignment
      });

      const { password, ...userResult } = newUser;
      const accessToken = this.generateJwtToken(newUser);
      return { accessToken, user: userResult };
    } catch (error) {
      // Log the error internally
      console.error('Error during user registration:', error);
      throw new InternalServerErrorException('Could not register user. Please try again later.');
    }
  }

  private generateJwtToken(user: User | Omit<User, 'password'>): string {
    const payload: TokenPayload = {
      sub: user.id,       // 'sub' (subject) is standard for user ID
      email: user.email,
      // roles: user.roles, // Assuming User entity has a 'roles' property
    };
    return this.jwtService.sign(payload);
  }

  // Method to verify token (optional, guards usually handle this)
  async verifyToken(token: string): Promise<TokenPayload | null> {
    try {
      return this.jwtService.verify<TokenPayload>(token);
    } catch (error) {
      return null;
    }
  }
}
