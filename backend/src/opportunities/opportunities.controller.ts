import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { OpportunitiesService } from './opportunities.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';
import { TokenPayload } from '../auth/interfaces/token-payload.interface';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Opportunity, OpportunityStage } from './entities/opportunity.entity';

@ApiTags('Opportunities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new opportunity' })
  @ApiResponse({ status: 201, description: 'The opportunity has been successfully created.', type: Opportunity })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() createOpportunityDto: CreateOpportunityDto, @User() user: TokenPayload) {
    return this.opportunitiesService.create(createOpportunityDto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all opportunities' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiResponse({ status: 200, description: 'List of opportunities.', type: [Opportunity] }) // Type should be an array response
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.opportunitiesService.findAll(paginationQueryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an opportunity by ID' })
  @ApiParam({ name: 'id', description: 'Opportunity ID', type: Number })
  @ApiResponse({ status: 200, description: 'The opportunity details.', type: Opportunity })
  @ApiResponse({ status: 404, description: 'Opportunity not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.opportunitiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an opportunity by ID' })
  @ApiParam({ name: 'id', description: 'Opportunity ID', type: Number })
  @ApiResponse({ status: 200, description: 'The opportunity has been successfully updated.', type: Opportunity })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Opportunity not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOpportunityDto: UpdateOpportunityDto,
    @User() user: TokenPayload,
  ) {
    return this.opportunitiesService.update(id, updateOpportunityDto, user.sub);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an opportunity by ID' })
  @ApiParam({ name: 'id', description: 'Opportunity ID', type: Number })
  @ApiResponse({ status: 204, description: 'The opportunity has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Opportunity not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.opportunitiesService.remove(id);
  }
}
