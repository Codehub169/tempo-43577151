import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { LeadStatus, LeadSource, Lead } from '../../types'; // Assuming these types are defined

// Mock user type for assignedToId - replace with actual type and data fetching
interface User {
  id: string;
  name: string;
}

const leadFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100, 'First name must be 100 characters or less'),
  lastName: z.string().min(1, 'Last name is required').max(100, 'Last name must be 100 characters or less'),
  company: z.string().max(100, 'Company name must be 100 characters or less').optional().nullable(),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  phone: z.string().max(20, 'Phone number must be 20 characters or less').optional().nullable(),
  status: z.nativeEnum(LeadStatus).default(LeadStatus.NEW),
  source: z.nativeEnum(LeadSource).optional().nullable(),
  notes: z.string().max(2000, 'Notes must be 2000 characters or less').optional().nullable(),
  estimatedValue: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? null : parseFloat(String(val))),
    z.number().positive('Estimated value must be positive').nullable().optional()
  ),
  assignedToId: z.string().optional().nullable(), // Assuming assignedToId is a string (e.g., UUID or number as string)
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

interface LeadFormProps {
  initialData?: Partial<Lead>;
  onSubmit: (data: LeadFormData) => void;
  isLoading?: boolean;
  onCancel?: () => void;
  users?: User[]; // For assignedTo dropdown
}

export const LeadForm: React.FC<LeadFormProps> = ({ initialData, onSubmit, isLoading, onCancel, users = [] }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      company: '',
      email: '',
      phone: '',
      status: LeadStatus.NEW,
      source: undefined,
      notes: '',
      estimatedValue: null,
      assignedToId: undefined,
      ...initialData,
      estimatedValue: initialData?.estimatedValue !== undefined && initialData.estimatedValue !== null ? Number(initialData.estimatedValue) : null,
      // Ensure assignedToId is a string if it's a number in initialData
      assignedToId: initialData?.assignedToId ? String(initialData.assignedToId) : undefined,
    },
  });

  useEffect(() => {
    if (initialData) {
      const transformedInitialData = {
        ...initialData,
        estimatedValue: initialData.estimatedValue !== undefined && initialData.estimatedValue !== null ? Number(initialData.estimatedValue) : null,
        assignedToId: initialData.assignedToId ? String(initialData.assignedToId) : undefined,
      };
      reset(transformedInitialData as LeadFormData);
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: LeadFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="First Name"
              placeholder="Enter first name"
              error={errors.firstName?.message}
              disabled={isLoading}
            />
          )}
        />
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Last Name"
              placeholder="Enter last name"
              error={errors.lastName?.message}
              disabled={isLoading}
            />
          )}
        />
      </div>

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Email"
            type="email"
            placeholder="Enter email address"
            error={errors.email?.message}
            disabled={isLoading}
          />
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="company"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value || ''} // Ensure value is not null for input
              label="Company"
              placeholder="Enter company name"
              error={errors.company?.message}
              disabled={isLoading}
            />
          )}
        />
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value || ''} // Ensure value is not null for input
              label="Phone"
              placeholder="Enter phone number"
              error={errors.phone?.message}
              disabled={isLoading}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Status
              </label>
              <select
                {...field}
                id="status"
                className="mt-1 block w-full py-2 px-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:opacity-50 dark:text-neutral-100"
                disabled={isLoading}
              >
                {Object.values(LeadStatus).map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase().replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
              {errors.status && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status.message}</p>}
            </div>
          )}
        />
        <Controller
          name="source"
          control={control}
          render={({ field }) => (
            <div>
              <label htmlFor="source" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Source
              </label>
              <select
                {...field}
                value={field.value || ''}
                id="source"
                className="mt-1 block w-full py-2 px-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:opacity-50 dark:text-neutral-100"
                disabled={isLoading}
              >
                <option value="">Select a source</option>
                {Object.values(LeadSource).map((source) => (
                  <option key={source} value={source}>
                    {source.charAt(0).toUpperCase() + source.slice(1).toLowerCase().replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
              {errors.source && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.source.message}</p>}
            </div>
          )}
        />
      </div>

      <Controller
        name="estimatedValue"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            value={field.value === null || field.value === undefined ? '' : String(field.value)} // Handle null/undefined for input
            onChange={(e) => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
            label="Estimated Value ($)"
            type="number"
            placeholder="Enter estimated value"
            error={errors.estimatedValue?.message}
            disabled={isLoading}
            min="0"
            step="0.01"
          />
        )}
      />

      <Controller
        name="assignedToId"
        control={control}
        render={({ field }) => (
          <div>
            <label htmlFor="assignedToId" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Assigned To
            </label>
            <select
              {...field}
              value={field.value || ''}
              id="assignedToId"
              className="mt-1 block w-full py-2 px-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:opacity-50 dark:text-neutral-100"
              disabled={isLoading || users.length === 0}
            >
              <option value="">{users.length === 0 ? 'No users available' : 'Assign to user'}</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            {errors.assignedToId && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.assignedToId.message}</p>}
          </div>
        )}
      />

      <Controller
        name="notes"
        control={control}
        render={({ field }) => (
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Notes
            </label>
            <textarea
              {...field}
              value={field.value || ''} // Ensure value is not null for textarea
              id="notes"
              rows={4}
              placeholder="Enter any relevant notes for this lead"
              className="mt-1 block w-full py-2 px-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:opacity-50 dark:text-neutral-100"
              disabled={isLoading}
            />
            {errors.notes && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.notes.message}</p>}
          </div>
        )}
      />

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
          {initialData ? 'Save Changes' : 'Create Lead'}
        </Button>
      </div>
    </form>
  );
};
