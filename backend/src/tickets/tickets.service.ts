import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, DataSource } from 'typeorm';
import { Ticket, TicketStatus, TicketPriority } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { User } from '../users/entities/user.entity';
import { Account } from '../accounts/entities/account.entity';
import { Project } from '../projects/entities/project.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createTicketDto: CreateTicketDto, creatorId: number): Promise<Ticket> {
    const creator = await this.userRepository.findOneBy({ id: creatorId });
    if (!creator) {
      throw new NotFoundException(`User with ID ${creatorId} not found.`);
    }

    let assignedTo: User | undefined = undefined;
    if (createTicketDto.assignedToId) {
      assignedTo = await this.userRepository.findOneBy({ id: createTicketDto.assignedToId });
      if (!assignedTo) {
        throw new NotFoundException(`Assigned user with ID ${createTicketDto.assignedToId} not found.`);
      }
    }

    let account: Account | undefined = undefined;
    if (createTicketDto.accountId) {
      account = await this.accountRepository.findOneBy({ id: createTicketDto.accountId });
      if (!account) {
        throw new NotFoundException(`Account with ID ${createTicketDto.accountId} not found.`);
      }
    }

    let project: Project | undefined = undefined;
    if (createTicketDto.projectId) {
      project = await this.projectRepository.findOneBy({ id: createTicketDto.projectId });
      if (!project) {
        throw new NotFoundException(`Project with ID ${createTicketDto.projectId} not found.`);
      }
      // Ensure project is linked to the same account if both are provided
      if (account && project.accountId !== account.id) {
        throw new BadRequestException('Project does not belong to the specified account.');
      }
    }

    const ticket = this.ticketRepository.create({
      ...createTicketDto,
      createdBy: creator,
      assignedTo,
      account,
      project,
      status: createTicketDto.status || TicketStatus.OPEN,
      priority: createTicketDto.priority || TicketPriority.MEDIUM,
    });

    try {
      return await this.ticketRepository.save(ticket);
    } catch (error) {
      // Handle potential database errors, e.g., constraint violations
      throw new InternalServerErrorException('Failed to create ticket.');
    }
  }

  async findAll(paginationQueryDto: PaginationQueryDto): Promise<{ data: Ticket[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = paginationQueryDto;
    const skip = (page - 1) * limit;

    const findOptions: FindManyOptions<Ticket> = {
      skip,
      take: limit,
      relations: ['createdBy', 'assignedTo', 'account', 'project'],
      order: { createdAt: 'DESC' },
      where: { deletedAt: undefined }, // Ensure soft-deleted records are not fetched by default
    };

    const [data, total] = await this.ticketRepository.findAndCount(findOptions);
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { id, deletedAt: undefined }, // Ensure soft-deleted records are not fetched
      relations: ['createdBy', 'assignedTo', 'account', 'project' /* , 'comments' // Add when comments implemented */],
    });
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found.`);
    }
    return ticket;
  }

  async update(id: string, updateTicketDto: UpdateTicketDto, updaterId: number): Promise<Ticket> {
    const ticket = await this.findOne(id); // findOne already checks for existence and soft delete

    // Basic authorization: ensure updater is creator or assignedTo (can be expanded with roles)
    // if (ticket.createdById !== updaterId && ticket.assignedToId !== updaterId) {
    //   throw new ForbiddenException('You are not authorized to update this ticket.');
    // }

    if (updateTicketDto.assignedToId) {
      const assignedTo = await this.userRepository.findOneBy({ id: updateTicketDto.assignedToId });
      if (!assignedTo) {
        throw new NotFoundException(`Assigned user with ID ${updateTicketDto.assignedToId} not found.`);
      }
      ticket.assignedTo = assignedTo;
    } else if (updateTicketDto.assignedToId === null) {
      ticket.assignedTo = undefined;
      ticket.assignedToId = null;
    }

    if (updateTicketDto.accountId) {
      const account = await this.accountRepository.findOneBy({ id: updateTicketDto.accountId });
      if (!account) {
        throw new NotFoundException(`Account with ID ${updateTicketDto.accountId} not found.`);
      }
      ticket.account = account;
    } else if (updateTicketDto.accountId === null) {
        ticket.account = undefined;
        ticket.accountId = null;
    }

    if (updateTicketDto.projectId) {
      const project = await this.projectRepository.findOneBy({ id: updateTicketDto.projectId });
      if (!project) {
        throw new NotFoundException(`Project with ID ${updateTicketDto.projectId} not found.`);
      }
      // Ensure project is linked to the same account if account is set
      if (ticket.account && project.accountId !== ticket.account.id) {
        throw new BadRequestException('Project does not belong to the ticket\'s current account.');
      }
      ticket.project = project;
    } else if (updateTicketDto.projectId === null) {
        ticket.project = undefined;
        ticket.projectId = null;
    }

    // Merge other updatable fields
    Object.assign(ticket, {
        title: updateTicketDto.title ?? ticket.title,
        description: updateTicketDto.description ?? ticket.description,
        status: updateTicketDto.status ?? ticket.status,
        priority: updateTicketDto.priority ?? ticket.priority,
    });

    try {
      return await this.ticketRepository.save(ticket);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update ticket.');
    }
  }

  async remove(id: string): Promise<void> {
    const ticket = await this.findOne(id); // findOne ensures it exists and is not soft-deleted
    await this.ticketRepository.softDelete(id);
  }
}
