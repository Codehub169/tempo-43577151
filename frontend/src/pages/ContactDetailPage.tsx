import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ActivityFeed } from '../components/activities/ActivityFeed';
import { LogActivityModal } from '../components/activities/LogActivityModal';
// import { ContactForm } from '../components/contacts/ContactForm'; // To be created
import { Contact, Activity, User, Account, RelatedEntityType, ActivityType, EnrichedActivity } from '../types';
import { ArrowLeftIcon, PencilIcon, PlusCircleIcon, UserCircleIcon, BuildingOffice2Icon, EnvelopeIcon, PhoneIcon, BriefcaseIcon, CalendarDaysIcon, IdentificationIcon } from '@heroicons/react/24/outline';
// Mock services - replace with actual API calls
// import * as contactService from '../services/contactService';
// import * as activityService from '../services/activityService';
// import * as userService from '../services/userService';
// import * as accountService from '../services/accountService';
import { formatPhoneNumber, formatDate, formatDateTime } from '../utils/formatters'; // Assuming formatters exist

// Mock Data (Remove when API is integrated)
const mockContactDetail: Contact = {
  id: '1', firstName: 'Aarav', lastName: 'Sharma', email: 'aarav.sharma@example.com', phone: '9876543210', jobTitle: 'Project Manager',
  description: 'Key contact for Innovate Solutions projects. Experienced in Agile methodologies and client communication.',
  accountId: 'acc1', 
  createdById: 1, assignedToId: 1, createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
};

const mockAccountDetail: Account = {
    id: 'acc1', name: 'Innovate Solutions Ltd', industry: 'IT Services', website: 'https://innovate.example.com', phone: '022-12345678',
    billingStreet: '123 Tech Park', billingCity: 'Mumbai', billingState: 'Maharashtra', billingPostalCode: '400001', billingCountry: 'India',
    shippingStreet: '123 Tech Park', shippingCity: 'Mumbai', shippingState: 'Maharashtra', shippingPostalCode: '400001', shippingCountry: 'India',
    description: 'Leading provider of custom software solutions.',
    createdById: 1, assignedToId: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
};

const mockActivities: Activity[] = [
  { id: 'act1', type: ActivityType.EMAIL, subject: 'Follow-up on project proposal', body: 'Sent an email with the revised project proposal.', occurredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), createdById: 1, relatedTo: { entityType: RelatedEntityType.CONTACT, entityId: '1' }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'act2', type: ActivityType.CALL, subject: 'Initial discussion', body: 'Had a call to discuss project requirements.', occurredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 30, createdById: 2, relatedTo: { entityType: RelatedEntityType.CONTACT, entityId: '1' }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'act3', type: ActivityType.MEETING, subject: 'Project kick-off', body: 'Met with the client for project kick-off.', occurredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, createdById: 1, relatedTo: { entityType: RelatedEntityType.CONTACT, entityId: '1' }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockUsers: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', roles: ['admin'] },
  { id: 2, name: 'Sales User', email: 'sales@example.com', roles: ['sales'] },
];

