import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
// import { OpportunityForm } from '../components/opportunities/OpportunityForm'; // Assuming this component will be created
// import { OpportunitiesTable } from '../components/opportunities/OpportunitiesTable'; // Assuming this component will be created
import { PlusIcon, MagnifyingGlassIcon, EyeIcon, PencilSquareIcon, TrashIcon, CurrencyDollarIcon, TagIcon, CalendarDaysIcon, UserCircleIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { Opportunity, User, OpportunityStage, PaginationQueryDto, PaginatedResponse } from '../types';
// Mock services - replace with actual API calls
// import * as opportunityService from '../services/opportunityService';
// import * as userService from '../services/userService';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../components/ui/Table'; // Assuming a generic Table component
import { Badge } from '../components/ui/Badge'; // Assuming a generic Badge component

// Mock Data (Remove when API is integrated)
const mockUsers: User[] = [
  { id: 1, name: 'Sales User 1', email: 'sales1@example.com', roles: ['user'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 2, name: 'Sales User 2', email: 'sales2@example.com', roles: ['user'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockOpportunities: Opportunity[] = [
  {
    id: 'op1',
    name: 'Major Software Deal',
    accountId: 'acc1',
    contactId: 'contact1',
    stage: OpportunityStage.PROPOSAL,
    value: 50000,
    expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Large scale software implementation for a key client.',
    createdById: 1,
    assignedToId: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'op2',
    name: 'Consulting Services Q4',
    accountId: 'acc2',
    contactId: 'contact2',
    stage: OpportunityStage.QUALIFICATION,
    value: 25000,
    expectedCloseDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Consulting services for upcoming quarter.',
    createdById: 2,
    assignedToId: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'op3',
    name: 'Website Revamp Project',
    accountId: 'acc1',
    stage: OpportunityStage.NEGOTIATION,
    value: 15000,
    expectedCloseDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Complete website overhaul.',
    createdById: 1,
    assignedToId: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
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
  return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const OpportunitiesListPage: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchOpportunitiesAndUsers = useCallback(async () => {
    setIsLoading(true);
    // Simulate API call
    // const opportunitiesResponse = await opportunityService.getOpportunities({ page: 1, limit: 20 });
    // const usersResponse = await userService.getUsers(); // Or fetch as needed
    // setOpportunities(opportunitiesResponse.data);
    // setUsers(usersResponse.data); // Assuming users are fetched separately or enriched
    setOpportunities(mockOpportunities);
    setUsers(mockUsers);
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  useEffect(() => {
    fetchOpportunitiesAndUsers();
  }, [fetchOpportunitiesAndUsers]);

  const handleOpenModal = (opportunity: Opportunity | null = null) => {
    setEditingOpportunity(opportunity);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingOpportunity(null);
    setIsModalOpen(false);
  };

  const handleSubmitOpportunityForm = async (data: Partial<Opportunity>) => {
    setIsLoading(true);
    console.log('Submitting opportunity data:', data);
    // if (editingOpportunity) {
    //   await opportunityService.updateOpportunity(editingOpportunity.id, data);
    // } else {
    //   await opportunityService.createOpportunity(data as Opportunity); // Ensure data is complete for creation
    // }
    handleCloseModal();
    fetchOpportunitiesAndUsers(); // Re-fetch data
    // setIsLoading(false); // This will be handled by fetchOpportunitiesAndUsers
  };

  const handleDeleteOpportunity = async (opportunityId: string) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      setIsLoading(true);
      console.log('Deleting opportunity:', opportunityId);
      // await opportunityService.deleteOpportunity(opportunityId);
      fetchOpportunitiesAndUsers(); // Re-fetch data
      // setIsLoading(false);
    }
  };

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(
      (op) =>
        op.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (op.accountId && op.accountId.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [opportunities, searchTerm]);

  const getUserName = (userId?: number) => users.find(u => u.id === userId)?.name || 'N/A';

  return (
    <PageWrapper
      title="Manage Opportunities"
      headerContent={
        <Button onClick={() => handleOpenModal()} variant="accent" iconLeft={<PlusIcon className="h-5 w-5" />}>
          Add New Opportunity
        </Button>
      }
    >
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Input
          placeholder="Search opportunities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          iconLeft={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
          className="w-full sm:w-72"
          inputClassName="dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-100"
        />
        {/* Placeholder for more filters */}
        <Button variant="outline" className="w-full sm:w-auto">Filters</Button>
      </div>

      {isLoading && opportunities.length === 0 ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-neutral-500 dark:text-neutral-400">Loading opportunities...</p>
        </div>
      ) : !isLoading && filteredOpportunities.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-neutral-800 rounded-lg shadow">
          <CurrencyDollarIcon className="h-16 w-16 text-neutral-400 dark:text-neutral-500 mx-auto" />
          <h3 className="mt-2 text-xl font-semibold text-neutral-700 dark:text-neutral-200">No Opportunities Found</h3>
          <p className="mt-1 text-neutral-500 dark:text-neutral-400">Get started by adding a new opportunity.</p>
          <Button onClick={() => handleOpenModal()} variant="primary" className="mt-4">
            Add Opportunity
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-neutral-800 shadow-md rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Account ID</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Expected Close</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOpportunities.map((op) => (
                <TableRow key={op.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                  <TableCell className="font-medium text-neutral-800 dark:text-neutral-100">{op.name}</TableCell>
                  <TableCell>{op.accountId || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge colorScheme={opportunityStageColors[op.stage] || 'bg-gray-100 text-gray-700'}>
                      {op.stage}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(op.value)}</TableCell>
                  <TableCell>{formatDate(op.expectedCloseDate)}</TableCell>
                  <TableCell>{getUserName(op.assignedToId)}</TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/opportunities/${op.id}`)} title="View">
                      <EyeIcon className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(op)} title="Edit">
                      <PencilSquareIcon className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteOpportunity(op.id)} title="Delete" className="text-red-500 hover:text-red-700">
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
          title={editingOpportunity ? 'Edit Opportunity' : 'Add New Opportunity'}
          size="2xl"
        >
          {/* 
            Placeholder for OpportunityForm. 
            This form should handle Opportunity creation/editing.
            Props needed: initialData, onSubmit, isLoading, onCancel, users (for assignedTo dropdown), accounts (for account dropdown)
          */}
          <div className="p-6">
            <p className="text-center text-neutral-500 dark:text-neutral-400">
              Opportunity Form placeholder. Integrate <code>OpportunityForm</code> component here.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmitOpportunityForm({ name: 'New Opp from Placeholder' }); }} >
              <Input name="name" label="Opportunity Name" defaultValue={editingOpportunity?.name || ''} required />
              <Input name="value" label="Value" type="number" defaultValue={editingOpportunity?.value?.toString() || ''} />
              {/* Add more fields as needed for a basic form or use the actual OpportunityForm component */}
              <div className="mt-6 flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={handleCloseModal} disabled={isLoading}>Cancel</Button>
                <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
                  {editingOpportunity ? 'Save Changes' : 'Create Opportunity'}
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </PageWrapper>
  );
};
