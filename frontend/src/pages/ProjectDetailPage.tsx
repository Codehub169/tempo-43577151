import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ActivityFeed } from '../components/activities/ActivityFeed';
import { LogActivityModal } from '../components/activities/LogActivityModal';
// import { ProjectForm } from '../components/projects/ProjectForm'; // To be created
import { Project, Activity, User, Account, ProjectStatus, RelatedEntityType, ActivityType, EnrichedActivity } from '../types';
import { ArrowLeftIcon, PencilIcon, PlusCircleIcon, BriefcaseIcon, BuildingOffice2Icon, UserGroupIcon, CalendarDaysIcon, CurrencyRupeeIcon, InformationCircleIcon, UserCircleIcon, TagIcon } from '@heroicons/react/24/outline';
// Mock services - replace with actual API calls
// import * as projectService from '../services/projectService';
// import * as activityService from '../services/activityService';
// import * as userService from '../services/userService';
// import * as accountService from '../services/accountService';
import { Badge } from '../components/ui/Badge';
import { formatDate, formatDateTime, formatCurrency } from '../utils/formatters'; // Assuming formatters exist

// Mock Data (Remove when API is integrated)
const mockProjectDetail: Project = {
  id: 'proj1', name: 'CRM Implementation for Innovate Solutions', accountId: 'acc1',
  description: 'Full-cycle CRM implementation including data migration, customization, and training. The goal is to streamline sales and support processes.',
  status: ProjectStatus.IN_PROGRESS, startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), 
  endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
  budget: 500000, projectManagerId: 1, teamMemberIds: [1, 2],
  createdById: 2, createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
};

const mockAccountForProject: Account = {
    id: 'acc1', name: 'Innovate Solutions Ltd', industry: 'IT Services', createdById: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
};

