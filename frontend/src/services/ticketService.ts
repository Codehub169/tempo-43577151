import { api } from './api';
import {
  Ticket,
  TicketComment,
  CreateTicketDto,
  UpdateTicketDto,
  AddCommentDto,
  PaginatedResponse,
  PaginationQueryDto,
} from '../types';

/**
 * Fetches a paginated list of tickets.
 * @param params Optional pagination parameters (page, limit).
 * @returns A promise that resolves to a paginated response of tickets.
 */
export const getAllTickets = async (
  params?: PaginationQueryDto,
): Promise<PaginatedResponse<Ticket>> => {
  const response = await api.get<PaginatedResponse<Ticket>>('/tickets', { params });
  return response.data;
};

/**
 * Fetches a single ticket by its ID.
 * @param id The ID of the ticket to fetch.
 * @returns A promise that resolves to the ticket data.
 */
export const getTicketById = async (id: string): Promise<Ticket> => {
  const response = await api.get<Ticket>(`/tickets/${id}`);
  return response.data;
};

/**
 * Creates a new ticket.
 * @param ticketData The data for the new ticket.
 * @returns A promise that resolves to the created ticket data.
 */
export const createTicket = async (ticketData: CreateTicketDto): Promise<Ticket> => {
  const response = await api.post<Ticket>('/tickets', ticketData);
  return response.data;
};

/**
 * Updates an existing ticket.
 * @param id The ID of the ticket to update.
 * @param ticketData The data to update the ticket with.
 * @returns A promise that resolves to the updated ticket data.
 */
export const updateTicket = async (
  id: string,
  ticketData: UpdateTicketDto,
): Promise<Ticket> => {
  const response = await api.patch<Ticket>(`/tickets/${id}`, ticketData);
  return response.data;
};

/**
 * Deletes a ticket by its ID.
 * @param id The ID of the ticket to delete.
 * @returns A promise that resolves when the ticket is deleted.
 */
export const deleteTicket = async (id: string): Promise<void> => {
  await api.delete(`/tickets/${id}`);
};

/**
 * Adds a comment to a ticket.
 * @param ticketId The ID of the ticket to add a comment to.
 * @param commentData The data for the new comment.
 * @returns A promise that resolves to the created ticket comment data.
 */
export const addCommentToTicket = async (
  ticketId: string,
  commentData: AddCommentDto,
): Promise<TicketComment> => {
  const response = await api.post<TicketComment>(
    `/tickets/${ticketId}/comments`,
    commentData,
  );
  return response.data;
};

/**
 * Fetches all comments for a specific ticket.
 * @param ticketId The ID of the ticket.
 * @returns A promise that resolves to an array of ticket comments.
 */
export const getTicketComments = async (ticketId: string): Promise<TicketComment[]> => {
  const response = await api.get<TicketComment[]>(`/tickets/${ticketId}/comments`);
  return response.data;
};
