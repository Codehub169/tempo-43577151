import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
// import { AccountForm } from '../components/accounts/AccountForm'; // Assuming this component will be created
// import { AccountsTable } from '../components/accounts/AccountsTable'; // Assuming this component will be created
import { PlusIcon, MagnifyingGlassIcon, EyeIcon, PencilSquareIcon, TrashIcon, BuildingOfficeIcon, GlobeAltIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { Account, User, PaginationQueryDto, PaginatedResponse } from '../types';
// Mock services - replace with actual API calls
// import * as accountService from '../services/accountService';
// import * as userService from '../services/userService';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../components/ui/Table'; // Assuming a generic Table component

// Mock Data (Remove when API is integrated)
const mockUsers: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', roles: ['admin'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 2, name: 'Sales Rep', email: 'salesrep@example.com', roles: ['user'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockAccounts: Account[] = [
  {
    id: 'acc1',
    name: 'Tech Solutions Inc.',
    industry: 'Technology',
    website: 'https://techsolutions.example.com',
    phone: '+91-9876543210',
    createdById: 1,
    assignedToId: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'acc2',
    name: 'Global Corp Ltd.',
    industry: 'Manufacturing',
    website: 'https://globalcorp.example.com',
    phone: '+91-8765432109',
    createdById: 1,
    assignedToId: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'acc3',
    name: 'Innovate Hub',
    industry: 'Startup',
    website: 'https://innovatehub.example.com',
    phone: '+91-7654321098',
    createdById: 2,
    assignedToId: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const AccountsListPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchAccountsAndUsers = useCallback(async () => {
    setIsLoading(true);
    // Simulate API call
    // const accountsResponse = await accountService.getAccounts({ page: 1, limit: 20 });
    // const usersResponse = await userService.getUsers();
    // setAccounts(accountsResponse.data);
    // setUsers(usersResponse.data);
    setAccounts(mockAccounts);
    setUsers(mockUsers);
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  useEffect(() => {
    fetchAccountsAndUsers();
  }, [fetchAccountsAndUsers]);

  const handleOpenModal = (account: Account | null = null) => {
    setEditingAccount(account);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingAccount(null);
    setIsModalOpen(false);
  };

  const handleSubmitAccountForm = async (data: Partial<Account>) => {
    setIsLoading(true);
    console.log('Submitting account data:', data);
    // if (editingAccount) {
    //   await accountService.updateAccount(editingAccount.id, data);
    // } else {
    //   await accountService.createAccount(data as Account);
    // }
    handleCloseModal();
    fetchAccountsAndUsers(); // Re-fetch data
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (window.confirm('Are you sure you want to delete this account? This may also affect related records.')) {
      setIsLoading(true);
      console.log('Deleting account:', accountId);
      // await accountService.deleteAccount(accountId);
      fetchAccountsAndUsers(); // Re-fetch data
    }
  };

  const filteredAccounts = useMemo(() => {
    return accounts.filter(
      (acc) =>
        acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (acc.industry && acc.industry.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (acc.website && acc.website.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [accounts, searchTerm]);

  const getUserName = (userId?: number) => users.find(u => u.id === userId)?.name || 'N/A';

  return (
    <PageWrapper
      title="Manage Accounts"
      headerContent={
        <Button onClick={() => handleOpenModal()} variant="accent" iconLeft={<PlusIcon className="h-5 w-5" />}>
          Add New Account
        </Button>
      }
    >
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Input
          placeholder="Search accounts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          iconLeft={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
          className="w-full sm:w-72"
          inputClassName="dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-100"
        />
        <Button variant="outline" className="w-full sm:w-auto">Filters</Button>
      </div>

      {isLoading && accounts.length === 0 ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-neutral-500 dark:text-neutral-400">Loading accounts...</p>
        </div>
      ) : !isLoading && filteredAccounts.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-neutral-800 rounded-lg shadow">
          <BuildingOfficeIcon className="h-16 w-16 text-neutral-400 dark:text-neutral-500 mx-auto" />
          <h3 className="mt-2 text-xl font-semibold text-neutral-700 dark:text-neutral-200">No Accounts Found</h3>
          <p className="mt-1 text-neutral-500 dark:text-neutral-400">Get started by adding a new client account.</p>
          <Button onClick={() => handleOpenModal()} variant="primary" className="mt-4">
            Add Account
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-neutral-800 shadow-md rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map((acc) => (
                <TableRow key={acc.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                  <TableCell className="font-medium text-neutral-800 dark:text-neutral-100">{acc.name}</TableCell>
                  <TableCell>{acc.industry || 'N/A'}</TableCell>
                  <TableCell>
                    {acc.website ? (
                      <a href={acc.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
                        {acc.website}
                      </a>
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell>{acc.phone || 'N/A'}</TableCell>
                  <TableCell>{getUserName(acc.assignedToId)}</TableCell>
                  <TableCell>{formatDate(acc.createdAt)}</TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/accounts/${acc.id}`)} title="View">
                      <EyeIcon className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(acc)} title="Edit">
                      <PencilSquareIcon className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteAccount(acc.id)} title="Delete" className="text-red-500 hover:text-red-700">
                      <TrashIcon className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingAccount ? 'Edit Account' : 'Add New Account'}
          size="3xl" // Accounts might have more fields
        >
          {/* 
            Placeholder for AccountForm. 
            This form should handle Account creation/editing.
            Props needed: initialData, onSubmit, isLoading, onCancel, users (for assignedTo dropdown)
          */}
          <div className="p-6">
            <p className="text-center text-neutral-500 dark:text-neutral-400">
              Account Form placeholder. Integrate <code>AccountForm</code> component here.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmitAccountForm({ name: 'New Account from Placeholder' }); }} >
              <Input name="name" label="Account Name" defaultValue={editingAccount?.name || ''} required />
              <Input name="industry" label="Industry" defaultValue={editingAccount?.industry || ''} />
              <Input name="website" label="Website" type="url" defaultValue={editingAccount?.website || ''} />
              <Input name="phone" label="Phone" type="tel" defaultValue={editingAccount?.phone || ''} />
              {/* Add more fields as needed for a basic form or use the actual AccountForm component */}
              <div className="mt-6 flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={handleCloseModal} disabled={isLoading}>Cancel</Button>
                <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
                  {editingAccount ? 'Save Changes' : 'Create Account'}
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </PageWrapper>
  );
};
