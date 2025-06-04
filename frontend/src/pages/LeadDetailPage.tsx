import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ActivityFeed } from '../components/activities/ActivityFeed';
import { LogActivityModal } from '../components/activities/LogActivityModal';
import { LeadForm } from '../components/leads/LeadForm'; // For editing
import { Modal } from '../components/ui/Modal';
import { ArrowLeftIcon, PencilIcon, PlusIcon, BuildingOffice2Icon, EnvelopeIcon, PhoneIcon, UserCircleIcon, TagIcon, CurrencyDollarIcon, CalendarDaysIcon, SparklesIcon } from '@heroicons/react/24/outline';
// import { leadService } from '../services/leadService'; // Uncomment when service is ready
// import { activityService } from '../services/activityService'; // Uncomment when service is ready
// import { userService } from '../services/userService'; // Uncomment when service is ready
import { Lead, Activity, User, LeadStatus, LeadSource, ActivityType, RelatedEntityType } from '../types'; // Assuming types are defined
import { formatCurrency, formatDate } from '../utils/formatters'; // Assuming a formatters util

// Mock Data - Replace with API calls
const mockLeadDetail: Lead = {
  id: '1', firstName: 'Aarav', lastName: 'Sharma', company: 'Innovate Solutions Ltd.', email: 'aarav.sharma@innovate.com',
  phone: '9876543210', status: LeadStatus.NEW, source: LeadSource.WEBSITE, estimatedValue: 50000,
  notes: 'A keen interest in developing a custom inventory management system. They are currently using an outdated Excel-based process and are looking for a scalable cloud solution. Budget is flexible but prefers a phased approach. Key contact for technical discussions is Mr. Ramesh Kumar (CTO). Follow up call scheduled for next week to discuss initial requirements.', 
  createdById: 1, assignedToId: 1, 
  createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
};

const mockActivities: Activity[] = [
  { id: 'act1', type: ActivityType.NOTE, subject: 'Initial contact', body: 'Reached out via website contact form.', occurredAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), createdById: 1, relatedLeadId: '1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'act2', type: ActivityType.CALL, subject: 'Discovery Call', body: 'Discussed pain points and potential solutions. Client receptive.', occurredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 30, outcome: 'Scheduled follow-up', createdById: 1, relatedLeadId: '1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'act3', type: ActivityType.EMAIL, subject: 'Follow-up Email', body: 'Sent summary of discussion and brochure.', occurredAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), createdById: 1, relatedLeadId: '1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockUsers: User[] = [
  { id: 1, name: 'Sales Admin', email: 'admin@procrm.com', roles: ['admin'] },
  { id: 2, name: 'John Doe', email: 'john.doe@procrm.com', roles: ['sales'] },
];

const statusColors: Record<LeadStatus, string> = {
  [LeadStatus.NEW]: 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100',
  [LeadStatus.CONTACTED]: 'bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-sky-100',
  [LeadStatus.QUALIFIED]: 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100',
  [LeadStatus.PROPOSAL_SENT]: 'bg-purple-100 text-purple-700 dark:bg-purple-700 dark:text-purple-100',
  [LeadStatus.NEGOTIATION]: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100',
  [LeadStatus.CONVERTED]: 'bg-teal-100 text-teal-700 dark:bg-teal-700 dark:text-teal-100',
  [LeadStatus.LOST]: 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100',
  [LeadStatus.NOT_QUALIFIED]: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-100',
};

