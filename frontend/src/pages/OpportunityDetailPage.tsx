import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ActivityFeed } from '../components/activities/ActivityFeed';
import { LogActivityModal } from '../components/activities/LogActivityModal';
// import { OpportunityForm } from '../components/opportunities/OpportunityForm'; // Assuming this component will be created
import { Opportunity, Activity, User, OpportunityStage, ActivityType, RelatedEntityType, Account } from '../types';
import { ArrowLeftIcon, PencilIcon, PlusIcon, CalendarDaysIcon, CurrencyDollarIcon, TagIcon, UserCircleIcon, InformationCircleIcon, UsersIcon, BuildingOfficeIcon, LinkIcon } from '@heroicons/react/24/outline';
// Mock services - replace with actual API calls
// import * as opportunityService from '../services/opportunityService';
// import * as activityService from '../services/activityService';
// import * as userService from '../services/userService';
// import * as accountService from '../services/accountService';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input'; // For placeholder form

// Mock Data (Remove when API is integrated)
const mockUsers: User[] = [
  { id: 1, name: 'Sales User 1', email: 'sales1@example.com', roles: ['user'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 2, name: 'Sales User 2', email: 'sales2@example.com', roles: ['user'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockAccounts: Account[] = [
    { id: 'acc1', name: 'Tech Solutions Inc.', industry: 'Technology', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'acc2', name: 'Global Corp Ltd.', industry: 'Manufacturing', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockOpportunityDetail: Opportunity = {
  id: 'op1',
  name: 'Major Software Deal',
  accountId: 'acc1',
  contactId: 'contact1',
  stage: OpportunityStage.PROPOSAL,
  value: 50000,
  expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  description: 'This is a detailed description of the major software deal. It involves a multi-year contract and integration with existing client systems. Key stakeholders have shown positive interest.',
  lostReason: null,
  createdById: 1,
  assignedToId: 1,
  createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockActivities: Activity[] = [
  { id: 'act1', type: ActivityType.MEETING, subject: 'Initial Pitch Meeting', body: 'Discussed project scope and requirements.', occurredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), createdById: 1, relatedOpportunityId: 'op1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'act2', type: ActivityType.EMAIL, subject: 'Follow-up Email', body: 'Sent proposal document and pricing details.', occurredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), createdById: 1, relatedOpportunityId: 'op1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'act3', type: ActivityType.CALL, subject: 'Client Call', body: 'Addressed client queries regarding the proposal.', occurredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 30, createdById: 2, relatedOpportunityId: 'op1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const opportunityStageColors: Record<OpportunityStage, string> = {
  [OpportunityStage.PROSPECTING]: 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100',
  [OpportunityStage.QUALIFICATION]: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100',
  [OpportunityStage.PROPOSAL]: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-indigo-100',
  [OpportunityStage.NEGOTIATION]: 'bg-purple-100 text-purple-700 dark:bg-purple-700 dark:text-purple-100',
  [OpportunityStage.CLOSED_WON]: 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100',
  [OpportunityStage.CLOSED_LOST]: 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100',
};

const formatCurrency = (value?: number) => {
  if (value === undefined || value === null) return 'N/A';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const OpportunityDetailPage: React.FC = () => {
  const { opportunityId } = useParams<{ opportunityId: string }>();
  const navigate = useNavigate();

  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogActivityModalOpen, setIsLogActivityModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!opportunityId) {
      navigate('/opportunities');
      return;
    }
    setIsLoading(true);
    // Simulate API call
    // const oppData = await opportunityService.getOpportunityById(opportunityId);
    // const activityData = await activityService.getActivities({ relatedEntityType: RelatedEntityType.OPPORTUNITY, relatedEntityId: opportunityId });
    // const userData = await userService.getUsers(); // Or fetch specific users
    // setOpportunity(oppData);
    // setActivities(activityData.data);
    // setUsers(userData.data);
    // if (oppData && oppData.accountId) {
    //   const accData = await accountService.getAccountById(oppData.accountId);
    //   setAccount(accData);
    // }

    const foundOpportunity = mockOpportunities.find(op => op.id === opportunityId) || mockOpportunityDetail; // Fallback for demo
    setOpportunity(foundOpportunity);
    if (foundOpportunity && foundOpportunity.accountId) {
        setAccount(mockAccounts.find(acc => acc.id === foundOpportunity.accountId) || null);
    }
    setActivities(mockActivities.filter(act => act.relatedOpportunityId === opportunityId));
    setUsers(mockUsers);
    setTimeout(() => setIsLoading(false), 1000);
  }, [opportunityId, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogActivitySubmit = async (data: Omit<Activity, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    console.log('Logging activity:', data);
    // await activityService.createActivity({ ...data, relatedTo: { entityType: RelatedEntityType.OPPORTUNITY, entityId: opportunityId! } });
    setIsLogActivityModalOpen(false);
    fetchData(); // Refresh activities
  };

  const handleEditOpportunitySubmit = async (data: Partial<Opportunity>) => {
    console.log('Updating opportunity:', data);
    // await opportunityService.updateOpportunity(opportunityId!, data);
    setIsEditModalOpen(false);
    fetchData(); // Refresh opportunity details
  };

  const assignedUser = useMemo(() => users.find(u => u.id === opportunity?.assignedToId), [users, opportunity]);
  const createdUser = useMemo(() => users.find(u => u.id === opportunity?.createdById), [users, opportunity]);

  if (isLoading && !opportunity) {
    return (
      <PageWrapper title="Loading Opportunity...">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 animate-pulse"><div className="h-96 bg-neutral-200 dark:bg-neutral-700 rounded"></div></Card>
          <Card className="animate-pulse"><div className="h-96 bg-neutral-200 dark:bg-neutral-700 rounded"></div></Card>
        </div>
      </PageWrapper>
    );
  }

  if (!opportunity) {
    return (
      <PageWrapper title="Opportunity Not Found">
        <div className="text-center py-10">
          <InformationCircleIcon className="h-16 w-16 text-red-500 mx-auto" />
          <h3 className="mt-2 text-xl font-semibold text-neutral-700 dark:text-neutral-200">Opportunity Not Found</h3>
          <p className="mt-1 text-neutral-500 dark:text-neutral-400">The opportunity you are looking for does not exist or has been removed.</p>
          <Button onClick={() => navigate('/opportunities')} variant="primary" className="mt-6">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Opportunities List
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={opportunity.name}
      headerContent={
        <div className="flex space-x-3">
          <Button onClick={() => setIsEditModalOpen(true)} variant="outline" iconLeft={<PencilIcon className="h-5 w-5" />}>
            Edit Opportunity
          </Button>
          <Button onClick={() => setIsLogActivityModalOpen(true)} variant="accent" iconLeft={<PlusIcon className="h-5 w-5" />}>
            Log Activity
          </Button>
        </div>
      }
    >
      <div className="mb-6">
        <Link to="/opportunities" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Opportunities List
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8">
        {/* Main Opportunity Details Card */}
        <Card className="lg:col-span-2" variant="glass">
          <Card.Header>
            <div className="flex justify-between items-start">
                <Card.Title className="text-2xl">{opportunity.name}</Card.Title>
                <Badge colorScheme={opportunityStageColors[opportunity.stage] || 'bg-gray-100 text-gray-700'} className="text-sm px-3 py-1">
                    {opportunity.stage}
                </Badge>
            </div>
            {account && (
                <p className="text-neutral-600 dark:text-neutral-300 text-sm mt-1">
                    Part of Account: <Link to={`/accounts/${account.id}`} className="text-primary-600 dark:text-primary-400 hover:underline font-medium">{account.name}</Link>
                </p>
            )}
          </Card.Header>
          <Card.Body>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div className="flex items-start">
                <CurrencyDollarIcon className="h-5 w-5 mr-3 mt-0.5 text-primary-500 dark:text-primary-400 flex-shrink-0" />
                <div>
                  <dt className="font-medium text-neutral-600 dark:text-neutral-300">Value</dt>
                  <dd className="text-neutral-800 dark:text-neutral-100 text-lg font-semibold">{formatCurrency(opportunity.value)}</dd>
                </div>
              </div>
              <div className="flex items-start">
                <CalendarDaysIcon className="h-5 w-5 mr-3 mt-0.5 text-primary-500 dark:text-primary-400 flex-shrink-0" />
                <div>
                  <dt className="font-medium text-neutral-600 dark:text-neutral-300">Expected Close Date</dt>
                  <dd className="text-neutral-700 dark:text-neutral-200">{formatDate(opportunity.expectedCloseDate)}</dd>
                </div>
              </div>
              <div className="flex items-start">
                <UserCircleIcon className="h-5 w-5 mr-3 mt-0.5 text-primary-500 dark:text-primary-400 flex-shrink-0" />
                <div>
                  <dt className="font-medium text-neutral-600 dark:text-neutral-300">Assigned To</dt>
                  <dd className="text-neutral-700 dark:text-neutral-200">{assignedUser?.name || 'N/A'}</dd>
                </div>
              </div>
               <div className="flex items-start">
                <BuildingOfficeIcon className="h-5 w-5 mr-3 mt-0.5 text-primary-500 dark:text-primary-400 flex-shrink-0" />
                <div>
                  <dt className="font-medium text-neutral-600 dark:text-neutral-300">Account</dt>
                  <dd className="text-neutral-700 dark:text-neutral-200">
                    {account ? (
                        <Link to={`/accounts/${account.id}`} className="text-primary-600 dark:text-primary-400 hover:underline">{account.name}</Link>
                    ) : opportunity.accountId || 'N/A'}
                  </dd>
                </div>
              </div>
              <div className="flex items-start md:col-span-2">
                <InformationCircleIcon className="h-5 w-5 mr-3 mt-0.5 text-primary-500 dark:text-primary-400 flex-shrink-0" />
                <div>
                  <dt className="font-medium text-neutral-600 dark:text-neutral-300">Description</dt>
                  <dd className="text-neutral-700 dark:text-neutral-200 whitespace-pre-wrap mt-1">{opportunity.description || 'No description provided.'}</dd>
                </div>
              </div>
              {opportunity.stage === OpportunityStage.CLOSED_LOST && opportunity.lostReason && (
                <div className="flex items-start md:col-span-2">
                  <TagIcon className="h-5 w-5 mr-3 mt-0.5 text-red-500 dark:text-red-400 flex-shrink-0" />
                  <div>
                    <dt className="font-medium text-red-600 dark:text-red-300">Lost Reason</dt>
                    <dd className="text-neutral-700 dark:text-neutral-200 whitespace-pre-wrap mt-1">{opportunity.lostReason}</dd>
                  </div>
                </div>
              )}
            </dl>
          </Card.Body>
          <Card.Footer className="text-xs text-neutral-500 dark:text-neutral-400">
            Created by {createdUser?.name || 'N/A'} on {formatDate(opportunity.createdAt)}. Last updated on {formatDate(opportunity.updatedAt)}.
          </Card.Footer>
        </Card>

        {/* Activity Feed Card */}
        <Card variant="glass-darker">
          <Card.Header>
            <Card.Title>Activity Feed</Card.Title>
          </Card.Header>
          <Card.Body className="max-h-[600px] overflow-y-auto custom-scrollbar">
            <ActivityFeed activities={activities.map(a => ({...a, createdByUser: users.find(u => u.id === a.createdById)}))} isLoading={isLoading} />
          </Card.Body>
        </Card>
      </div>

      {isLogActivityModalOpen && (
        <LogActivityModal
          isOpen={isLogActivityModalOpen}
          onClose={() => setIsLogActivityModalOpen(false)}
          onSubmit={handleLogActivitySubmit}
          isLoading={isLoading} // This should be a separate loading state for activity logging
          users={users}
          relatedTo={{ entityType: RelatedEntityType.OPPORTUNITY, entityId: opportunityId! }}
        />
      )}

      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Opportunity: ${opportunity.name}`}
          size="2xl"
        >
          {/* 
            Placeholder for OpportunityForm. 
            This form should handle Opportunity editing.
            Props needed: initialData={opportunity}, onSubmit={handleEditOpportunitySubmit}, isLoading, onCancel, users, accounts
          */}
          <div className="p-6">
            <p className="text-center text-neutral-500 dark:text-neutral-400">
              Opportunity Form placeholder. Integrate <code>OpportunityForm</code> component here.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); handleEditOpportunitySubmit({ name: 'Updated Opp from Placeholder' }); }} >
              <Input name="name" label="Opportunity Name" defaultValue={opportunity.name || ''} required />
              <Input name="value" label="Value" type="number" defaultValue={opportunity.value?.toString() || ''} />
              {/* Add more fields as needed or use the actual OpportunityForm component */}
              <div className="mt-6 flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={isLoading}>Cancel</Button>
                <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </PageWrapper>
  );
};
