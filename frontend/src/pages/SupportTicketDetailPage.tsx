import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { ActivityFeed } from '../components/activities/ActivityFeed';
import { LogActivityModal } from '../components/activities/LogActivityModal';
import { Ticket, Account, Project, User, Activity, EnrichedActivity, RelatedEntityType, ActivityType, TicketStatus, TicketPriority } from '../types';
import { formatDate, formatDateTime } from '../utils/formatters';
import { ticketStatusColors, ticketPriorityColors } from './SupportTicketsListPage'; // Import color maps
import {
  ArrowLeftIcon, PencilSquareIcon, ChatBubbleLeftEllipsisIcon, UserCircleIcon, BuildingOffice2Icon,
  BriefcaseIcon, TagIcon, CalendarDaysIcon, InformationCircleIcon, ShieldExclamationIcon,
  TicketIcon as PageIcon, ClipboardDocumentIcon
} from '@heroicons/react/24/outline';

// Mock data - replace with API calls
const mockTicketDetail: Ticket = {
  id: 'tkt_1',
  title: 'Login issue on staging environment',
  description: 'Users are unable to login to the staging server after the last deployment. This seems to have started after the recent v2.3.1 patch. Please investigate urgently as it blocks all QA activities. Error message observed: \'Invalid credentials\'. Tested on Chrome, Firefox, and Edge browsers.',
  status: TicketStatus.OPEN,
  priority: TicketPriority.HIGH,
  accountId: 'acc_1',
  projectId: 'proj_1',
  createdById: 1,
  assignedToId: 2,
  createdAt: new Date('2023-10-01T10:00:00Z'),
  updatedAt: new Date('2023-10-01T11:00:00Z'),
};

const mockAccountDetail: Account = { id: 'acc_1', name: 'Stark Industries', industry: 'Technology', createdAt: new Date(), updatedAt: new Date() };
const mockProjectDetail: Project = { id: 'proj_1', name: 'Iron Man Suit Mark V', accountId: 'acc_1', status: 'IN_PROGRESS', createdAt: new Date(), updatedAt: new Date() };
const mockUsers: User[] = [
  { id: 1, name: 'Alice Wonderland', email: 'alice@example.com', roles: ['admin'] },
  { id: 2, name: 'Bob The Builder', email: 'bob@example.com', roles: ['user'] },
];
const mockActivities: Activity[] = [
  { id: 'act_1', type: ActivityType.NOTE, body: 'Ticket created by system based on email.', occurredAt: new Date('2023-10-01T10:00:00Z'), createdById: 1, relatedTicketId: 'tkt_1', createdAt: new Date(), updatedAt: new Date() },
  { id: 'act_2', type: ActivityType.TASK, subject: 'Investigate login issue', body: 'Assigned to Bob for initial investigation.', occurredAt: new Date('2023-10-01T10:05:00Z'), createdById: 1, assignedToId: 2, relatedTicketId: 'tkt_1', createdAt: new Date(), updatedAt: new Date() },
];

interface DetailItemProps {
  icon: React.ElementType;
  label: string;
  value?: React.ReactNode;
  className?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon: Icon, label, value, className }) => (
  <div className={`flex items-start space-x-3 py-2 ${className}`}>
    <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
    <div>
      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 break-words">
        {value || <span className="italic text-gray-400 dark:text-gray-500">Not set</span>}
      </dd>
    </div>
  </div>
);

