import type { SVGProps } from 'react';

// --- ENUMS ---

export enum UserRole {
  ADMIN = 'ADMIN',
  SALES_MANAGER = 'SALES_MANAGER',
  SALES_REP = 'SALES_REP',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  SUPPORT_AGENT = 'SUPPORT_AGENT',
  USER = 'USER',
}

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  UNQUALIFIED = 'UNQUALIFIED',
  CONVERTED = 'CONVERTED',
}

export enum LeadSource {
  WEBSITE = 'WEBSITE',
  REFERRAL = 'REFERRAL',
  COLD_CALL = 'COLD_CALL',
  EMAIL_CAMPAIGN = 'EMAIL_CAMPAIGN',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  ADVERTISEMENT = 'ADVERTISEMENT',
  EVENT = 'EVENT',
  OTHER = 'OTHER',
}

export enum OpportunityStage {
  PROSPECTING = 'PROSPECTING',
  QUALIFICATION = 'QUALIFICATION',
  NEEDS_ANALYSIS = 'NEEDS_ANALYSIS',
  VALUE_PROPOSITION = 'VALUE_PROPOSITION',
  PROPOSAL_SENT = 'PROPOSAL_SENT',
  NEGOTIATION = 'NEGOTIATION',
  CLOSED_WON = 'CLOSED_WON',
  CLOSED_LOST = 'CLOSED_LOST',
}

