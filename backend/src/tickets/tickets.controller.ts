import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';
import { TokenPayload } from '../auth/interfaces/token-payload.interface';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Ticket } from './entities/ticket.entity';

@ApiTags('Tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ticket' })
  @ApiResponse({ status: 201, description: 'The ticket has been successfully created.', type: Ticket })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Not Found - Related entity (user, account, project) not found.' })
  create(@Body() createTicketDto: CreateTicketDto, @User() user: TokenPayload): Promise<Ticket> {
    return this.ticketsService.create(createTicketDto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tickets with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved tickets.', type: [Ticket] }) // Note: Actual response is { data: Ticket[], total: number, ...}
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.ticketsService.findAll(paginationQueryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific ticket by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'Ticket ID' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved ticket.', type: Ticket })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Ticket not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Ticket> {
    return this.ticketsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a ticket by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'Ticket ID' })
  @ApiResponse({ status: 200, description: 'The ticket has been successfully updated.', type: Ticket })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Not Found - Ticket or related entity not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTicketDto: UpdateTicketDto,
    @User() user: TokenPayload,
  ): Promise<Ticket> {
    return this.ticketsService.update(id, updateTicketDto, user.sub);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a ticket by ID (Soft delete)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'Ticket ID' })
  @ApiResponse({ status: 204, description: 'The ticket has been successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Ticket not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.ticketsService.remove(id);
  }
}
