import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';
import { TokenPayload } from '../auth/interfaces/token-payload.interface';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Contacts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new contact' })
  @ApiResponse({ status: 201, description: 'The contact has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 409, description: 'Conflict. Contact with this email already exists for the account.' })
  create(@Body() createContactDto: CreateContactDto, @User() user: TokenPayload) {
    return this.contactsService.create(createContactDto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all contacts (paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved contacts.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.contactsService.findAll(paginationQueryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific contact by ID' })
  @ApiParam({ name: 'id', required: true, type: String, description: 'Contact UUID' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved contact.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Contact not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.contactsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific contact by ID' })
  @ApiParam({ name: 'id', required: true, type: String, description: 'Contact UUID' })
  @ApiResponse({ status: 200, description: 'The contact has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Contact not found.' })
  @ApiResponse({ status: 409, description: 'Conflict. Contact with this email already exists for the account.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateContactDto: UpdateContactDto,
    @User() user: TokenPayload,
  ) {
    return this.contactsService.update(id, updateContactDto, user.sub);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific contact by ID' })
  @ApiParam({ name: 'id', required: true, type: String, description: 'Contact UUID' })
  @ApiResponse({ status: 204, description: 'The contact has been successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Contact not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.contactsService.remove(id);
  }
}
