import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
// import { ContactForm } from '../components/contacts/ContactForm'; // To be created
import { MagnifyingGlassIcon, PlusIcon, EyeIcon, PencilSquareIcon, TrashIcon, UserCircleIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { Contact, User, Account, RelatedEntityType } from '../types';
// Mock services - replace with actual API calls
// import * as contactService from '../services/contactService';
// import * as userService from '../services/userService';
// import * as accountService from '../services/accountService';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge'; // Assuming Badge component exists
import { formatPhoneNumber, formatDate } from '../utils/formatters'; // Assuming formatters exist

// Mock Data (Remove when API is integrated)
const mockContacts: Contact[] = [
  {
    id: '1', firstName: 'Aarav', lastName: 'Sharma', email: 'aarav.sharma@example.com', phone: '9876543210', jobTitle: 'Project Manager',
    accountId: 'acc1', account: { id: 'acc1', name: 'Innovate Solutions Ltd' } as Account,
    createdById: 1, assignedToId: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: '2', firstName: 'Priya', lastName: 'Patel', email: 'priya.patel@example.com', phone: '9876543211', jobTitle: 'Lead Developer',
    accountId: 'acc2', account: { id: 'acc2', name: 'Tech Mahindra' } as Account,
    createdById: 2, assignedToId: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: '3', firstName: 'Rohan', lastName: 'Mehta', email: 'rohan.mehta@example.com', phone: '9876543212', jobTitle: 'Sales Executive',
    accountId: 'acc1', account: { id: 'acc1', name: 'Innovate Solutions Ltd' } as Account,
    createdById: 1, assignedToId: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

const mockUsers: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', roles: ['admin'] },
  { id: 2, name: 'Sales User', email: 'sales@example.com', roles: ['sales'] },
];

const mockAccounts: Account[] = [
  { id: 'acc1', name: 'Innovate Solutions Ltd', industry: 'IT Services', createdById: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'acc2', name: 'Tech Mahindra', industry: 'IT Consulting', createdById: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export const ContactsListPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchContactsData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Replace with actual API calls
      // const [contactsRes, usersRes, accountsRes] = await Promise.all([
      //   contactService.getContacts({ page: 1, limit: 100 }), // Adjust pagination as needed
      //   userService.getUsers(),
      //   accountService.getAccounts({ page: 1, limit: 100 })
      // ]);
      // setContacts(contactsRes.data.map(c => ({ ...c, account: accountsRes.data.find(a => a.id === c.accountId) })));
      // setUsers(usersRes.data);
      // setAccounts(accountsRes.data);
      setContacts(mockContacts.map(c => ({ ...c, account: mockAccounts.find(a => a.id === c.accountId) })));
      setUsers(mockUsers);
      setAccounts(mockAccounts);
    } catch (error) {
      console.error('Failed to fetch contacts data:', error);
      // Add user-friendly error notification
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContactsData();
  }, [fetchContactsData]);

  const handleOpenModal = (contact: Contact | null = null) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContact(null);
  };

  const handleSubmitContactForm = async (data: any) => {
    setIsLoading(true);
    try {
      if (editingContact) {
        // await contactService.updateContact(editingContact.id, data);
        console.log('Update contact:', editingContact.id, data);
      } else {
        // await contactService.createContact(data);
        console.log('Create contact:', data);
      }
      await fetchContactsData();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save contact:', error);
      // Add user-friendly error notification
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setIsLoading(true);
      try {
        // await contactService.deleteContact(contactId);
        console.log('Delete contact:', contactId);
        await fetchContactsData();
      } catch (error) {
        console.error('Failed to delete contact:', error);
        // Add user-friendly error notification
      } finally {
        setIsLoading(false);
      }
    }
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact =>
      `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.account?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [contacts, searchTerm]);

  const getUserName = (userId?: number) => users.find(u => u.id === userId)?.name || 'N/A';
  const getAccountName = (accountId?: string) => accounts.find(a => a.id === accountId)?.name || 'N/A';

  return (
    <PageWrapper
      title="Manage Contacts"
      headerContent={
        <Button onClick={() => handleOpenModal()} variant="accent" iconLeft={<PlusIcon className="h-5 w-5" />}>
          Add New Contact
        </Button>
      }
    >
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Input
          type="text"
          placeholder="Search contacts (name, email, company...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:max-w-xs"
          iconLeft={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
        />
        {/* Placeholder for advanced filters */}
        {/* <Button variant="outline">Filters</Button> */}
      </div>

      {isLoading && contacts.length === 0 ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading contacts...</p>
        </div>
      ) : !isLoading && filteredContacts.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-neutral-800 rounded-lg shadow">
          <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No contacts found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm ? 'Try adjusting your search or filter criteria.' : 'Get started by adding a new contact.'}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Button onClick={() => handleOpenModal()} variant="primary" iconLeft={<PlusIcon className="h-5 w-5" />}>
                Add New Contact
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Phone</TableHeaderCell>
                <TableHeaderCell>Job Title</TableHeaderCell>
                <TableHeaderCell>Account</TableHeaderCell>
                <TableHeaderCell>Assigned To</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors duration-150">
                  <TableCell className="font-medium text-neutral-900 dark:text-white">
                    <Link to={`/contacts/${contact.id}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                      {contact.firstName} {contact.lastName}
                    </Link>
                  </TableCell>
                  <TableCell>{contact.email || 'N/A'}</TableCell>
                  <TableCell>{contact.phone ? formatPhoneNumber(contact.phone) : 'N/A'}</TableCell>
                  <TableCell>{contact.jobTitle || 'N/A'}</TableCell>
                  <TableCell>
                    {contact.account ? (
                      <Link to={`/accounts/${contact.accountId}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                        {contact.account.name}
                      </Link>
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell>{getUserName(contact.assignedToId)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost" onClick={() => navigate(`/contacts/${contact.id}`)} title="View Contact">
                        <EyeIcon className="h-5 w-5" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleOpenModal(contact)} title="Edit Contact">
                        <PencilSquareIcon className="h-5 w-5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400" onClick={() => handleDeleteContact(contact.id)} title="Delete Contact">
                        <TrashIcon className="h-5 w-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingContact ? 'Edit Contact' : 'Add New Contact'} size="2xl">
          {/* Replace with actual ContactForm component */}
          <div className="p-6">
            <p className="text-center text-gray-600 dark:text-gray-400">
              Contact Form will be here. (<code>frontend/src/components/contacts/ContactForm.tsx</code>)
            </p>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmitContactForm({ firstName: 'Test', lastName: 'Contact' }); }} className="mt-4 space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                <Input id="firstName" name="firstName" type="text" defaultValue={editingContact?.firstName || ''} required />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                <Input id="lastName" name="lastName" type="text" defaultValue={editingContact?.lastName || ''} required />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
                <Button type="submit" isLoading={isLoading}>{editingContact ? 'Save Changes' : 'Add Contact'}</Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </PageWrapper>
  );
};
