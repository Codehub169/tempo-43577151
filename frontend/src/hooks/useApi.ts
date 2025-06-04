import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';

interface UseApiOptions<T> {
  initialData?: T | null;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
}

interface UseApiResult<T, P extends any[]> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  execute: (...args: P) => Promise<T | undefined>;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

/**
 * Custom hook for making API calls.
 * Manages loading, error, and data states.
 * @param apiFunc The API function to call (e.g., leadService.getAllLeads).
 * @param options Optional configuration for initial data, success/error callbacks.
 */
export function useApi<T, P extends any[] = any[]>(
  apiFunc: (...args: P) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiResult<T, P> {
  const { initialData = null, onSuccess, onError } = options;
  const [data, setData] = useState<T | null>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: P): Promise<T | undefined> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiFunc(...args);
      setData(result);
      if (onSuccess) {
        onSuccess(result);
      }
      return result;
    } catch (err: any) {
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (err instanceof AxiosError) {
        if (err.response?.data?.message) {
          errorMessage = Array.isArray(err.response.data.message) 
            ? err.response.data.message.join(', ') 
            : err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      if (onError) {
        onError(err);
      }
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, [apiFunc, onSuccess, onError]);

  return { data, isLoading, error, execute, setData, setError };
}
