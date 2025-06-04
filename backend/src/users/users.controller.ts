import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto'; // Assuming this will be created later
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User as AuthUser } from '../common/decorators/user.decorator';
import { User } from './entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // Example: Only authenticated users (e.g., admins) can create users
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.', type: User })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    // In a real app, you might check if the authenticated user has admin rights here
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard) // Example: Admin role guard would be more appropriate here
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users.', type: [User] })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Current user profile.', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getProfile(@AuthUser('sub') userId: number): Promise<User | null> {
    return this.usersService.findById(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard) // Example: Admin or self guard
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: Number })
  @ApiResponse({ status: 200, description: 'User details.', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
    // Add logic here to check if AuthUser has permission to view this user (e.g., is admin or is self)
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard) // Example: Admin or self guard
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID', type: Number })
  @ApiResponse({ status: 200, description: 'User updated successfully.', type: User })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    // @AuthUser() authUser: any // To check if user is updating self or is admin
  ): Promise<User | null> {
    // Add logic here to check if AuthUser has permission to update this user
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) // Example: Admin role guard
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID', type: Number })
  @ApiResponse({ status: 204, description: 'User deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    // Add logic here to check if AuthUser has permission to delete this user
    return this.usersService.remove(id);
  }
}
