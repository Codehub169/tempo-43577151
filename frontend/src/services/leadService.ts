import api from './api';
import { Lead, CreateLeadDto, UpdateLeadDto, ConvertLeadDto, PaginatedResponse, PaginationQueryDto } from '../types';

/**
 * Fetches a paginated list of leads.
 * @param params Pagination and filter parameters.
 * @returns A promise that resolves to a paginated response of leads.
 */
export const getAllLeads = async (params?: PaginationQueryDto): Promise<PaginatedResponse<Lead>> => {
  const response = await api.get<PaginatedResponse<Lead>>('/leads', { params });
  return response.data;
};

/**
 * Fetches a single lead by its ID.
 * @param id The ID of the lead.
 * @returns A promise that resolves to the lead data.
 */
export const getLeadById = async (id: string): Promise<Lead> => {
  const response = await api.get<Lead>(`/leads/${id}`);
  return response.data;
};

/**
 * Creates a new lead.
 * @param data The data for creating the lead.
 * @returns A promise that resolves to the newly created lead data.
 */
export const createLead = async (data: CreateLeadDto): Promise<Lead> => {
  const response = await api.post<Lead>('/leads', data);
  return response.data;
};

/**
 * Updates an existing lead.
 * @param id The ID of the lead to update.
 * @param data The data for updating the lead.
 * @returns A promise that resolves to the updated lead data.
 */
export const updateLead = async (id: string, data: UpdateLeadDto): Promise<Lead> => {
  const response = await api.patch<Lead>(`/leads/${id}`, data);
  return response.data;
};

/**
 * Deletes a lead by its ID.
 * @param id The ID of the lead to delete.
 * @returns A promise that resolves when the lead is deleted.
 */
export const deleteLead = async (id: string): Promise<void> => {
  await api.delete(`/leads/${id}`);
};

/**
 * Converts a lead into an opportunity, account, and/or contact.
 * @param id The ID of the lead to convert.
 * @param data The conversion parameters.
 * @returns A promise that resolves to the result of the conversion (e.g., newly created opportunity).
 */
export const convertLead = async (id: string, data: ConvertLeadDto): Promise<any> => { // TODO: Define a proper response type for lead conversion
  const response = await api.post(`/leads/${id}/convert`, data);
  return response.data;
};

const leadService = {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  convertLead,
};

export default leadService;
