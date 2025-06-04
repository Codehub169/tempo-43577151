import React, { useEffect, useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SalesPipelineChart, PipelineStageData } from '../components/dashboard/SalesPipelineChart';
import { OpenTicketsWidget, OpenTicketsData } from '../components/dashboard/OpenTicketsWidget';
import { Card } from '../components/ui/Card';
import { ChartBarIcon, TicketIcon, UsersIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

// Mock data - replace with API calls
const mockPipelineData: PipelineStageData[] = [
  { name: 'Prospecting', value: 120000, count: 15, color: 'bg-sky-500' },
  { name: 'Qualification', value: 85000, count: 10, color: 'bg-blue-500' },
  { name: 'Proposal', value: 60000, count: 7, color: 'bg-indigo-500' },
  { name: 'Negotiation', value: 40000, count: 4, color: 'bg-purple-500' },
  { name: 'Closed Won (MTD)', value: 75000, count: 5, color: 'bg-green-500' },
];

const mockOpenTicketsData: OpenTicketsData = {
  totalOpen: 23,
  byPriority: {
    low: 10,
    medium: 8,
    high: 3,
    urgent: 2,
  },
};

const mockStatsData = [
  { title: 'New Leads (MTD)', value: '42', icon: UsersIcon, color: 'text-green-500', bgColor: 'bg-green-100' },
  { title: 'Opportunities Won (MTD)', value: '12', icon: BriefcaseIcon, color: 'text-blue-500', bgColor: 'bg-blue-100' },
  { title: 'Avg. Ticket Resolution (Hours)', value: '8.5', icon: TicketIcon, color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
  { title: 'Active Projects', value: '28', icon: ChartBarIcon, color: 'text-indigo-500', bgColor: 'bg-indigo-100' },
];

export const DashboardPage: React.FC = () => {
  const [pipelineData, setPipelineData] = useState<PipelineStageData[]>([]);
  const [openTicketsData, setOpenTicketsData] = useState<OpenTicketsData | null>(null);
  const [stats, setStats] = useState<typeof mockStatsData>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setPipelineData(mockPipelineData);
      setOpenTicketsData(mockOpenTicketsData);
      setStats(mockStatsData);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <PageWrapper title="Dashboard Overview">
      {/* Stats Cards Section */} 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-2"></div>
              <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
            </Card>
          ))
        ) : (
          stats.map((stat, index) => (
            <Card key={index} variant="default" className="hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{stat.title}</p>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-3xl font-semibold text-neutral-700 dark:text-neutral-200 mt-1">{stat.value}</p>
            </Card>
          ))
        )}
      </div>

      {/* Main Dashboard Grid */} 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Pipeline Chart - Spanning 2 columns on larger screens */} 
        <div className="lg:col-span-2">
          <SalesPipelineChart 
            title="Sales Pipeline Health"
            data={pipelineData} 
            currencySymbol="₹"
            isLoading={isLoading}
          />
        </div>

        {/* Open Tickets Widget */} 
        <div>
          <OpenTicketsWidget 
            title="Open Support Tickets"
            data={openTicketsData} 
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Placeholder for more dashboard items, e.g., Recent Activities, Upcoming Tasks */}
      <div className="mt-8">
        <Card title="Recent Activities (Placeholder)" variant="glass">
          {isLoading ? (
            <div className="h-40 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
          ) : (
            <p className="text-neutral-600 dark:text-neutral-300">
              Activity feed will be displayed here. This could include recently logged calls, emails, or created tasks.
            </p>
          )}
        </Card>
      </div>
    </PageWrapper>
  );
};