const mockActivitiesForProject: Activity[] = [
  { id: 'actP1', type: ActivityType.MEETING, subject: 'Weekly Sync Meeting', body: 'Discussed progress, blockers, and next steps.', occurredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 45, createdById: 1, relatedTo: { entityType: RelatedEntityType.PROJECT, entityId: 'proj1' }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'actP2', type: ActivityType.TASK, subject: 'Setup Staging Environment', body: 'Staging environment setup completed and tested.', occurredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), outcome: 'Completed', createdById: 2, relatedTo: { entityType: RelatedEntityType.PROJECT, entityId: 'proj1' }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockUsersForProject: User[] = [
  { id: 1, name: 'Admin User (PM)', email: 'admin@example.com', roles: ['admin', 'project_manager'] },
  { id: 2, name: 'Dev Lead', email: 'devlead@example.com', roles: ['developer'] },
];

const projectStatusColors: Record<ProjectStatus, string> = {
  [ProjectStatus.NOT_STARTED]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  [ProjectStatus.PLANNING]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  [ProjectStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [ProjectStatus.ON_HOLD]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  [ProjectStatus.COMPLETED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [ProjectStatus.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const DetailItem: React.FC<{ icon: React.ElementType; label: string; value?: string | React.ReactNode; href?: string; }> = ({ icon: Icon, label, value, href }) => {
  if (!value && value !== 0) return null; // Allow 0 for budget etc.
  const content = href ? <Link to={href} className="text-primary-600 dark:text-primary-400 hover:underline">{value}</Link> : value;
  return (
    <div className="flex items-start py-3">
      <Icon className="h-5 w-5 text-neutral-500 dark:text-neutral-400 mr-3 flex-shrink-0 mt-0.5" />
      <div className="flex-grow">
        <dt className="text-sm font-medium text-neutral-600 dark:text-neutral-300">{label}</dt>
        <dd className="mt-1 text-sm text-neutral-900 dark:text-white break-words">{content}</dd>
      </div>
    </div>
  );
};

export const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [activities, setActivities] = useState<EnrichedActivity[]>([]);
  const [users, setUsers] = useState<User[]>([]); // For PM, CreatedBy, Team Members resolution
  const [isLoading, setIsLoading] = useState(true);
  const [isLogActivityModalOpen, setIsLogActivityModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    try {
      // Replace with actual API calls
      // const projectRes = await projectService.getProjectById(projectId);
      // setProject(projectRes.data);
      // if (projectRes.data.accountId) {
      //   const accountRes = await accountService.getAccountById(projectRes.data.accountId);
      //   setAccount(accountRes.data);
      // }
      // const activitiesRes = await activityService.getActivitiesByRelatedEntity(RelatedEntityType.PROJECT, projectId);
      // const usersRes = await userService.getUsers(); // Fetch all users or specific ones
      // setUsers(usersRes.data);
      // setActivities(activitiesRes.data.map(act => ({...act, createdByUser: usersRes.data.find(u => u.id === act.createdById) })));
      
      setProject(mockProjectDetail);
      if (mockProjectDetail.accountId) {
        setAccount(mockAccountForProject);
      }
      setUsers(mockUsersForProject);
      setActivities(mockActivitiesForProject.map(act => ({...act, createdByUser: mockUsersForProject.find(u => u.id === act.createdById) })));

    } catch (error) {
      console.error('Failed to fetch project details:', error);
      // navigate('/projects');
    } finally {
      setIsLoading(false);
    }
  }, [projectId, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogActivitySubmit = async (data: any) => {
    if (!projectId) return;
    // Simulating API call
    console.log('Log activity for project:', data);
    setIsLogActivityModalOpen(false);
    // await fetchData(); // Refresh activities
    const newActivity: EnrichedActivity = {
      id: `actP${Date.now()}`,
      ...data,
      relatedTo: { entityType: RelatedEntityType.PROJECT, entityId: projectId },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdById: users[0]?.id || 1, // Mock current user
      createdByUser: users.find(u => u.id === (users[0]?.id || 1)),
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const handleEditProjectSubmit = async (data: any) => {
    if (!projectId) return;
    // Simulating API call
    console.log('Update project:', data);
    setIsEditModalOpen(false);
    // await fetchData(); // Refresh project details
    setProject(prev => prev ? { ...prev, ...data, updatedAt: new Date().toISOString() } : null);
  };

  const projectManager = useMemo(() => users.find(u => u.id === project?.projectManagerId), [users, project]);
  const createdByUser = useMemo(() => users.find(u => u.id === project?.createdById), [users, project]);
  const teamMembers = useMemo(() => project?.teamMemberIds?.map(id => users.find(u => u.id === id)).filter(Boolean) as User[] || [], [users, project]);

  if (isLoading && !project) {
    // Skeleton Loader
    return (
      <PageWrapper title="Loading Project...">
        <div className="space-y-6">
          <Card className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          </Card>
          <Card className="animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  if (!project) {
    return (
      <PageWrapper title="Project Not Found">
        <div className="text-center py-10">
          <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Project not found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">The project you are looking for does not exist or may have been deleted.</p>
          <div className="mt-6">
            <Button asChild variant="outline" iconLeft={<ArrowLeftIcon className="h-5 w-5" />}>
              <Link to="/projects">Back to Projects List</Link>
            </Button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={project.name}
      headerContent={
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setIsEditModalOpen(true)} iconLeft={<PencilIcon className="h-5 w-5" />}>
            Edit Project
          </Button>
          <Button onClick={() => setIsLogActivityModalOpen(true)} iconLeft={<PlusCircleIcon className="h-5 w-5" />}>
            Log Activity
          </Button>
        </div>
      }
    >
      <div className="mb-4">
        <Link to="/projects" className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200 transition-colors">
          <ArrowLeftIcon className="h-4 w-4 mr-1.5" />
          Back to Projects List
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Details Card */}
        <Card className="lg:col-span-2" variant='glass'>
          <Card.Header>
            <div className="flex justify-between items-start">
                <Card.Title className="flex items-center">
                    <BriefcaseIcon className="h-6 w-6 mr-2 text-primary-600 dark:text-primary-400" />
                    Project Overview
                </Card.Title>
                <Badge colorScheme={projectStatusColors[project.status]} className="capitalize text-sm px-3 py-1">
                    {project.status.replace('_', ' ').toLowerCase()}
                </Badge>
            </div>
          </Card.Header>
          <Card.Body>
            <dl className="divide-y divide-neutral-200 dark:divide-neutral-700">
              <DetailItem icon={TagIcon} label="Project Name" value={project.name} />
              {account && (
                <DetailItem 
                  icon={BuildingOffice2Icon} 
                  label="Account" 
                  value={account.name} 
                  href={`/accounts/${account.id}`}
                />
              )}
              <DetailItem icon={UserCircleIcon} label="Project Manager" value={projectManager?.name} />
              <DetailItem icon={CalendarDaysIcon} label="Start Date" value={project.startDate ? formatDate(project.startDate) : 'N/A'} />
              <DetailItem icon={CalendarDaysIcon} label="End Date" value={project.endDate ? formatDate(project.endDate) : 'N/A'} />
              <DetailItem icon={CurrencyRupeeIcon} label="Budget" value={project.budget ? formatCurrency(project.budget, 'INR') : 'N/A'} />
              {project.description && (
                <div className="py-3">
                    <dt className="text-sm font-medium text-neutral-600 dark:text-neutral-300 flex items-center">
                        <InformationCircleIcon className="h-5 w-5 text-neutral-500 dark:text-neutral-400 mr-3 flex-shrink-0" />
                        Description
                    </dt>
                    <dd className="mt-1 text-sm text-neutral-900 dark:text-white whitespace-pre-wrap pl-8">{project.description}</dd>
                </div>
              )}
              {teamMembers.length > 0 && (
                <div className="py-3">
                    <dt className="text-sm font-medium text-neutral-600 dark:text-neutral-300 flex items-center">
                        <UserGroupIcon className="h-5 w-5 text-neutral-500 dark:text-neutral-400 mr-3 flex-shrink-0" />
                        Team Members
                    </dt>
                    <dd className="mt-1 text-sm text-neutral-900 dark:text-white pl-8">
                        <ul className="list-disc list-inside">
                            {teamMembers.map(member => <li key={member.id}>{member.name}</li>)}
                        </ul>
                    </dd>
                </div>
              )}
            </dl>
          </Card.Body>
          <Card.Footer className="text-xs text-neutral-500 dark:text-neutral-400">
            <p>Created by: {createdByUser?.name || 'N/A'} on {formatDate(project.createdAt)}</p>
            <p>Last updated: {formatDateTime(project.updatedAt)}</p>
          </Card.Footer>
        </Card>

        {/* Activity Feed Card */}
        <Card className="lg:col-span-1" variant='glass-darker'>
          <Card.Header>
            <Card.Title>Activity Feed</Card.Title>
          </Card.Header>
          <Card.Body>
            <ActivityFeed activities={activities} isLoading={isLoading} />
          </Card.Body>
        </Card>
      </div>

      {isLogActivityModalOpen && (
        <LogActivityModal
          isOpen={isLogActivityModalOpen}
          onClose={() => setIsLogActivityModalOpen(false)}
          onSubmit={handleLogActivitySubmit}
          isLoading={false} // Simulating non-blocking for mock
          users={users}
          relatedTo={{ entityType: RelatedEntityType.PROJECT, entityId: project.id }}
          defaultActivityType={ActivityType.TASK}
        />
      )}

      {isEditModalOpen && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Project" size="3xl">
          {/* Replace with actual ProjectForm component */}
          <div className="p-6">
            <p className="text-center text-gray-600 dark:text-gray-400">
              Project Form will be here. (<code>frontend/src/components/projects/ProjectForm.tsx</code>)
            </p>
            <form onSubmit={(e) => { e.preventDefault(); handleEditProjectSubmit({ name: project.name }); }} className="mt-4 space-y-4">
              <div>
                <label htmlFor="projectNameEdit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Name</label>
                <input id="projectNameEdit" name="name" type="text" defaultValue={project.name} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"/>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                <Button type="submit" isLoading={false}>Save Changes</Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </PageWrapper>
  );
};
