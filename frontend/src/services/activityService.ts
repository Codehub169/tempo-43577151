import { api } from './api';
import {
  Activity,
  CreateActivityDto,
  PaginatedResponse,
  PaginationQueryDto,
  RelatedEntityType,
} from '../types';

/**
 * Creates a new activity.
 * @param activityData The data for the new activity.
 * @returns A promise that resolves to the created activity data.
 */
export const createActivity = async (activityData: CreateActivityDto): Promise<Activity> => {
  const response = await api.post<Activity>('/activities', activityData);
  return response.data;
};

/**
 * Fetches activities related to a specific entity.
 * @param entityType The type of the related entity (e.g., Lead, Account).
 * @param entityId The ID of the related entity.
 * @param params Optional pagination parameters.
 * @returns A promise that resolves to a paginated response of activities.
 */
export const getActivitiesByRelatedEntity = async (
  entityType: RelatedEntityType,
  entityId: string,
  params?: PaginationQueryDto,
): Promise<PaginatedResponse<Activity>> => {
  const response = await api.get<PaginatedResponse<Activity>>(
    `/activities/related/${entityType}/${entityId}`,
    { params },
  );
  return response.data;
};

/**
 * Fetches a single activity by its ID.
 * @param id The ID of the activity to fetch.
 * @returns A promise that resolves to the activity data.
 */
export const getActivityById = async (id: string): Promise<Activity> => {
  const response = await api.get<Activity>(`/activities/${id}`);
  return response.data;
};

// Potential future methods:
// export const updateActivity = async (id: string, data: UpdateActivityDto): Promise<Activity> => { ... };
// export const deleteActivity = async (id: string): Promise<void> => { ... };