export enum ProjectStatus {
  NOT_STARTED = 'NOT_STARTED',
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  REOPENED = 'REOPENED',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum ActivityType {
  CALL = 'CALL',
  EMAIL = 'EMAIL',
  MEETING = 'MEETING',
  TASK = 'TASK',
  NOTE = 'NOTE',
  DEADLINE = 'DEADLINE',
}

export enum RelatedEntityType {
  LEAD = 'LEAD',
  OPPORTUNITY = 'OPPORTUNITY',
  ACCOUNT = 'ACCOUNT',
  CONTACT = 'CONTACT',
  PROJECT = 'PROJECT',
  TICKET = 'TICKET',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

// --- BASE ENTITIES ---

export interface User {
  id: number;
  name: string;
  email: string;
  roles: UserRole[];
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
  // password field is intentionally omitted on frontend
}

export interface Address {
  street?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
}

export interface Account {
  id: string; // UUID
  name: string;
  industry?: string | null;
  website?: string | null;
  phone?: string | null;
  billingAddress?: Address | null;
  shippingAddress?: Address | null;
  description?: string | null;
  createdById: number;
  assignedToId?: number | null;
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
}

export interface Contact {
  id: string; // UUID
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  jobTitle?: string | null;
  description?: string | null;
  accountId?: string | null; // UUID
  createdById: number;
  assignedToId?: number | null;
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
  deletedAt?: string | null; // ISO Date String for soft delete
}

export interface Lead {
  id: number;
  firstName: string;
  lastName: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  status: LeadStatus;
  source?: LeadSource | null;
  notes?: string | null;
  estimatedValue?: number | null;
  createdById: number;
  assignedToId?: number | null;
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
}

export interface Opportunity {
  id: number;
  name: string;
  accountId: string; // UUID
  contactId?: string | null; // UUID
  stage: OpportunityStage;
  value?: number | null;
  expectedCloseDate?: string | null; // ISO Date String
  description?: string | null;
  lostReason?: string | null;
  createdById: number;
  assignedToId?: number | null;
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
}

export interface Project {
  id: string; // UUID
  name: string;
  description?: string | null;
  status: ProjectStatus;
  startDate?: string | null; // ISO Date String
  endDate?: string | null; // ISO Date String
  budget?: number | null;
  accountId: string; // UUID
  projectManagerId?: number | null;
  teamMemberIds: number[];
  createdById: number;
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
}

export interface Ticket {
  id: string; // UUID
  title: string;
  description?: string | null;
  status: TicketStatus;
  priority: TicketPriority;
  accountId?: string | null; // UUID
  projectId?: string | null; // UUID
  createdById: number;
  assignedToId?: number | null;
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
  deletedAt?: string | null; // ISO Date String for soft delete
}

export interface TicketComment {
  id: string; // UUID
  content: string;
  ticketId: string; // UUID
  authorId: number;
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
}

export interface Activity {
  id: string; // UUID
  type: ActivityType;
  subject?: string | null;
  body: string;
  occurredAt: string; // ISO Date String
  durationMinutes?: number | null;
  outcome?: string | null;
  createdById: number;
  assignedToId?: number | null;
  relatedLeadId?: number | null;
  relatedOpportunityId?: number | null;
  relatedAccountId?: string | null; // UUID
  relatedContactId?: string | null; // UUID
  relatedProjectId?: string | null; // UUID
  relatedTicketId?: string | null; // UUID
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
}

// --- DATA TRANSFER OBJECTS (DTOs) for API Payloads ---

export interface CreateUserDto {
  name: string;
  email: string;
  password?: string; // Password might not always be part of DTOs used directly in forms if handled separately
  roles?: UserRole[];
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}

export interface CreateLeadDto {
  firstName: string;
  lastName: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  status?: LeadStatus;
  source?: LeadSource | null;
  notes?: string | null;
  estimatedValue?: number | null;
  assignedToId?: number | null;
}

export interface UpdateLeadDto extends Partial<CreateLeadDto> {}

export interface ConvertLeadDto {
  opportunityName: string;
  createAccount?: boolean;
  accountId?: string; // UUID
  createContact?: boolean;
  contactId?: string; // UUID
  opportunityStage?: OpportunityStage;
  opportunityValue?: number;
}

export interface CreateOpportunityDto {
  name: string;
  accountId: string; // UUID
  contactId?: string | null; // UUID
  stage?: OpportunityStage;
  value?: number | null;
  expectedCloseDate?: string | null; // ISO Date String
  description?: string | null;
  assignedToId?: number | null;
}

export interface UpdateOpportunityDto extends Partial<CreateOpportunityDto> {
  lostReason?: string | null;
}

export interface CreateAccountDto {
  name: string;
  industry?: string | null;
  website?: string | null;
  phone?: string | null;
  billingAddress?: Address | null;
  shippingAddress?: Address | null;
  description?: string | null;
  assignedToId?: number | null;
}

export interface UpdateAccountDto extends Partial<CreateAccountDto> {}

export interface CreateContactDto {
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  jobTitle?: string | null;
  description?: string | null;
  accountId?: string | null; // UUID
  assignedToId?: number | null;
}

export interface UpdateContactDto extends Partial<CreateContactDto> {}

export interface CreateProjectDto {
  name: string;
  description?: string | null;
  status?: ProjectStatus;
  startDate?: string | null; // ISO Date String
  endDate?: string | null; // ISO Date String
  budget?: number | null;
  accountId: string; // UUID
  projectManagerId?: number | null;
  teamMemberIds?: number[];
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {}

export interface CreateTicketDto {
  title: string;
  description?: string | null;
  status?: TicketStatus;
  priority?: TicketPriority;
  accountId?: string | null; // UUID
  projectId?: string | null; // UUID
  assignedToId?: number | null;
}

export interface UpdateTicketDto extends Partial<CreateTicketDto> {}

export interface AddCommentDto {
  content: string;
}

export interface RelatedEntityDto {
  entityType: RelatedEntityType;
  entityId: string; // Can be number or string (UUID) depending on entityType, handled in service
}

export interface CreateActivityDto {
  type: ActivityType;
  subject?: string | null;
  body: string;
  occurredAt?: string; // ISO Date String
  durationMinutes?: number | null;
  outcome?: string | null;
  assignedToId?: number | null;
  relatedTo: RelatedEntityDto;
}

// --- API & UI SPECIFIC TYPES ---

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  search?: string;
  // Additional filter params can be added here
  [key: string]: any; 
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password?: string; // Password might be optional if using social logins in future
}

export interface NavItem {
  path: string;
  name: string;
  icon?: React.FC<SVGProps<SVGSVGElement>> | React.ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & React.RefAttributes<SVGSVGElement>>;
  exact?: boolean;
  children?: NavItem[];
  disabled?: boolean;
  roles?: UserRole[]; // For role-based visibility
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.FC<SVGProps<SVGSVGElement>>;
}

export interface StatCardData {
  title: string;
  value: string | number;
  icon?: React.FC<SVGProps<SVGSVGElement>>;
  change?: string;
  changeType?: 'positive' | 'negative';
  link?: string;
  unit?: string;
}

export interface PipelineStageData {
  name: string;
  value: number;
  count: number;
  color: string;
}

export interface OpenTicketsPriorityCount {
  low: number;
  medium: number;
  high: number;
  urgent: number;
}

export interface OpenTicketsData {
  totalOpen: number;
  byPriority: OpenTicketsPriorityCount;
}

// Enriched types for displaying data with resolved relations
export interface EnrichedUser extends User {}

export interface EnrichedLead extends Lead {
  createdByUser?: User | null;
  assignedToUser?: User | null;
}

export interface EnrichedOpportunity extends Opportunity {
  account?: Account | null;
  contact?: Contact | null;
  createdByUser?: User | null;
  assignedToUser?: User | null;
}

export interface EnrichedAccount extends Account {
  createdByUser?: User | null;
  assignedToUser?: User | null;
  contacts?: Contact[];
  opportunities?: Opportunity[];
  projects?: Project[];
  tickets?: Ticket[];
}

export interface EnrichedContact extends Contact {
  account?: Account | null;
  createdByUser?: User | null;
  assignedToUser?: User | null;
  opportunities?: Opportunity[];
}

export interface EnrichedProject extends Project {
  account?: Account | null;
  projectManager?: User | null;
  createdByUser?: User | null;
  teamMembers?: User[];
}

export interface EnrichedTicket extends Ticket {
  account?: Account | null;
  project?: Project | null;
  createdByUser?: User | null;
  assignedToUser?: User | null;
  comments?: EnrichedTicketComment[];
}

export interface EnrichedTicketComment extends TicketComment {
  author?: User | null;
}

export interface EnrichedActivity extends Activity {
  createdByUser?: User | null;
  assignedToUser?: User | null;
  relatedLead?: Lead | null;
  relatedOpportunity?: Opportunity | null;
  relatedAccount?: Account | null;
  relatedContact?: Contact | null;
  relatedProject?: Project | null;
  relatedTicket?: Ticket | null;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  errors?: ApiErrorDetail[] | string[]; // Can be an array of detailed errors or simple messages
  error?: string; // Sometimes NestJS uses this field for general error type
}

// Type for form field errors in react-hook-form
export type FieldErrors<T> = {
  [K in keyof T]?: {
    message?: string;
  };
} & { root?: { message?: string } };


// Generic type for select options
export interface SelectOption<T = string | number> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}
