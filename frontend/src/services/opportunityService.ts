import api from './api';
import { Opportunity, CreateOpportunityDto, UpdateOpportunityDto, PaginatedResponse, PaginationQueryDto } from '../types';

/**
 * Fetches a paginated list of opportunities.
 * @param params Pagination and filter parameters.
 * @returns A promise that resolves to a paginated response of opportunities.
 */
export const getAllOpportunities = async (params?: PaginationQueryDto): Promise<PaginatedResponse<Opportunity>> => {
  const response = await api.get<PaginatedResponse<Opportunity>>('/opportunities', { params });
  return response.data;
};

/**
 * Fetches a single opportunity by its ID.
 * @param id The ID of the opportunity.
 * @returns A promise that resolves to the opportunity data.
 */
export const getOpportunityById = async (id: string): Promise<Opportunity> => {
  const response = await api.get<Opportunity>(`/opportunities/${id}`);
  return response.data;
};

/**
 * Creates a new opportunity.
 * @param data The data for creating the opportunity.
 * @returns A promise that resolves to the newly created opportunity data.
 */
export const createOpportunity = async (data: CreateOpportunityDto): Promise<Opportunity> => {
  const response = await api.post<Opportunity>('/opportunities', data);
  return response.data;
};

/**
 * Updates an existing opportunity.
 * @param id The ID of the opportunity to update.
 * @param data The data for updating the opportunity.
 * @returns A promise that resolves to the updated opportunity data.
 */
export const updateOpportunity = async (id: string, data: UpdateOpportunityDto): Promise<Opportunity> => {
  const response = await api.patch<Opportunity>(`/opportunities/${id}`, data);
  return response.data;
};

/**
 * Deletes an opportunity by its ID.
 * @param id The ID of the opportunity to delete.
 * @returns A promise that resolves when the opportunity is deleted.
 */
export const deleteOpportunity = async (id: string): Promise<void> => {
  await api.delete(`/opportunities/${id}`);
};

const opportunityService = {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
};

export default opportunityService;
