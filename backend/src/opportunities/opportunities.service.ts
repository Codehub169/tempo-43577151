import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Opportunity, OpportunityStage } from './entities/opportunity.entity';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { User } from '../users/entities/user.entity';
import { Account } from '../accounts/entities/account.entity';
import { Contact } from '../contacts/entities/contact.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class OpportunitiesService {
  constructor(
    @InjectRepository(Opportunity) private readonly opportunityRepository: Repository<Opportunity>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Account) private readonly accountRepository: Repository<Account>,
    @InjectRepository(Contact) private readonly contactRepository: Repository<Contact>,
  ) {}

  async create(createOpportunityDto: CreateOpportunityDto, creatorId: number): Promise<Opportunity> {
    const { name, accountId, contactId, assignedToId, ...restOfDto } = createOpportunityDto;

    const creator = await this.userRepository.findOneBy({ id: creatorId });
    if (!creator) {
      throw new NotFoundException(`User with ID ${creatorId} not found (Creator).`);
    }

    let assignedTo: User | undefined = undefined;
    if (assignedToId) {
      assignedTo = await this.userRepository.findOneBy({ id: assignedToId });
      if (!assignedTo) {
        throw new NotFoundException(`User with ID ${assignedToId} not found (Assigned To).`);
      }
    }

    let account: Account | undefined = undefined;
    if (accountId) {
      account = await this.accountRepository.findOneBy({ id: accountId });
      if (!account) {
        throw new NotFoundException(`Account with ID ${accountId} not found.`);
      }
    }

    let contact: Contact | undefined = undefined;
    if (contactId) {
      contact = await this.contactRepository.findOneBy({ id: contactId });
      if (!contact) {
        throw new NotFoundException(`Contact with ID ${contactId} not found.`);
      }
      // Optional: Validate contact belongs to the account if both are provided
      if (account && contact.accountId !== account.id) {
        throw new BadRequestException(`Contact with ID ${contactId} does not belong to Account with ID ${accountId}.`);
      }
    }

    // Check for duplicate opportunity name for the same account (if account is provided)
    const existingOpportunityQuery: FindOptionsWhere<Opportunity> = { name };
    if (accountId) {
        existingOpportunityQuery.accountId = accountId;
    }
    const existingOpportunity = await this.opportunityRepository.findOneBy(existingOpportunityQuery);
    if (existingOpportunity) {
        const message = accountId 
            ? `An opportunity with name '${name}' already exists for account ID ${accountId}.`
            : `An opportunity with name '${name}' already exists.`;
        throw new ConflictException(message);
    }

    const opportunity = this.opportunityRepository.create({
      ...restOfDto,
      name,
      account,
      contact,
      createdBy: creator,
      assignedTo,
    });

    try {
      return await this.opportunityRepository.save(opportunity);
    } catch (error) {
      // Generic error for database issues
      throw new InternalServerErrorException('Failed to create opportunity. Please try again.');
    }
  }

  async findAll(paginationQueryDto: PaginationQueryDto): Promise<{ data: Opportunity[], total: number, page: number, limit: number }> {
    const { page = 1, limit = 10 } = paginationQueryDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.opportunityRepository.findAndCount({
      skip,
      take: limit,
      relations: ['account', 'contact', 'createdBy', 'assignedTo'],
      order: { createdAt: 'DESC' },
    });

    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Opportunity> {
    const opportunity = await this.opportunityRepository.findOne({
      where: { id },
      relations: ['account', 'contact', 'createdBy', 'assignedTo'],
    });
    if (!opportunity) {
      throw new NotFoundException(`Opportunity with ID ${id} not found.`);
    }
    return opportunity;
  }

  async update(id: number, updateOpportunityDto: UpdateOpportunityDto, updaterId: number): Promise<Opportunity> {
    const opportunity = await this.findOne(id); // Ensures opportunity exists

    const { name, accountId, contactId, assignedToId, lostReason, ...restOfDto } = updateOpportunityDto;

    if (updaterId) {
        const updater = await this.userRepository.findOneBy({ id: updaterId });
        if (!updater) {
            throw new NotFoundException(`User with ID ${updaterId} not found (Updater).`);
        }
        // opportunity.updatedBy = updater; // If you add an updatedBy field
    }

    if (name && name !== opportunity.name) {
        const existingOpportunityQuery: FindOptionsWhere<Opportunity> = { name };
        if (opportunity.accountId) {
            existingOpportunityQuery.accountId = opportunity.accountId;
        }
        const existingOpportunity = await this.opportunityRepository.findOneBy(existingOpportunityQuery);
        if (existingOpportunity && existingOpportunity.id !== id) {
            const message = opportunity.accountId 
                ? `An opportunity with name '${name}' already exists for account ID ${opportunity.accountId}.`
                : `An opportunity with name '${name}' already exists.`;
            throw new ConflictException(message);
        }
        opportunity.name = name;
    }

    if (accountId && accountId !== opportunity.accountId) {
      const account = await this.accountRepository.findOneBy({ id: accountId });
      if (!account) {
        throw new NotFoundException(`Account with ID ${accountId} not found.`);
      }
      opportunity.account = account;
      opportunity.accountId = accountId;
    }

    if (contactId && contactId !== opportunity.contactId) {
      const contact = await this.contactRepository.findOneBy({ id: contactId });
      if (!contact) {
        throw new NotFoundException(`Contact with ID ${contactId} not found.`);
      }
      if (opportunity.account && contact.accountId !== opportunity.account.id) {
        throw new BadRequestException(`Contact with ID ${contactId} does not belong to Account ID ${opportunity.account.id}.`);
      }
      opportunity.contact = contact;
      opportunity.contactId = contactId;
    }

    if (assignedToId && assignedToId !== opportunity.assignedToId) {
      const assignedTo = await this.userRepository.findOneBy({ id: assignedToId });
      if (!assignedTo) {
        throw new NotFoundException(`User with ID ${assignedToId} not found (Assigned To).`);
      }
      opportunity.assignedTo = assignedTo;
      opportunity.assignedToId = assignedToId;
    }

    // Handle lostReason: if stage is Closed Lost, lostReason is required.
    if (updateOpportunityDto.stage === OpportunityStage.CLOSED_LOST && !lostReason) {
      throw new BadRequestException('Lost reason is required when opportunity stage is Closed Lost.');
    }
    if (lostReason) {
        opportunity.lostReason = lostReason;
    }
    if (updateOpportunityDto.stage && updateOpportunityDto.stage !== OpportunityStage.CLOSED_LOST && opportunity.lostReason) {
        opportunity.lostReason = null; // Clear lost reason if stage is not Closed Lost
    }

    Object.assign(opportunity, restOfDto);

    try {
      return await this.opportunityRepository.save(opportunity);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update opportunity. Please try again.');
    }
  }

  async remove(id: number): Promise<void> {
    const opportunity = await this.findOne(id); // Ensures opportunity exists
    const result = await this.opportunityRepository.delete(id);
    if (result.affected === 0) {
      // This case should ideally be caught by findOne, but as a safeguard:
      throw new NotFoundException(`Opportunity with ID ${id} not found or already deleted.`);
    }
  }
}
