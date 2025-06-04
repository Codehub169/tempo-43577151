import { Injectable, NotFoundException, ConflictException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { User } from '../users/entities/user.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createAccountDto: CreateAccountDto, creatorId: number): Promise<Account> {
    const { name, assignedToId, ...restOfDto } = createAccountDto;

    // Check if an account with the same name already exists (optional, can be business rule)
    const existingAccountByName = await this.accountRepository.findOne({ where: { name } });
    if (existingAccountByName) {
      throw new ConflictException(`An account with name '${name}' already exists.`);
    }

    const account = this.accountRepository.create(restOfDto);
    account.name = name; // Ensure name is set directly

    // Validate and set creator
    const creator = await this.userRepository.findOne({ where: { id: creatorId } });
    if (!creator) {
      throw new NotFoundException(`User with ID ${creatorId} not found. Cannot set creator.`);
    }
    account.createdBy = creator;
    account.createdById = creatorId;

    // Validate and set assigned user if provided
    if (assignedToId) {
      const assignedUser = await this.userRepository.findOne({ where: { id: assignedToId } });
      if (!assignedUser) {
        throw new NotFoundException(`User with ID ${assignedToId} not found. Cannot assign account.`);
      }
      account.assignedTo = assignedUser;
      account.assignedToId = assignedToId;
    }

    try {
      return await this.accountRepository.save(account);
    } catch (error) {
      // Handle potential database errors, e.g., unique constraint violations not caught above
      if (error.code === '23505') { // Unique violation code for PostgreSQL
        throw new ConflictException('Account with this information already exists.');
      }
      throw new InternalServerErrorException('Failed to create account.');
    }
  }

  async findAll(paginationQueryDto: PaginationQueryDto): Promise<{ data: Account[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = paginationQueryDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.accountRepository.findAndCount({
      skip,
      take: limit,
      relations: ['createdBy', 'assignedTo'], // Load related user data
      order: { createdAt: 'DESC' }, // Default sort order
    });

    return { data, total, page, limit };
  }

  async findOne(id: string, relations: string[] = []): Promise<Account> {
    const options: FindOneOptions<Account> = { where: { id } };
    if (relations && relations.length > 0) {
      options.relations = relations;
    } else {
      options.relations = ['createdBy', 'assignedTo', 'contacts', 'opportunities', 'projects', 'tickets'];
    }
    
    const account = await this.accountRepository.findOne(options);
    if (!account) {
      throw new NotFoundException(`Account with ID '${id}' not found.`);
    }
    return account;
  }

  async update(id: string, updateAccountDto: UpdateAccountDto, updaterId: number): Promise<Account> {
    const account = await this.findOne(id, ['createdBy']); // Load createdBy for potential checks

    const { name, assignedToId, ...restOfDto } = updateAccountDto;

    // Check for name conflict if name is being changed
    if (name && name !== account.name) {
      const existingAccountByName = await this.accountRepository.findOne({ where: { name } });
      if (existingAccountByName && existingAccountByName.id !== id) {
        throw new ConflictException(`An account with name '${name}' already exists.`);
      }
    }

    // Validate and set assigned user if provided and changed
    if (assignedToId && assignedToId !== account.assignedToId) {
      const assignedUser = await this.userRepository.findOne({ where: { id: assignedToId } });
      if (!assignedUser) {
        throw new NotFoundException(`User with ID ${assignedToId} (for assignment) not found.`);
      }
      account.assignedTo = assignedUser;
      account.assignedToId = assignedToId;
    } else if (assignedToId === null && account.assignedToId !== null) { // Explicitly unassigning
        account.assignedTo = null;
        account.assignedToId = null;
    }

    // Cannot change createdBy, but updaterId can be used for audit logs (not implemented here)
    // const updater = await this.userRepository.findOne({ where: { id: updaterId } });
    // if (!updater) {
    //   throw new NotFoundException(`User with ID ${updaterId} (updater) not found.`);
    // }

    Object.assign(account, restOfDto);
    if (name) account.name = name; // Apply name if it was in DTO

    try {
      return await this.accountRepository.save(account);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Update resulted in a conflict with existing data.');
      }
      throw new InternalServerErrorException('Failed to update account.');
    }
  }

  async remove(id: string): Promise<void> {
    const account = await this.findOne(id);
    // Related entities (contacts, tickets) with cascade delete will be handled by DB/TypeORM.
    // For opportunities, projects, their accountId will be set to NULL due to entity definition.
    const result = await this.accountRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Account with ID '${id}' not found or already removed.`);
    }
  }
}
