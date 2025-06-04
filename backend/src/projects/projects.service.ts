import { Injectable, NotFoundException, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Project, ProjectStatus } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { User } from '../users/entities/user.entity';
import { Account } from '../accounts/entities/account.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(createProjectDto: CreateProjectDto, creatorId: number): Promise<Project> {
    const { name, accountId, projectManagerId, teamMemberIds, ...restDto } = createProjectDto;

    const creator = await this.userRepository.findOneBy({ id: creatorId });
    if (!creator) {
      throw new BadRequestException(`User with ID ${creatorId} not found.`);
    }

    const account = await this.accountRepository.findOneBy({ id: accountId });
    if (!account) {
      throw new BadRequestException(`Account with ID ${accountId} not found.`);
    }

    // Check for duplicate project name within the same account
    const existingProject = await this.projectRepository.findOne({
      where: { name, accountId },
    });
    if (existingProject) {
      throw new ConflictException(`A project with name '${name}' already exists for account '${account.name}'.`);
    }

    const project = this.projectRepository.create({
      ...restDto,
      name,
      account,
      accountId,
      createdBy: creator,
      createdById: creatorId,
      status: createProjectDto.status || ProjectStatus.NOT_STARTED,
    });

    if (projectManagerId) {
      const projectManager = await this.userRepository.findOneBy({ id: projectManagerId });
      if (!projectManager) {
        throw new BadRequestException(`Project manager with ID ${projectManagerId} not found.`);
      }
      project.projectManager = projectManager;
      project.projectManagerId = projectManagerId;
    }

    if (teamMemberIds && teamMemberIds.length > 0) {
      const teamMembers = await this.userRepository.find({ where: { id: In(teamMemberIds) } });
      if (teamMembers.length !== teamMemberIds.length) {
        throw new BadRequestException('One or more team member IDs are invalid.');
      }
      project.teamMembers = teamMembers;
    }

    try {
      return await this.projectRepository.save(project);
    } catch (error) {
      // Log error: e.g., this.logger.error('Failed to create project', error.stack);
      throw new InternalServerErrorException('Failed to create project.');
    }
  }

  async findAll(paginationQueryDto: PaginationQueryDto, accountId?: string): Promise<{ data: Project[], total: number, page: number, limit: number }> {
    const { page = 1, limit = 10 } = paginationQueryDto;
    const skip = (page - 1) * limit;

    const whereConditions: any = {};
    if (accountId) {
      whereConditions.accountId = accountId;
    }

    const [data, total] = await this.projectRepository.findAndCount({
      where: whereConditions,
      relations: ['account', 'projectManager', 'createdBy', 'teamMembers'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['account', 'projectManager', 'createdBy', 'teamMembers'],
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found.`);
    }
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, updaterId: number): Promise<Project> {
    const project = await this.findOne(id); // Ensures project exists and loads relations

    const { name, accountId, projectManagerId, teamMemberIds, ...restDto } = updateProjectDto;

    // Check for updater user (optional, for audit or specific permission checks)
    // const updater = await this.userRepository.findOneBy({ id: updaterId });
    // if (!updater) throw new BadRequestException(`Updater user with ID ${updaterId} not found.`);

    if (name && accountId && (name !== project.name || accountId !== project.accountId)) {
      const existingProject = await this.projectRepository.findOne({
        where: { name, accountId },
      });
      if (existingProject && existingProject.id !== id) {
        throw new ConflictException(`A project with name '${name}' already exists for the specified account.`);
      }
    } else if (name && !accountId && name !== project.name) {
        const existingProject = await this.projectRepository.findOne({
            where: { name, accountId: project.accountId },
          });
          if (existingProject && existingProject.id !== id) {
            throw new ConflictException(`A project with name '${name}' already exists for account '${project.account.name}'.`);
          }
    }

    if (accountId && accountId !== project.accountId) {
      const account = await this.accountRepository.findOneBy({ id: accountId });
      if (!account) {
        throw new BadRequestException(`Account with ID ${accountId} not found.`);
      }
      project.account = account;
      project.accountId = accountId;
    }

    if (projectManagerId !== undefined) { // Allows setting to null
      if (projectManagerId === null) {
        project.projectManager = null;
        project.projectManagerId = null;
      } else {
        const projectManager = await this.userRepository.findOneBy({ id: projectManagerId });
        if (!projectManager) {
          throw new BadRequestException(`Project manager with ID ${projectManagerId} not found.`);
        }
        project.projectManager = projectManager;
        project.projectManagerId = projectManagerId;
      }
    }

    if (teamMemberIds) {
        if (teamMemberIds.length === 0) {
            project.teamMembers = [];
        } else {
            const teamMembers = await this.userRepository.find({ where: { id: In(teamMemberIds) } });
            if (teamMembers.length !== teamMemberIds.length) {
                throw new BadRequestException('One or more team member IDs are invalid for update.');
            }
            project.teamMembers = teamMembers;
        }
    }

    Object.assign(project, restDto);
    if (name) project.name = name;

    try {
      return await this.projectRepository.save(project);
    } catch (error) {
      // Log error
      throw new InternalServerErrorException('Failed to update project.');
    }
  }

  async remove(id: string): Promise<void> {
    const project = await this.findOne(id);
    try {
      await this.projectRepository.remove(project);
    } catch (error) {
        // Log error
        throw new InternalServerErrorException('Failed to remove project.');
    }
  }
}
