import { api } from './api';
import {
  Project,
  CreateProjectDto,
  UpdateProjectDto,
  PaginatedResponse,
  PaginationQueryDto,
} from '../types';

/**
 * Fetches a paginated list of projects.
 * @param params Optional pagination parameters (page, limit).
 * @returns A promise that resolves to a paginated response of projects.
 */
export const getAllProjects = async (
  params?: PaginationQueryDto,
): Promise<PaginatedResponse<Project>> => {
  const response = await api.get<PaginatedResponse<Project>>('/projects', { params });
  return response.data;
};

/**
 * Fetches a single project by its ID.
 * @param id The ID of the project to fetch.
 * @returns A promise that resolves to the project data.
 */
export const getProjectById = async (id: string): Promise<Project> => {
  const response = await api.get<Project>(`/projects/${id}`);
  return response.data;
};

/**
 * Creates a new project.
 * @param projectData The data for the new project.
 * @returns A promise that resolves to the created project data.
 */
export const createProject = async (projectData: CreateProjectDto): Promise<Project> => {
  const response = await api.post<Project>('/projects', projectData);
  return response.data;
};

/**
 * Updates an existing project.
 * @param id The ID of the project to update.
 * @param projectData The data to update the project with.
 * @returns A promise that resolves to the updated project data.
 */
export const updateProject = async (
  id: string,
  projectData: UpdateProjectDto,
): Promise<Project> => {
  const response = await api.patch<Project>(`/projects/${id}`, projectData);
  return response.data;
};

/**
 * Deletes a project by its ID.
 * @param id The ID of the project to delete.
 * @returns A promise that resolves when the project is deleted.
 */
export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/projects/${id}`);
};
