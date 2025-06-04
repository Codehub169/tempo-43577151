import React from 'react';
import { Activity, ActivityType, User } from '../../types'; // Assuming these types are defined
import { 
  ChatBubbleLeftEllipsisIcon, 
  PhoneIcon, 
  VideoCameraIcon, 
  ClipboardDocumentCheckIcon, 
  PencilSquareIcon,
  UserCircleIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface EnrichedActivity extends Activity {
  createdByUser?: Pick<User, 'name' | 'id'>; // Assuming activity objects might be enriched with user details
}

interface ActivityFeedProps {
  activities: EnrichedActivity[];
  isLoading?: boolean;
}

const activityIcons: Record<ActivityType, React.ElementType> = {
  [ActivityType.CALL]: PhoneIcon,
  [ActivityType.EMAIL]: ChatBubbleLeftEllipsisIcon, // Using ChatBubble for email as EnvelopeIcon might be too similar to others
  [ActivityType.MEETING]: VideoCameraIcon,
  [ActivityType.TASK]: ClipboardDocumentCheckIcon,
  [ActivityType.NOTE]: PencilSquareIcon,
};

const activityColors: Record<ActivityType, string> = {
  [ActivityType.CALL]: 'bg-blue-500 dark:bg-blue-600',
  [ActivityType.EMAIL]: 'bg-green-500 dark:bg-green-600',
  [ActivityType.MEETING]: 'bg-purple-500 dark:bg-purple-600',
  [ActivityType.TASK]: 'bg-yellow-500 dark:bg-yellow-600',
  [ActivityType.NOTE]: 'bg-indigo-500 dark:bg-indigo-600',
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse flex space-x-4 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow">
            <div className="rounded-full bg-neutral-300 dark:bg-neutral-700 h-10 w-10"></div>
            <div className="flex-1 space-y-3 py-1">
              <div className="h-3 bg-neutral-300 dark:bg-neutral-700 rounded w-3/4"></div>
              <div className="h-2 bg-neutral-300 dark:bg-neutral-700 rounded w-1/2"></div>
              <div className="h-2 bg-neutral-300 dark:bg-neutral-700 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg shadow">
        <PencilSquareIcon className="mx-auto h-12 w-12 text-neutral-400 dark:text-neutral-500" />
        <h3 className="mt-2 text-lg font-medium text-neutral-900 dark:text-neutral-100">No Activities Yet</h3>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Log calls, emails, or notes to see them here.</p>
      </div>
    );
  }

  // Sort activities by occurredAt date, newest first
  const sortedActivities = [...activities].sort((a, b) => 
    new Date(b.occurredAt || b.createdAt).getTime() - new Date(a.occurredAt || a.createdAt).getTime()
  );

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {sortedActivities.map((activity, activityIdx) => {
          const IconComponent = activityIcons[activity.type] || PencilSquareIcon;
          const iconColor = activityColors[activity.type] || 'bg-gray-500';

          return (
            <li key={activity.id}>
              <div className="relative pb-8">
                {activityIdx !== sortedActivities.length - 1 ? (
                  <span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-neutral-200 dark:bg-neutral-700" aria-hidden="true" />
                ) : null}
                <div className="relative flex items-start space-x-3">
                  <div>
                    <span
                      className={`${iconColor} h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-neutral-900`}
                    >
                      <IconComponent className="h-5 w-5 text-white" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                    <div>
                      <div className="text-sm">
                        <span className="font-medium text-neutral-900 dark:text-neutral-100">
                          {activity.createdByUser?.name || 'System'}
                        </span>
                        <span className="text-neutral-500 dark:text-neutral-400"> logged a {activity.type.toLowerCase().replace(/_/g, ' ')}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400 flex items-center">
                        <CalendarDaysIcon className="h-3 w-3 mr-1" />
                        {format(new Date(activity.occurredAt || activity.createdAt), 'MMM d, yyyy, h:mm a')}
                      </p>
                    </div>
                    <div className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
                      {activity.subject && <p className="font-semibold">{activity.subject}</p>}
                      <p className="whitespace-pre-wrap">{activity.body}</p>
                    </div>
                    {activity.outcome && (
                       <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Outcome: {activity.outcome}</p>
                    )}
                    {activity.durationMinutes && (
                       <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Duration: {activity.durationMinutes} min</p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