export const LeadDetailPage: React.FC = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();

  const [lead, setLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogActivityModalOpen, setIsLogActivityModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!leadId) return;
    setIsLoading(true);
    try {
      // const fetchedLead = await leadService.getLeadById(leadId);
      // const fetchedActivities = await activityService.getActivitiesByRelatedEntity('lead', leadId);
      // const fetchedUsers = await userService.getAllUsers(); // For assignees, creators
      setLead(mockLeadDetail); // Replace with fetchedLead
      setActivities(mockActivities); // Replace with fetchedActivities
      setUsers(mockUsers); // Replace with fetchedUsers
    } catch (error) {
      console.error('Failed to fetch lead details:', error);
      // Handle error, e.g., navigate to not found or show error message
    } finally {
      setIsLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogActivitySubmit = async (data: Omit<Activity, 'id' | 'createdAt' | 'updatedAt' | 'createdById' | 'relatedLeadId'>) => {
    if (!leadId) return;
    console.log('Logging activity:', data);
    // await activityService.createActivity({ ...data, relatedTo: { entityType: 'lead', entityId: leadId } });
    setIsLogActivityModalOpen(false);
    fetchData(); // Refresh data
  };

  const handleEditLeadSubmit = async (data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'createdById'>) => {
    if (!leadId) return;
    console.log('Updating lead:', data);
    // await leadService.updateLead(leadId, data);
    setIsEditModalOpen(false);
    fetchData(); // Refresh data
  };

  const assignedUser = users.find(u => u.id === lead?.assignedToId);
  const createdUser = users.find(u => u.id === lead?.createdById);

  if (isLoading) {
    return (
      <PageWrapper title="Loading Lead...">
        <div className="space-y-6">
          <Card className="animate-pulse"><div className="h-48 bg-neutral-200 dark:bg-neutral-700 rounded"></div></Card>
          <Card className="animate-pulse"><div className="h-64 bg-neutral-200 dark:bg-neutral-700 rounded"></div></Card>
        </div>
      </PageWrapper>
    );
  }

  if (!lead) {
    return (
      <PageWrapper title="Lead Not Found">
        <Card>
          <p className="text-center text-neutral-600 dark:text-neutral-300 py-10">
            The lead you are looking for could not be found.
          </p>
          <div className="text-center">
            <Button variant="outline" onClick={() => navigate('/leads')} iconLeft={<ArrowLeftIcon className="h-5 w-5"/>}>
              Back to Leads List
            </Button>
          </div>
        </Card>
      </PageWrapper>
    );
  }

  const detailItems = [
    { icon: BuildingOffice2Icon, label: 'Company', value: lead.company },
    { icon: EnvelopeIcon, label: 'Email', value: lead.email, href: `mailto:${lead.email}` },
    { icon: PhoneIcon, label: 'Phone', value: lead.phone, href: `tel:${lead.phone}` },
    { icon: TagIcon, label: 'Source', value: lead.source },
    { icon: CurrencyDollarIcon, label: 'Estimated Value', value: formatCurrency(lead.estimatedValue || 0, 'INR') },
    { icon: UserCircleIcon, label: 'Assigned To', value: assignedUser?.name || 'Unassigned' },
    { icon: CalendarDaysIcon, label: 'Created On', value: formatDate(lead.createdAt) },
    { icon: SparklesIcon, label: 'Created By', value: createdUser?.name || 'Unknown' },
  ];

  return (
    <PageWrapper 
      title={`${lead.firstName} ${lead.lastName}`}
      headerContent={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditModalOpen(true)} iconLeft={<PencilIcon className="h-5 w-5" />}>
            Edit Lead
          </Button>
          <Button variant="primary" onClick={() => setIsLogActivityModalOpen(true)} iconLeft={<PlusIcon className="h-5 w-5" />}>
            Log Activity
          </Button>
        </div>
      }
    >
      <Link to="/leads" className="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:underline mb-4">
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Leads List
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Details Card (Left/Top) */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Lead Information" variant="glass">
            <div className="p-1">
              <div className="mb-4">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[lead.status] || statusColors[LeadStatus.NEW]}`}>
                  Status: {lead.status}
                </span>
              </div>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                {detailItems.filter(item => item.value).map(item => (
                  <div key={item.label} className="flex items-start">
                    <item.icon className="h-5 w-5 text-primary-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{item.label}</dt>
                      <dd className="mt-1 text-sm text-neutral-800 dark:text-neutral-100">
                        {item.href ? <a href={item.href} className="hover:underline text-primary-600 dark:text-primary-400">{item.value}</a> : item.value}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
              {lead.notes && (
                <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <h3 className="text-md font-semibold text-neutral-700 dark:text-neutral-200 mb-2">Notes:</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed">
                    {lead.notes}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Activity Feed (Right/Bottom) */}
        <div className="lg:col-span-1">
          <Card title="Activity Feed" className="h-full" variant="glass-darker">
            <ActivityFeed activities={activities} isLoading={isLoading} />
          </Card>
        </div>
      </div>

      <LogActivityModal
        isOpen={isLogActivityModalOpen}
        onClose={() => setIsLogActivityModalOpen(false)}
        onSubmit={handleLogActivitySubmit}
        users={users}
        relatedTo={{ entityType: RelatedEntityType.LEAD, entityId: leadId! }}
        isLoading={isLoading} // Consider a separate loading state for activity logging
      />

      {lead && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit ${lead.firstName} ${lead.lastName}`}
          size="2xl"
        >
          <LeadForm 
            initialData={lead} 
            onSubmit={handleEditLeadSubmit} 
            users={users}
            onCancel={() => setIsEditModalOpen(false)}
            isLoading={isLoading} // Consider separate loading state
          />
        </Modal>
      )}
    </PageWrapper>
  );
};
