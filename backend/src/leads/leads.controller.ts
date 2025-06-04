import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Query, 
  ParseIntPipe, 
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';
import { TokenPayload } from '../auth/interfaces/token-payload.interface';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Leads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lead' })
  @ApiResponse({ status: 201, description: 'Lead created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() createLeadDto: CreateLeadDto, @User() user: TokenPayload) {
    // Assuming creatorId or assignedToId might be set using user.sub (user ID from token)
    return this.leadsService.create(createLeadDto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all leads' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiResponse({ status: 200, description: 'List of leads retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.leadsService.findAll(paginationQueryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a lead by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Lead ID' })
  @ApiResponse({ status: 200, description: 'Lead details retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Lead not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.leadsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a lead by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Lead ID' })
  @ApiResponse({ status: 200, description: 'Lead updated successfully.' })
  @ApiResponse({ status: 404, description: 'Lead not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateLeadDto: UpdateLeadDto, @User() user: TokenPayload) {
    // user.sub could be used to log who updated the lead or for specific permissions
    return this.leadsService.update(id, updateLeadDto, user.sub);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a lead by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Lead ID' })
  @ApiResponse({ status: 204, description: 'Lead deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Lead not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  remove(@Param('id', ParseIntPipe) id: number, @User() user: TokenPayload) {
    // user.sub could be used for audit logging or permission checks
    return this.leadsService.remove(id);
  }
}
