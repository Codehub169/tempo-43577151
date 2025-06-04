import api from './api';
import { Contact, CreateContactDto, UpdateContactDto, PaginatedResponse, PaginationQueryDto } from '../types';

/**
 * Fetches a paginated list of contacts.
 * @param params Pagination and filter parameters.
 * @returns A promise that resolves to a paginated response of contacts.
 */
export const getAllContacts = async (params?: PaginationQueryDto): Promise<PaginatedResponse<Contact>> => {
  const response = await api.get<PaginatedResponse<Contact>>('/contacts', { params });
  return response.data;
};

/**
 * Fetches a single contact by its ID.
 * @param id The ID of the contact.
 * @returns A promise that resolves to the contact data.
 */
export const getContactById = async (id: string): Promise<Contact> => {
  const response = await api.get<Contact>(`/contacts/${id}`);
  return response.data;
};

/**
 * Creates a new contact.
 * @param data The data for creating the contact.
 * @returns A promise that resolves to the newly created contact data.
 */
export const createContact = async (data: CreateContactDto): Promise<Contact> => {
  const response = await api.post<Contact>('/contacts', data);
  return response.data;
};

/**
 * Updates an existing contact.
 * @param id The ID of the contact to update.
 * @param data The data for updating the contact.
 * @returns A promise that resolves to the updated contact data.
 */
export const updateContact = async (id: string, data: UpdateContactDto): Promise<Contact> => {
  const response = await api.patch<Contact>(`/contacts/${id}`, data);
  return response.data;
};

/**
 * Deletes a contact by its ID.
 * @param id The ID of the contact to delete.
 * @returns A promise that resolves when the contact is deleted.
 */
export const deleteContact = async (id: string): Promise<void> => {
  await api.delete(`/contacts/${id}`);
};

const contactService = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};

export default contactService;
