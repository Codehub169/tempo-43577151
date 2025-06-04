import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ActivityType, RelatedEntityType, User } from '../../types'; // Assuming these types are defined

// Mock user type for assignedToId - replace with actual type and data fetching
// interface User { id: string; name: string; } // Already defined in LeadForm, assuming shared scope or import from types

const relatedEntitySchema = z.object({
  entityType: z.nativeEnum(RelatedEntityType),
  entityId: z.string().uuid('Entity ID must be a valid UUID'),
});

const logActivitySchema = z.object({
  type: z.nativeEnum(ActivityType),
  subject: z.string().max(255, 'Subject must be 255 characters or less').optional().nullable(),
  body: z.string().min(1, 'Activity details are required'),
  occurredAt: z.string().refine((date) => !isNaN(new Date(date).getTime()), { 
    message: 'Invalid date and time'
  }), // Stored as ISO string, validated as parseable date
  durationMinutes: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? null : parseInt(String(val), 10)),
    z.number().int().positive('Duration must be a positive integer').nullable().optional()
  ),
  outcome: z.string().max(255, 'Outcome must be 255 characters or less').optional().nullable(),
  assignedToId: z.string().optional().nullable(), // Assuming assignedToId is a string (e.g., UUID or number as string)
  relatedTo: relatedEntitySchema, // This will be passed as a prop, not part of user form input directly
});

export type LogActivityFormData = z.infer<typeof logActivitySchema>;

interface LogActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<LogActivityFormData, 'relatedTo'>) => void; // relatedTo is handled by parent
  isLoading?: boolean;
  users?: User[]; // For assignedTo dropdown
  relatedTo: { entityType: RelatedEntityType; entityId: string };
  defaultActivityType?: ActivityType;
}

export const LogActivityModal: React.FC<LogActivityModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  users = [],
  relatedTo,
  defaultActivityType = ActivityType.NOTE,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<LogActivityFormData>({
    resolver: zodResolver(logActivitySchema),
    defaultValues: {
      type: defaultActivityType,
      subject: '',
      body: '',
      occurredAt: new Date().toISOString().substring(0, 16), // Defaults to current date and time
      durationMinutes: null,
      outcome: '',
      assignedToId: undefined,
      relatedTo: relatedTo, // Set from prop
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        type: defaultActivityType,
        subject: '',
        body: '',
        occurredAt: new Date().toISOString().substring(0, 16),
        durationMinutes: null,
        outcome: '',
        assignedToId: undefined,
        relatedTo: relatedTo,
      });
    } else {
        // Clear fields on close to avoid stale data if modal reopens for different entity
        reset();
    }
  }, [isOpen, reset, defaultActivityType, relatedTo]);

  // Update relatedTo in form if prop changes while modal is open
  useEffect(() => {
    setValue('relatedTo', relatedTo);
  }, [relatedTo, setValue]);

  const handleFormSubmit = (data: LogActivityFormData) => {
    const { relatedTo: _relatedTo, ...activityData } = data; // Exclude relatedTo from submitted data
    onSubmit(activityData as Omit<LogActivityFormData, 'relatedTo'>);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Activity" size="2xl">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 mt-4">
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Activity Type
              </label>
              <select
                {...field}
                id="type"
                className="mt-1 block w-full py-2 px-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:opacity-50 dark:text-neutral-100"
                disabled={isLoading}
              >
                {Object.values(ActivityType).map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase().replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
              {errors.type && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.type.message}</p>}
            </div>
          )}
        />

        <Controller
          name="subject"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value || ''}
              label="Subject (Optional)"
              placeholder="E.g., Follow-up call, Project kickoff meeting"
              error={errors.subject?.message}
              disabled={isLoading}
            />
          )}
        />

        <Controller
          name="body"
          control={control}
          render={({ field }) => (
            <div>
              <label htmlFor="body" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Details / Notes
              </label>
              <textarea
                {...field}
                id="body"
                rows={4}
                placeholder="Enter details about the activity..."
                className="mt-1 block w-full py-2 px-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:opacity-50 dark:text-neutral-100"
                disabled={isLoading}
              />
              {errors.body && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.body.message}</p>}
            </div>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="occurredAt"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Date & Time"
                type="datetime-local"
                error={errors.occurredAt?.message}
                disabled={isLoading}
              />
            )}
          />
          <Controller
            name="durationMinutes"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value === null || field.value === undefined ? '' : String(field.value)}
                onChange={(e) => field.onChange(e.target.value === '' ? null : parseInt(e.target.value, 10))}
                label="Duration (Minutes, Optional)"
                type="number"
                placeholder="E.g., 30"
                error={errors.durationMinutes?.message}
                disabled={isLoading}
                min="0"
              />
            )}
          />
        </div>

        <Controller
          name="outcome"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value || ''}
              label="Outcome (Optional)"
              placeholder="E.g., Sent proposal, Scheduled follow-up"
              error={errors.outcome?.message}
              disabled={isLoading}
            />
          )}
        />

        <Controller
          name="assignedToId"
          control={control}
          render={({ field }) => (
            <div>
              <label htmlFor="assignedToId" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Assign Task To (Optional)
              </label>
              <select
                {...field}
                value={field.value || ''}
                id="assignedToId"
                className="mt-1 block w-full py-2 px-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:opacity-50 dark:text-neutral-100"
                disabled={isLoading || users.length === 0}
              >
                <option value="">{users.length === 0 ? 'No users available' : 'Select user'}</option>
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

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
            Log Activity
          </Button>
        </div>
      </form>
    </Modal>
  );
};
