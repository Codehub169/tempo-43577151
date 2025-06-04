import { Injectable, NotFoundException, ConflictException, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { User } from '../users/entities/user.entity'; // Assuming User entity for createdBy/assignedTo

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Optional: if you need to validate/fetch user details
  ) {}

  async create(createLeadDto: CreateLeadDto, creatorId: number): Promise<Lead> {
    // Check if lead with the same email already exists (optional, based on business rules)
    if (createLeadDto.email) {
      const existingLead = await this.leadRepository.findOne({ where: { email: createLeadDto.email } });
      if (existingLead) {
        throw new ConflictException(`Lead with email '${createLeadDto.email}' already exists.`);
      }
    }

    const lead = this.leadRepository.create(createLeadDto);
    
    // Assign creator if creatorId is provided and User entity is available
    if (creatorId) {
      const creator = await this.userRepository.findOne({ where: { id: creatorId } } as FindOneOptions<User>);
      if (creator) {
        // Assuming Lead entity has a 'createdBy' field of type User or 'createdById' of type number
        // This part needs to align with the actual Lead entity definition
        // lead.createdBy = creator; // if 'createdBy' is a User relation
        // OR
        // lead.createdById = creatorId; // if 'createdById' is a number field
      }
    }
    // Similarly, handle assignedTo if it's part of CreateLeadDto and needs user validation
    // if (createLeadDto.assignedToId) { ... }

    try {
      return await this.leadRepository.save(lead);
    } catch (error) {
      // Log the error internally
      throw new InternalServerErrorException('Failed to create lead.');
    }
  }

  async findAll(paginationQueryDto: PaginationQueryDto): Promise<{ data: Lead[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = paginationQueryDto;
    const skip = (page - 1) * limit;

    const options: FindManyOptions<Lead> = {
      skip,
      take: limit,
      // Add relations if needed, e.g., relations: ['assignedTo', 'createdBy']
      // Add default ordering, e.g., order: { createdAt: 'DESC' }
    };

    const [data, total] = await this.leadRepository.findAndCount(options);
    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Lead> {
    const options: FindOneOptions<Lead> = {
      where: { id },
      // Add relations if needed, e.g., relations: ['assignedTo', 'createdBy', 'activities']
    };
    const lead = await this.leadRepository.findOne(options);
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found.`);
    }
    return lead;
  }

  async update(id: number, updateLeadDto: UpdateLeadDto, updaterId?: number): Promise<Lead> {
    const lead = await this.findOne(id); // findOne already throws NotFoundException

    // Optional: Check for email conflict if email is being updated
    if (updateLeadDto.email && updateLeadDto.email !== lead.email) {
      const existingLead = await this.leadRepository.findOne({ where: { email: updateLeadDto.email } });
      if (existingLead && existingLead.id !== id) {
        throw new ConflictException(`Another lead with email '${updateLeadDto.email}' already exists.`);
      }
    }

    // Optional: Add logic if updaterId is relevant (e.g., logging, ownership checks)
    // if (updaterId && lead.createdById !== updaterId) { // Example check
    //   throw new ForbiddenException('You are not allowed to update this lead.');
    // }

    this.leadRepository.merge(lead, updateLeadDto);

    try {
      return await this.leadRepository.save(lead);
    } catch (error) {
      // Log the error internally
      throw new InternalServerErrorException(`Failed to update lead with ID ${id}.`);
    }
  }

  async remove(id: number): Promise<void> {
    const lead = await this.findOne(id); // Ensures lead exists
    const result = await this.leadRepository.delete(id);
    if (result.affected === 0) {
      // This case should ideally be caught by findOne, but as a safeguard:
      throw new NotFoundException(`Lead with ID ${id} not found or already deleted.`);
    }
  }
}
