import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Activity, ActivityType } from './entities/activity.entity';
import { CreateActivityDto, RelatedEntityType } from './dto/create-activity.dto';
import { User } from '../users/entities/user.entity';
import { Lead } from '../leads/entities/lead.entity';
import { Opportunity } from '../opportunities/entities/opportunity.entity';
import { Account } from '../accounts/entities/account.entity';
import { Contact } from '../contacts/entities/contact.entity';
import { Project } from '../projects/entities/project.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    @InjectRepository(Opportunity)
    private readonly opportunityRepository: Repository<Opportunity>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createActivityDto: CreateActivityDto, creatorId: number): Promise<Activity> {
    const { relatedTo, assignedToId, ...activityData } = createActivityDto;

    const creator = await this.userRepository.findOneBy({ id: creatorId });
    if (!creator) {
      throw new NotFoundException(`User with ID ${creatorId} not found.`);
    }

    let assignedToUser: User | undefined = undefined;
    if (assignedToId) {
      assignedToUser = await this.userRepository.findOneBy({ id: assignedToId });
      if (!assignedToUser) {
        throw new NotFoundException(`Assigned user with ID ${assignedToId} not found.`);
      }
    }

    const activity = this.activityRepository.create({
      ...activityData,
      createdById: creatorId,
      assignedToId: assignedToUser?.id,
      occurredAt: createActivityDto.occurredAt ? new Date(createActivityDto.occurredAt) : new Date(),
    });

    // Validate and set the related entity
    let relatedEntityFound = false;
    switch (relatedTo.entityType) {
      case RelatedEntityType.LEAD:
        if (!await this.leadRepository.findOneBy({ id: relatedTo.entityId })) throw new NotFoundException(`Lead with ID ${relatedTo.entityId} not found.`);
        activity.relatedLeadId = relatedTo.entityId;
        relatedEntityFound = true;
        break;
      case RelatedEntityType.OPPORTUNITY:
        if (!await this.opportunityRepository.findOneBy({ id: relatedTo.entityId })) throw new NotFoundException(`Opportunity with ID ${relatedTo.entityId} not found.`);
        activity.relatedOpportunityId = relatedTo.entityId;
        relatedEntityFound = true;
        break;
      case RelatedEntityType.ACCOUNT:
        if (!await this.accountRepository.findOneBy({ id: relatedTo.entityId })) throw new NotFoundException(`Account with ID ${relatedTo.entityId} not found.`);
        activity.relatedAccountId = relatedTo.entityId;
        relatedEntityFound = true;
        break;
      case RelatedEntityType.CONTACT:
        if (!await this.contactRepository.findOneBy({ id: relatedTo.entityId })) throw new NotFoundException(`Contact with ID ${relatedTo.entityId} not found.`);
        activity.relatedContactId = relatedTo.entityId;
        relatedEntityFound = true;
        break;
      case RelatedEntityType.PROJECT:
        if (!await this.projectRepository.findOneBy({ id: relatedTo.entityId })) throw new NotFoundException(`Project with ID ${relatedTo.entityId} not found.`);
        activity.relatedProjectId = relatedTo.entityId;
        relatedEntityFound = true;
        break;
      case RelatedEntityType.TICKET:
        if (!await this.ticketRepository.findOneBy({ id: relatedTo.entityId })) throw new NotFoundException(`Ticket with ID ${relatedTo.entityId} not found.`);
        activity.relatedTicketId = relatedTo.entityId;
        relatedEntityFound = true;
        break;
      default:
        throw new BadRequestException('Invalid related entity type specified.');
    }

    if (!relatedEntityFound) {
        throw new BadRequestException('A valid related entity must be provided.');
    }

    try {
      return await this.activityRepository.save(activity);
    } catch (error) {
      // Log the error for debugging: console.error(error);
      throw new InternalServerErrorException('Failed to create activity.');
    }
  }

  async findByRelatedEntity(
    entityType: RelatedEntityType,
    entityId: string,
    paginationQueryDto: PaginationQueryDto,
  ): Promise<{ data: Activity[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = paginationQueryDto;
    const skip = (page - 1) * limit;

    const qb = this.activityRepository.createQueryBuilder('activity')
      .leftJoinAndSelect('activity.createdBy', 'creator')
      .leftJoinAndSelect('activity.assignedTo', 'assignee')
      .orderBy('activity.occurredAt', 'DESC')
      .skip(skip)
      .take(limit);

    switch (entityType) {
      case RelatedEntityType.LEAD:
        qb.where('activity.relatedLeadId = :entityId', { entityId });
        break;
      case RelatedEntityType.OPPORTUNITY:
        qb.where('activity.relatedOpportunityId = :entityId', { entityId });
        break;
      case RelatedEntityType.ACCOUNT:
        qb.where('activity.relatedAccountId = :entityId', { entityId });
        break;
      case RelatedEntityType.CONTACT:
        qb.where('activity.relatedContactId = :entityId', { entityId });
        break;
      case RelatedEntityType.PROJECT:
        qb.where('activity.relatedProjectId = :entityId', { entityId });
        break;
      case RelatedEntityType.TICKET:
        qb.where('activity.relatedTicketId = :entityId', { entityId });
        break;
      default:
        throw new BadRequestException('Invalid related entity type for querying activities.');
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }
  
  async findOne(id: string): Promise<Activity> {
    const activity = await this.activityRepository.findOne({
        where: { id },
        relations: ['createdBy', 'assignedTo', 'relatedLead', 'relatedOpportunity', 'relatedAccount', 'relatedContact', 'relatedProject', 'relatedTicket'],
    });
    if (!activity) {
        throw new NotFoundException(`Activity with ID ${id} not found.`);
    }
    return activity;
  }

  // Update and Delete methods would be added here in a similar fashion
  // For brevity, they are omitted but would typically include validation and error handling.
}
