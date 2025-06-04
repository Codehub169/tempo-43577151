import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ActivityFeed } from '../components/activities/ActivityFeed';
import { LogActivityModal } from '../components/activities/LogActivityModal';
// import { AccountForm } from '../components/accounts/AccountForm'; // Assuming this component will be created
import { Account, Activity, User, Contact, Opportunity, Project, Ticket, ActivityType, RelatedEntityType, OpportunityStage, ProjectStatus, TicketStatus, TicketPriority } from '../types';
import { 
    ArrowLeftIcon, PencilIcon, PlusIcon, 
    BuildingOfficeIcon, GlobeAltIcon, PhoneIcon, UserCircleIcon, InformationCircleIcon, MapPinIcon, BriefcaseIcon,
    UsersIcon, CurrencyDollarIcon, ClipboardDocumentListIcon, TicketIcon 
} from '@heroicons/react/24/outline';
// Mock services - replace with actual API calls
// import * as accountService from '../services/accountService';
// import * as activityService from '../services/activityService';
// import * as userService from '../services/userService';
// import * as contactService from '../services/contactService';
// import * as opportunityService from '../services/opportunityService';
// import * as projectService from '../services/projectService';
// import * as ticketService from '../services/ticketService';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input'; // For placeholder form

// Mock Data (Remove when API is integrated)
const mockUsers: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', roles: ['admin'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 2, name: 'Sales Rep', email: 'salesrep@example.com', roles: ['user'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockAccountDetail: Account = {
  id: 'acc1',
  name: 'Tech Solutions Inc.',
  industry: 'Technology',
  website: 'https://techsolutions.example.com',
  phone: '+91-9876543210',
  description: 'Leading provider of innovative tech solutions for enterprise clients. Specializes in cloud computing and AI.',
  billingStreet: '123 Tech Park', billingCity: 'Bangalore', billingState: 'Karnataka', billingPostalCode: '560001', billingCountry: 'India',
  shippingStreet: '123 Tech Park', shippingCity: 'Bangalore', shippingState: 'Karnataka', shippingPostalCode: '560001', shippingCountry: 'India',
  createdById: 1,
  assignedToId: 2,
  createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockContacts: Contact[] = [
  { id: 'contact1', firstName: 'Priya', lastName: 'Sharma', email: 'priya.sharma@techsolutions.example.com', phone: '+91-9876543211', jobTitle: 'CEO', accountId: 'acc1', createdById:1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'contact2', firstName: 'Amit', lastName: 'Patel', email: 'amit.patel@techsolutions.example.com', phone: '+91-9876543212', jobTitle: 'CTO', accountId: 'acc1', createdById:1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockOpportunities: Opportunity[] = [
  { id: 'op1', name: 'Cloud Migration Project', accountId: 'acc1', stage: OpportunityStage.PROPOSAL, value: 75000, expectedCloseDate: new Date().toISOString(), createdById:2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'op2', name: 'AI Chatbot Development', accountId: 'acc1', stage: OpportunityStage.CLOSED_WON, value: 40000, expectedCloseDate: new Date().toISOString(), createdById:2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockProjects: Project[] = [
    { id: 'proj1', name: 'AI Chatbot Implementation', accountId: 'acc1', status: ProjectStatus.IN_PROGRESS, budget: 40000, startDate: new Date().toISOString(), createdById:1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
];

const mockTickets: Ticket[] = [
    { id: 'tkt1', title: 'Login Issue on Portal', accountId: 'acc1', status: TicketStatus.OPEN, priority: TicketPriority.HIGH, createdById:1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
];

const mockActivities: Activity[] = [
  { id: 'act1', type: ActivityType.MEETING, subject: 'Quarterly Business Review', body: 'Discussed Q3 performance and Q4 goals.', occurredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), createdById: 2, relatedAccountId: 'acc1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'act2', type: ActivityType.EMAIL, subject: 'New Service Proposal', body: 'Sent details about our new AI analytics service.', occurredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), createdById: 2, relatedAccountId: 'acc1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const formatAddress = (account: Account, type: 'billing' | 'shipping') => {
    const street = account[`${type}Street`];
    const city = account[`${type}City`];
    const state = account[`${type}State`];
    const postalCode = account[`${type}PostalCode`];
    const country = account[`${type}Country`];
    const parts = [street, city, state, postalCode, country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'N/A';
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return 'N/A';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
};

export const AccountDetailPage: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();

  const [account, setAccount] = useState<Account | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogActivityModalOpen, setIsLogActivityModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!accountId) {
      navigate('/accounts');
      return;
    }
    setIsLoading(true);
    // Simulate API calls
    // const accData = await accountService.getAccountById(accountId);
    // const contactData = await contactService.getContacts({ accountId });
    // const oppData = await opportunityService.getOpportunities({ accountId });
    // const projectData = await projectService.getProjects({ accountId });
    // const ticketData = await ticketService.getTickets({ accountId });
    // const activityData = await activityService.getActivities({ relatedEntityType: RelatedEntityType.ACCOUNT, relatedEntityId: accountId });
    // const userData = await userService.getUsers();

    // setAccount(accData);
    // setContacts(contactData.data);
    // setOpportunities(oppData.data);
    // setProjects(projectData.data);
    // setTickets(ticketData.data);
    // setActivities(activityData.data);
    // setUsers(userData.data);

    const foundAccount = mockAccounts.find(acc => acc.id === accountId) || mockAccountDetail; // Fallback for demo
    setAccount(foundAccount);
    setContacts(mockContacts.filter(c => c.accountId === accountId));
    setOpportunities(mockOpportunities.filter(o => o.accountId === accountId));
    setProjects(mockProjects.filter(p => p.accountId === accountId));
    setTickets(mockTickets.filter(t => t.accountId === accountId));
    setActivities(mockActivities.filter(act => act.relatedAccountId === accountId));
    setUsers(mockUsers);
    setTimeout(() => setIsLoading(false), 1000);
  }, [accountId, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogActivitySubmit = async (data: Omit<Activity, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    console.log('Logging activity for account:', data);
    // await activityService.createActivity({ ...data, relatedTo: { entityType: RelatedEntityType.ACCOUNT, entityId: accountId! } });
    setIsLogActivityModalOpen(false);
    fetchData(); // Refresh activities
  };

  const handleEditAccountSubmit = async (data: Partial<Account>) => {
    console.log('Updating account:', data);
    // await accountService.updateAccount(accountId!, data);
    setIsEditModalOpen(false);
    fetchData(); // Refresh account details
  };

  const assignedUser = useMemo(() => users.find(u => u.id === account?.assignedToId), [users, account]);
  const createdUser = useMemo(() => users.find(u => u.id === account?.createdById), [users, account]);

  if (isLoading && !account) {
    return (
      <PageWrapper title="Loading Account...">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 animate-pulse"><div className="h-[500px] bg-neutral-200 dark:bg-neutral-700 rounded"></div></Card>
          <Card className="animate-pulse"><div className="h-[500px] bg-neutral-200 dark:bg-neutral-700 rounded"></div></Card>
        </div>
      </PageWrapper>
    );
  }

  if (!account) {
    return (
      <PageWrapper title="Account Not Found">
        <div className="text-center py-10">
          <InformationCircleIcon className="h-16 w-16 text-red-500 mx-auto" />
          <h3 className="mt-2 text-xl font-semibold text-neutral-700 dark:text-neutral-200">Account Not Found</h3>
          <p className="mt-1 text-neutral-500 dark:text-neutral-400">The account you are looking for does not exist or has been removed.</p>
          <Button onClick={() => navigate('/accounts')} variant="primary" className="mt-6">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Accounts List
          </Button>
        </div>
      </PageWrapper>
    );
  }

  const DetailItem: React.FC<{ icon: React.ElementType; label: string; value?: string | React.ReactNode; href?: string }> = ({ icon: Icon, label, value, href }) => (
    <div className="flex items-start py-2">
      <Icon className="h-5 w-5 mr-3 mt-0.5 text-primary-500 dark:text-primary-400 flex-shrink-0" />
      <div>
        <dt className="font-medium text-neutral-600 dark:text-neutral-300">{label}</dt>
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
            <dd className="text-neutral-700 dark:text-neutral-200">{value || 'N/A'}</dd>
          </a>
        ) : (
          <dd className="text-neutral-700 dark:text-neutral-200">{value || 'N/A'}</dd>
        )}
      </div>
    </div>
  );

  return (
    <PageWrapper
      title={account.name}
      headerContent={
        <div className="flex space-x-3">
          <Button onClick={() => setIsEditModalOpen(true)} variant="outline" iconLeft={<PencilIcon className="h-5 w-5" />}>
            Edit Account
          </Button>
          <Button onClick={() => setIsLogActivityModalOpen(true)} variant="accent" iconLeft={<PlusIcon className="h-5 w-5" />}>
            Log Activity
          </Button>
        </div>
      }
    >
      <div className="mb-6">
        <Link to="/accounts" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Accounts List
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8">
        {/* Main Account Details Card */}
        <Card className="lg:col-span-2" variant="glass">
          <Card.Header>
            <Card.Title className="text-2xl">{account.name}</Card.Title>
            {account.industry && <p className="text-neutral-500 dark:text-neutral-400">{account.industry}</p>}
          </Card.Header>
          <Card.Body>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm">
              <DetailItem icon={GlobeAltIcon} label="Website" value={account.website} href={account.website} />
              <DetailItem icon={PhoneIcon} label="Phone" value={account.phone} href={`tel:${account.phone}`} />
              <DetailItem icon={UserCircleIcon} label="Assigned To" value={assignedUser?.name} />
              <DetailItem icon={BriefcaseIcon} label="Industry" value={account.industry} />
              <div className="md:col-span-2">
                <DetailItem icon={InformationCircleIcon} label="Description" value={<span className="whitespace-pre-wrap">{account.description || 'No description provided.'}</span>} />
              </div>
              <div className="md:col-span-2 pt-2">
                <h4 className="text-md font-semibold text-neutral-700 dark:text-neutral-200 mb-1">Addresses</h4>
              </div>
              <DetailItem icon={MapPinIcon} label="Billing Address" value={formatAddress(account, 'billing')} />
              <DetailItem icon={MapPinIcon} label="Shipping Address" value={formatAddress(account, 'shipping')} />
            </dl>
          </Card.Body>
          <Card.Footer className="text-xs text-neutral-500 dark:text-neutral-400">
            Created by {createdUser?.name || 'N/A'} on {formatDate(account.createdAt)}. Last updated on {formatDate(account.updatedAt)}.
          </Card.Footer>
        </Card>

        {/* Activity Feed Card */}
        <Card variant="glass-darker">
          <Card.Header><Card.Title>Activity Feed</Card.Title></Card.Header>
          <Card.Body className="max-h-[600px] overflow-y-auto custom-scrollbar">
            <ActivityFeed activities={activities.map(a => ({...a, createdByUser: users.find(u => u.id === a.createdById)}))} isLoading={isLoading} />
          </Card.Body>
        </Card>

        {/* Related Entities Section */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
          {/* Contacts Card */}
          <Card>
            <Card.Header><Card.Title className="flex items-center"><UsersIcon className="h-5 w-5 mr-2 text-primary-500"/>Contacts ({contacts.length})</Card.Title></Card.Header>
            <Card.Body className="max-h-80 overflow-y-auto custom-scrollbar">
              {contacts.length > 0 ? (
                <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {contacts.map(contact => (
                    <li key={contact.id} className="py-3">
                      <Link to={`/contacts/${contact.id}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                        <p className="font-medium text-neutral-800 dark:text-neutral-100">{contact.firstName} {contact.lastName}</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">{contact.jobTitle} - {contact.email}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-neutral-500 dark:text-neutral-400">No contacts linked to this account.</p>}
            </Card.Body>
            <Card.Footer><Button variant="link" size="sm" onClick={() => navigate(`/contacts?accountId=${accountId}`)}>View All Contacts</Button></Card.Footer>
          </Card>

          {/* Opportunities Card */}
          <Card>
            <Card.Header><Card.Title className="flex items-center"><CurrencyDollarIcon className="h-5 w-5 mr-2 text-accent-500"/>Opportunities ({opportunities.length})</Card.Title></Card.Header>
            <Card.Body className="max-h-80 overflow-y-auto custom-scrollbar">
              {opportunities.length > 0 ? (
                <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {opportunities.map(opp => (
                    <li key={opp.id} className="py-3">
                      <Link to={`/opportunities/${opp.id}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                        <div className="flex justify-between items-center">
                            <p className="font-medium text-neutral-800 dark:text-neutral-100">{opp.name}</p>
                            <Badge colorScheme={opp.stage === OpportunityStage.CLOSED_WON ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>{opp.stage}</Badge>
                        </div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">{formatCurrency(opp.value)} - Closes: {formatDate(opp.expectedCloseDate)}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-neutral-500 dark:text-neutral-400">No opportunities linked to this account.</p>}
            </Card.Body>
            <Card.Footer><Button variant="link" size="sm" onClick={() => navigate(`/opportunities?accountId=${accountId}`)}>View All Opportunities</Button></Card.Footer>
          </Card>

          {/* Projects Card */}
          <Card>
            <Card.Header><Card.Title className="flex items-center"><ClipboardDocumentListIcon className="h-5 w-5 mr-2 text-indigo-500"/>Projects ({projects.length})</Card.Title></Card.Header>
            <Card.Body className="max-h-80 overflow-y-auto custom-scrollbar">
              {projects.length > 0 ? (
                <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {projects.map(proj => (
                    <li key={proj.id} className="py-3">
                       <Link to={`/projects/${proj.id}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                        <div className="flex justify-between items-center">
                            <p className="font-medium text-neutral-800 dark:text-neutral-100">{proj.name}</p>
                            <Badge colorScheme={'bg-blue-100 text-blue-700'}>{proj.status}</Badge>
                        </div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Budget: {formatCurrency(proj.budget)}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-neutral-500 dark:text-neutral-400">No projects linked to this account.</p>}
            </Card.Body>
            <Card.Footer><Button variant="link" size="sm" onClick={() => navigate(`/projects?accountId=${accountId}`)}>View All Projects</Button></Card.Footer>
          </Card>

          {/* Tickets Card */}
          <Card>
            <Card.Header><Card.Title className="flex items-center"><TicketIcon className="h-5 w-5 mr-2 text-red-500"/>Support Tickets ({tickets.length})</Card.Title></Card.Header>
            <Card.Body className="max-h-80 overflow-y-auto custom-scrollbar">
              {tickets.length > 0 ? (
                <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {tickets.map(ticket => (
                    <li key={ticket.id} className="py-3">
                      <Link to={`/tickets/${ticket.id}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                        <div className="flex justify-between items-center">
                            <p className="font-medium text-neutral-800 dark:text-neutral-100">{ticket.title}</p>
                            <Badge colorScheme={ticket.status === TicketStatus.CLOSED || ticket.status === TicketStatus.RESOLVED ? 'bg-gray-100 text-gray-700' : 'bg-orange-100 text-orange-700'}>{ticket.status}</Badge>
                        </div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Priority: {ticket.priority}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-neutral-500 dark:text-neutral-400">No support tickets linked to this account.</p>}
            </Card.Body>
            <Card.Footer><Button variant="link" size="sm" onClick={() => navigate(`/tickets?accountId=${accountId}`)}>View All Tickets</Button></Card.Footer>
          </Card>
        </div>
      </div>

      {isLogActivityModalOpen && (
        <LogActivityModal
          isOpen={isLogActivityModalOpen}
          onClose={() => setIsLogActivityModalOpen(false)}
          onSubmit={handleLogActivitySubmit}
          isLoading={isLoading} // Separate loading state ideal
          users={users}
          relatedTo={{ entityType: RelatedEntityType.ACCOUNT, entityId: accountId! }}
        />
      )}

      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Account: ${account.name}`}
          size="3xl"
        >
          {/* 
            Placeholder for AccountForm. 
            Props needed: initialData={account}, onSubmit={handleEditAccountSubmit}, isLoading, onCancel, users
          */}
          <div className="p-6">
            <p className="text-center text-neutral-500 dark:text-neutral-400">
              Account Form placeholder. Integrate <code>AccountForm</code> component here.
            </p>
             <form onSubmit={(e) => { e.preventDefault(); handleEditAccountSubmit({ name: 'Updated Account from Placeholder' }); }} >
              <Input name="name" label="Account Name" defaultValue={account.name || ''} required />
              <Input name="industry" label="Industry" defaultValue={account.industry || ''} />
              <Input name="website" label="Website" type="url" defaultValue={account.website || ''} />
              <Input name="phone" label="Phone" type="tel" defaultValue={account.phone || ''} />
              {/* Add more fields as needed or use the actual AccountForm component */}
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