const DetailItem: React.FC<{ icon: React.ElementType; label: string; value?: string | React.ReactNode; href?: string; }> = ({ icon: Icon, label, value, href }) => {
  if (!value) return null;
  const content = href ? <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">{value}</a> : value;
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

export const ContactDetailPage: React.FC = () => {
  const { contactId } = useParams<{ contactId: string }>();
  const navigate = useNavigate();

  const [contact, setContact] = useState<Contact | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [activities, setActivities] = useState<EnrichedActivity[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogActivityModalOpen, setIsLogActivityModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!contactId) return;
    setIsLoading(true);
    try {
      // Replace with actual API calls
      // const contactRes = await contactService.getContactById(contactId);
      // setContact(contactRes.data);
      // if (contactRes.data.accountId) {
      //   const accountRes = await accountService.getAccountById(contactRes.data.accountId);
      //   setAccount(accountRes.data);
      // }
      // const activitiesRes = await activityService.getActivitiesByRelatedEntity(RelatedEntityType.CONTACT, contactId);
      // const usersRes = await userService.getUsers();
      // setUsers(usersRes.data);
      // setActivities(activitiesRes.data.map(act => ({...act, createdByUser: usersRes.data.find(u => u.id === act.createdById) })));
      
      setContact(mockContactDetail);
      if (mockContactDetail.accountId) {
        setAccount(mockAccountDetail);
      }
      setUsers(mockUsers);
      setActivities(mockActivities.map(act => ({...act, createdByUser: mockUsers.find(u => u.id === act.createdById) })));

    } catch (error) {
      console.error('Failed to fetch contact details:', error);
      // Add user-friendly error notification, possibly navigate back or show error page
      // navigate('/contacts');
    } finally {
      setIsLoading(false);
    }
  }, [contactId, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogActivitySubmit = async (data: any) => {
    if (!contactId) return;
    setIsLoading(true); // Or a specific loading state for activity submission
    try {
      // await activityService.createActivity({ ...data, relatedTo: { entityType: RelatedEntityType.CONTACT, entityId: contactId } });
      console.log('Log activity:', data);
      setIsLogActivityModalOpen(false);
      await fetchData(); // Refresh activities
    } catch (error) {
      console.error('Failed to log activity:', error);
      // Add user-friendly error notification
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditContactSubmit = async (data: any) => {
    if (!contactId) return;
    setIsLoading(true); // Or a specific loading state for form submission
    try {
      // await contactService.updateContact(contactId, data);
      console.log('Update contact:', data);
      setIsEditModalOpen(false);
      await fetchData(); // Refresh contact details
    } catch (error) {
      console.error('Failed to update contact:', error);
      // Add user-friendly error notification
    } finally {
      setIsLoading(false);
    }
  };

  const assignedUser = useMemo(() => users.find(u => u.id === contact?.assignedToId), [users, contact]);
  const createdUser = useMemo(() => users.find(u => u.id === contact?.createdById), [users, contact]);

  if (isLoading && !contact) {
    return (
      <PageWrapper title="Loading Contact...">
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

  if (!contact) {
    return (
      <PageWrapper title="Contact Not Found">
        <div className="text-center py-10">
          <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Contact not found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">The contact you are looking for does not exist or may have been deleted.</p>
          <div className="mt-6">
            <Button asChild variant="outline" iconLeft={<ArrowLeftIcon className="h-5 w-5" />}>
              <Link to="/contacts">Back to Contacts List</Link>
            </Button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={`${contact.firstName} ${contact.lastName}`}
      headerContent={
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setIsEditModalOpen(true)} iconLeft={<PencilIcon className="h-5 w-5" />}>
            Edit Contact
          </Button>
          <Button onClick={() => setIsLogActivityModalOpen(true)} iconLeft={<PlusCircleIcon className="h-5 w-5" />}>
            Log Activity
          </Button>
        </div>
      }
    >
      <div className="mb-4">
        <Link to="/contacts" className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200 transition-colors">
          <ArrowLeftIcon className="h-4 w-4 mr-1.5" />
          Back to Contacts List
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Details Card */}
        <Card className="lg:col-span-2" variant='glass'>
          <Card.Header>
            <Card.Title className="flex items-center">
              <IdentificationIcon className="h-6 w-6 mr-2 text-primary-600 dark:text-primary-400" />
              Contact Information
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <dl className="divide-y divide-neutral-200 dark:divide-neutral-700">
              <DetailItem icon={UserCircleIcon} label="Full Name" value={`${contact.firstName} ${contact.lastName}`} />
              <DetailItem icon={EnvelopeIcon} label="Email" value={contact.email} href={contact.email ? `mailto:${contact.email}` : undefined} />
              <DetailItem icon={PhoneIcon} label="Phone" value={contact.phone ? formatPhoneNumber(contact.phone) : undefined} href={contact.phone ? `tel:${contact.phone}` : undefined} />
              <DetailItem icon={BriefcaseIcon} label="Job Title" value={contact.jobTitle} />
              {account && (
                <DetailItem 
                  icon={BuildingOffice2Icon} 
                  label="Account" 
                  value={account.name} 
                  href={`/accounts/${account.id}`}
                />
              )}
              <DetailItem icon={UserCircleIcon} label="Assigned To" value={assignedUser?.name} />
              {contact.description && (
                <div className="py-3">
                  <dt className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Description</dt>
                  <dd className="mt-1 text-sm text-neutral-900 dark:text-white whitespace-pre-wrap">{contact.description}</dd>
                </div>
              )}
            </dl>
          </Card.Body>
          <Card.Footer className="text-xs text-neutral-500 dark:text-neutral-400">
            <p>Created by: {createdUser?.name || 'N/A'} on {formatDate(contact.createdAt)}</p>
            <p>Last updated: {formatDateTime(contact.updatedAt)}</p>
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
          isLoading={isLoading} // Consider a specific loading state
          users={users}
          relatedTo={{ entityType: RelatedEntityType.CONTACT, entityId: contact.id }}
        />
      )}

      {isEditModalOpen && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Contact" size="2xl">
          {/* Replace with actual ContactForm component */}
          <div className="p-6">
            <p className="text-center text-gray-600 dark:text-gray-400">
              Contact Form will be here. (<code>frontend/src/components/contacts/ContactForm.tsx</code>)
            </p>
            <form onSubmit={(e) => { e.preventDefault(); handleEditContactSubmit({ firstName: contact.firstName, lastName: contact.lastName }); }} className="mt-4 space-y-4">
              <div>
                <label htmlFor="firstNameEdit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                <input id="firstNameEdit" name="firstName" type="text" defaultValue={contact.firstName} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"/>
              </div>
              <div>
                <label htmlFor="lastNameEdit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                <input id="lastNameEdit" name="lastName" type="text" defaultValue={contact.lastName} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"/>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                <Button type="submit" isLoading={isLoading}>Save Changes</Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </PageWrapper>
  );
};
