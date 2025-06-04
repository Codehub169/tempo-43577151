import { Injectable, NotFoundException, ConflictException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { User } from '../users/entities/user.entity';
import { Account } from '../accounts/entities/account.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact) private readonly contactRepository: Repository<Contact>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Account) private readonly accountRepository: Repository<Account>,
  ) {}

  async create(createContactDto: CreateContactDto, creatorId: string): Promise<Contact> {
    const { accountId, email, ...restDto } = createContactDto;

    // Check for existing contact with the same email within the same account (if email and accountId are provided)
    if (email && accountId) {
      const existingContactByEmail = await this.contactRepository.findOne({
        where: { email, accountId },
      });
      if (existingContactByEmail) {
        throw new ConflictException(`Contact with email '${email}' already exists for this account.`);
      }
    }

    const contact = this.contactRepository.create(restDto);

    if (creatorId) {
      const creator = await this.userRepository.findOneBy({ id: creatorId });
      if (!creator) {
        throw new NotFoundException(`User with ID '${creatorId}' not found.`);
      }
      contact.createdBy = creator;
    }

    if (accountId) {
      const account = await this.accountRepository.findOneBy({ id: accountId });
      if (!account) {
        throw new NotFoundException(`Account with ID '${accountId}' not found.`);
      }
      contact.account = account;
      contact.accountId = accountId; // Ensure accountId is set if account is linked
    }

    try {
      return await this.contactRepository.save(contact);
    } catch (error) {
      // Generic error for other potential database issues
      throw new InternalServerErrorException('Failed to create contact.');
    }
  }

  async findAll(paginationQueryDto: PaginationQueryDto): Promise<{ data: Contact[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = paginationQueryDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.contactRepository.findAndCount({
      skip,
      take: limit,
      relations: ['account', 'createdBy', 'assignedTo'],
      order: { createdAt: 'DESC' },
    });

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Contact> {
    const contact = await this.contactRepository.findOne({
      where: { id },
      relations: ['account', 'createdBy', 'assignedTo', 'opportunities'],
    });
    if (!contact) {
      throw new NotFoundException(`Contact with ID '${id}' not found.`);
    }
    return contact;
  }

  async update(id: string, updateContactDto: UpdateContactDto, updaterId: string): Promise<Contact> {
    const contact = await this.findOne(id); // Ensures contact exists

    const { accountId, email, assignedToId, ...restDto } = updateContactDto;

    // Check for email conflict if email is being changed or set
    if (email && email !== contact.email && accountId) {
      const existingContactByEmail = await this.contactRepository.findOne({
        where: { email, accountId, id: FindOptionsWhere<Contact>({ id: `!=${id}` }) }, // Exclude current contact
      });
      if (existingContactByEmail) {
        throw new ConflictException(`Another contact with email '${email}' already exists for this account.`);
      }
    }
    if (email && email !== contact.email && !accountId && contact.accountId) { // email changed, accountId removed, but contact had an account
       const existingContactByEmail = await this.contactRepository.findOne({
        where: { email, accountId: contact.accountId, id: FindOptionsWhere<Contact>({ id: `!=${id}` }) },
      });
      if (existingContactByEmail) {
        throw new ConflictException(`Another contact with email '${email}' already exists for account ID '${contact.accountId}'.`);
      }
    }

    // Update assignedTo user if provided
    if (assignedToId) {
      const assignToUser = await this.userRepository.findOneBy({ id: assignedToId });
      if (!assignToUser) {
        throw new NotFoundException(`User to assign (ID: '${assignedToId}') not found.`);
      }
      contact.assignedTo = assignToUser;
    } else if (updateContactDto.hasOwnProperty('assignedToId') && assignedToId === null) {
      contact.assignedTo = null; // Allow unassignment
    }

    // Update account if accountId is provided
    if (accountId) {
      const account = await this.accountRepository.findOneBy({ id: accountId });
      if (!account) {
        throw new NotFoundException(`Account with ID '${accountId}' not found.`);
      }
      contact.account = account;
      contact.accountId = accountId;
    } else if (updateContactDto.hasOwnProperty('accountId') && accountId === null) {
      contact.account = null;
      contact.accountId = null;
    }

    // Update lastUpdatedBy (if you have such a field, typically done via a subscriber or here)
    // For now, we use updaterId for potential audit logging, not direct entity field update.

    Object.assign(contact, restDto);
    if(email) contact.email = email; // ensure email is updated if provided

    try {
      return await this.contactRepository.save(contact);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update contact.');
    }
  }

  async remove(id: string): Promise<void> {
    const contact = await this.findOne(id); // Ensures contact exists
    const result = await this.contactRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Contact with ID '${id}' not found or already removed.`);
    }
  }
}
