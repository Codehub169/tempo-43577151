import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto'; // Assuming this will be created later

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, name, roles } = createUserDto;

    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
      roles: roles || ['user'], // Default role if not provided
    });

    try {
      await this.usersRepository.save(user);
      // The entity's @Exclude for password will handle not returning it.
      return user;
    } catch (error) {
      // Log the error for debugging
      console.error('Error creating user:', error);
      throw new InternalServerErrorException('Could not create user.');
    }
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find(); // Passwords will be excluded by entity's @Exclude
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      return null;
    }
    return user; // Password excluded by entity's @Exclude
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user; // Password can be selected if needed for auth, but generally excluded
  }
  
  // Used by AuthService to get user with password for validation
  async findByEmailWithPassword(email: string): Promise<User | null> {
    const user = await this.usersRepository.createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.password) {
      const saltRounds = 10;
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds);
    }
    
    // Merge existing user with new data
    this.usersRepository.merge(user, updateUserDto);
    
    try {
        await this.usersRepository.save(user);
        return user; // Password excluded by entity's @Exclude
    } catch (error) {
        if (error.code === '23505') { // Unique constraint violation (e.g. email)
            throw new ConflictException('Email already in use.');
        }
        console.error('Error updating user:', error);
        throw new InternalServerErrorException('Could not update user.');
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
