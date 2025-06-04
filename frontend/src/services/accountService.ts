import api from './api';
import { Account, CreateAccountDto, UpdateAccountDto, PaginatedResponse, PaginationQueryDto } from '../types';

/**
 * Fetches a paginated list of accounts.
 * @param params Pagination and filter parameters.
 * @returns A promise that resolves to a paginated response of accounts.
 */
export const getAllAccounts = async (params?: PaginationQueryDto): Promise<PaginatedResponse<Account>> => {
  const response = await api.get<PaginatedResponse<Account>>('/accounts', { params });
  return response.data;
};

/**
 * Fetches a single account by its ID.
 * @param id The ID of the account.
 * @returns A promise that resolves to the account data.
 */
export const getAccountById = async (id: string): Promise<Account> => {
  const response = await api.get<Account>(`/accounts/${id}`);
  return response.data;
};

/**
 * Creates a new account.
 * @param data The data for creating the account.
 * @returns A promise that resolves to the newly created account data.
 */
export const createAccount = async (data: CreateAccountDto): Promise<Account> => {
  const response = await api.post<Account>('/accounts', data);
  return response.data;
};

/**
 * Updates an existing account.
 * @param id The ID of the account to update.
 * @param data The data for updating the account.
 * @returns A promise that resolves to the updated account data.
 */
export const updateAccount = async (id: string, data: UpdateAccountDto): Promise<Account> => {
  const response = await api.patch<Account>(`/accounts/${id}`, data);
  return response.data;
};

/**
 * Deletes an account by its ID.
 * @param id The ID of the account to delete.
 * @returns A promise that resolves when the account is deleted.
 */
export const deleteAccount = async (id: string): Promise<void> => {
  await api.delete(`/accounts/${id}`);
};

const accountService = {
  getAllAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
};

export default accountService;