export function SupportTicketDetailPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [activities, setActivities] = useState<EnrichedActivity[]>([]);
  const [users, setUsers] = useState<User[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [isLogActivityModalOpen, setIsLogActivityModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!ticketId) return;
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const fetchedTicket = mockTickets.find(t => t.id === ticketId) || mockTicketDetail; // Fallback for direct access
    if (fetchedTicket) {
      setTicket(fetchedTicket);
      setAccount(mockAccountDetail); // Assuming it's fetched based on ticket.accountId
      setProject(mockProjectDetail); // Assuming it's fetched based on ticket.projectId
      setUsers(mockUsers);
      const enrichedActivities = mockActivities
        .filter(act => act.relatedTicketId === ticketId)
        .map(act => ({
            ...act,
            createdByUser: mockUsers.find(u => u.id === act.createdById),
            assignedToUser: act.assignedToId ? mockUsers.find(u => u.id === act.assignedToId) : undefined,
        }));
      setActivities(enrichedActivities);
    } else {
      // Handle ticket not found, maybe navigate to a 404 page or list page
      navigate('/tickets');
    }
    setIsLoading(false);
  }, [ticketId, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createdByUser = useMemo(() => users.find(u => u.id === ticket?.createdById), [users, ticket]);
  const assignedToUser = useMemo(() => users.find(u => u.id === ticket?.assignedToId), [users, ticket]);

  const handleLogActivitySubmit = async (activityData: any) => {
    console.log('Logging activity:', activityData);
    // Simulate API call
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newActivity: EnrichedActivity = {
        id: `act_${Date.now()}`,
        ...activityData,
        relatedTicketId: ticketId,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdByUser: users.find(u => u.id === activityData.createdById), // Assuming createdById is part of activityData
        assignedToUser: activityData.assignedToId ? users.find(u => u.id === activityData.assignedToId) : undefined,
    };
    setActivities(prev => [newActivity, ...prev]);
    setIsLogActivityModalOpen(false);
    setIsLoading(false);
  };

  const handleEditTicketSubmit = async (formData: any) => {
    console.log('Updating ticket:', formData);
    // Simulate API call
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    if (ticket) {
      setTicket(prev => prev ? { ...prev, ...formData, updatedAt: new Date() } : null);
    }
    setIsEditModalOpen(false);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <PageWrapper title="Loading Ticket Details...">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 animate-pulse" variant="glass">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="animate-pulse" variant="glass-darker">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-3 py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </PageWrapper>
    );
  }

  if (!ticket) {
    return (
      <PageWrapper title="Ticket Not Found">
        <div className="text-center py-12">
          <ShieldExclamationIcon className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Ticket Not Found</h2>
          <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
            The ticket you are looking for does not exist or may have been deleted.
          </p>
          <Button onClick={() => navigate('/tickets')} className="mt-6" iconLeft={<ArrowLeftIcon className="h-5 w-5" />}>
            Back to Tickets List
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={`Ticket: ${ticket.title}`}
      headerContent={
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setIsEditModalOpen(true)} iconLeft={<PencilSquareIcon className="h-5 w-5" />}>
            Edit Ticket
          </Button>
          <Button onClick={() => setIsLogActivityModalOpen(true)} iconLeft={<ChatBubbleLeftEllipsisIcon className="h-5 w-5" />}>
            Log Activity
          </Button>
        </div>
      }
    >
      <div className="mb-6">
        <Link to="/tickets" className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200 transition-colors">
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to Tickets List
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" variant="glass">
          <Card.Header>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate" title={ticket.title}>{ticket.title}</h2>
              <div className="mt-2 sm:mt-0 flex space-x-2 flex-shrink-0">
                <Badge className={ticketStatusColors[ticket.status]}>{ticket.status}</Badge>
                <Badge className={ticketPriorityColors[ticket.priority]}>{ticket.priority}</Badge>
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <dl className="divide-y divide-gray-200 dark:divide-gray-700">
              {account && (
                <DetailItem icon={BuildingOffice2Icon} label="Account" value={<Link to={`/accounts/${account.id}`} className="text-primary-600 hover:underline dark:text-primary-400">{account.name}</Link>} />
              )}
              {project && (
                <DetailItem icon={BriefcaseIcon} label="Project" value={<Link to={`/projects/${project.id}`} className="text-primary-600 hover:underline dark:text-primary-400">{project.name}</Link>} />
              )}
              <DetailItem icon={UserCircleIcon} label="Assigned To" value={assignedToUser?.name} />
              <DetailItem icon={InformationCircleIcon} label="Description" value={<div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">{ticket.description}</div>} />
            </dl>
          </Card.Body>
          <Card.Footer className="text-xs text-gray-500 dark:text-gray-400">
            <div className="flex flex-col sm:flex-row justify-between">
              <span>Created by: {createdByUser?.name || 'System'} on {formatDateTime(ticket.createdAt)}</span>
              <span>Last updated: {formatDateTime(ticket.updatedAt)}</span>
            </div>
          </Card.Footer>
        </Card>

        <Card variant="glass-darker">
          <Card.Header>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Activity Feed</h3>
          </Card.Header>
          <Card.Body className="p-0">
            <ActivityFeed activities={activities} isLoading={isLoading} />
          </Card.Body>
        </Card>
      </div>

      {isLogActivityModalOpen && (
        <LogActivityModal
          isOpen={isLogActivityModalOpen}
          onClose={() => setIsLogActivityModalOpen(false)}
          onSubmit={handleLogActivitySubmit}
          isLoading={isLoading} // You might want a specific loading state for this modal
          users={users}
          relatedTo={{ entityType: RelatedEntityType.TICKET, entityId: ticket.id }}
          defaultActivityType={ActivityType.NOTE}
        />
      )}

      {isEditModalOpen && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Ticket">
          {/* Placeholder for TicketForm, similar to SupportTicketsListPage */}
          <form onSubmit={(e) => { e.preventDefault(); handleEditTicketSubmit({ title: ticket.title + ' (edited)' }); }} className="space-y-6">
            <div>
              <label htmlFor="ticketTitleEdit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ticket Title</label>
              <input id="ticketTitleEdit" name="title" type="text" defaultValue={ticket.title} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-neutral-700 dark:text-gray-200" />
            </div>
            {/* Add other fields from TicketForm here */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button type="submit" isLoading={isLoading}>Save Changes</Button>
            </div>
          </form>
        </Modal>
      )}
    </PageWrapper>
  );
}
