import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card'; // Assuming Card component is in ../ui/Card
import { TicketIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export interface OpenTicketsData {
  totalOpen: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
}

interface OpenTicketsWidgetProps {
  data: OpenTicketsData | null;
  title?: string;
}

const priorityColors: { [key: string]: string } = {
  low: 'bg-sky-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-600',
};

const priorityLabels: { [key: string]: string } = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

const OpenTicketsWidget: React.FC<OpenTicketsWidgetProps> = ({
  data,
  title = 'Open Support Tickets',
}) => {
  if (!data || data.totalOpen === 0) {
    return (
      <Card title={title} variant="glass-darker">
        <div className="p-6 text-center text-neutral-500 dark:text-neutral-400">
          <TicketIcon className="h-12 w-12 mx-auto mb-4 text-neutral-400 dark:text-neutral-500" />
          <p>No open support tickets at the moment.</p>
          <p className="text-sm">Great job, or time to create some!</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title={title} variant="glass-darker" footerContent={
      <Link to="/tickets?status=open" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center">
        View All Open Tickets <ArrowRightIcon className="ml-1 h-4 w-4" />
      </Link>
    }>
      <div className="p-4 md:p-6">
        <div className="flex items-baseline justify-center mb-6">
          <span className="text-5xl font-bold text-neutral-800 dark:text-neutral-100">{data.totalOpen}</span>
          <span className="ml-2 text-lg text-neutral-600 dark:text-neutral-300">Total Open</span>
        </div>
        <div className="space-y-3">
          {Object.entries(data.byPriority).map(([priority, count]) => (
            count > 0 && (
            <div key={priority} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className={`h-3 w-3 rounded-full ${priorityColors[priority]} mr-2`}></span>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                  {priorityLabels[priority]} Priority
                </span>
              </div>
              <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{count}</span>
            </div>
            )
          ))}
        </div>
      </div>
    </Card>
  );
};

export default OpenTicketsWidget;
