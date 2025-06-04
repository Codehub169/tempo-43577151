import React, { useEffect, useState, useCallback } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { LeadsTable } from '../components/leads/LeadsTable';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { LeadForm } from '../components/leads/LeadForm';
import { PlusIcon, AdjustmentsHorizontalIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Input } from '../components/ui/Input';
// import { leadService } from '../services/leadService'; // Uncomment when service is ready
// import { userService } from '../services/userService'; // Uncomment when service is ready
import { Lead, LeadStatus, LeadSource, User } from '../types'; // Assuming types are defined

// Mock Data - Replace with API calls
const mockLeads: Lead[] = [
  {
    id: '1', firstName: 'Aarav', lastName: 'Sharma', company: 'Innovate Solutions Ltd.', email: 'aarav.sharma@innovate.com',
    phone: '9876543210', status: LeadStatus.NEW, source: LeadSource.WEBSITE, estimatedValue: 50000, 
    notes: 'Interested in custom software development.', createdById: 1, assignedToId: 1, 
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: '2', firstName: 'Priya', lastName: 'Patel', company: 'TechGenius Pvt. Ltd.', email: 'priya.patel@techgenius.co.in',
    phone: '9123456780', status: LeadStatus.CONTACTED, source: LeadSource.REFERRAL, estimatedValue: 75000, 
    notes: 'Met at a conference. Follow up scheduled.', createdById: 1, assignedToId: 2,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: '3', firstName: 'Rohan', lastName: 'Verma', company: 'Digital Dreams Inc.', email: 'rohan.verma@digitaldreams.com',
    phone: '9988776655', status: LeadStatus.QUALIFIED, source: LeadSource.COLD_CALL, estimatedValue: 120000, 
    notes: 'Good fit for our enterprise package.', createdById: 2, assignedToId: 1,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

const mockUsers: User[] = [
  { id: 1, name: 'Sales Admin', email: 'admin@procrm.com', roles: ['admin'] },
  { id: 2, name: 'John Doe', email: 'john.doe@procrm.com', roles: ['sales'] },
];

export const LeadsListPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLeadsAndUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      // const fetchedLeads = await leadService.getAllLeads(); // Uncomment when service is ready
      // const fetchedUsers = await userService.getAllUsers(); // Uncomment when service is ready
      setLeads(mockLeads); // Replace with fetchedLeads
      setUsers(mockUsers); // Replace with fetchedUsers
    } catch (error) {
      console.error('Failed to fetch leads or users:', error);
      // Add user-facing error notification if needed
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeadsAndUsers();
  }, [fetchLeadsAndUsers]);

  const handleOpenModal = (lead: Lead | null = null) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingLead(null);
    setIsModalOpen(false);
  };

  const handleSubmitLeadForm = async (data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'createdById'>) => {
    setIsLoading(true);
    try {
      if (editingLead) {
        // await leadService.updateLead(editingLead.id, data); // Uncomment when service is ready
        console.log('Updating lead:', editingLead.id, data);
      } else {
        // await leadService.createLead(data); // Uncomment when service is ready
        console.log('Creating lead:', data);
      }
      await fetchLeadsAndUsers(); // Re-fetch leads after create/update
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save lead:', error);
      // Add user-facing error notification
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      setIsLoading(true);
      try {
        // await leadService.deleteLead(leadId); // Uncomment when service is ready
        console.log('Deleting lead:', leadId);
        await fetchLeadsAndUsers(); // Re-fetch leads
      } catch (error) {
        console.error('Failed to delete lead:', error);
        // Add user-facing error notification
      } finally {
        setIsLoading(false);
      }
    }
  };

  const filteredLeads = leads.filter(lead => 
    `${lead.firstName} ${lead.lastName} ${lead.company} ${lead.email}`
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
  );

  return (
    <PageWrapper 
      title="Manage Leads"
      headerContent={
        <Button 
          variant="primary"
          onClick={() => handleOpenModal()}
          iconLeft={<PlusIcon className="h-5 w-5" />}
        >
          Add New Lead
        </Button>
      }
    >
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="w-full sm:max-w-xs">
          <Input 
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            iconLeft={<MagnifyingGlassIcon className="h-5 w-5 text-neutral-400" />}
            inputClassName="dark:bg-neutral-700/50 dark:border-neutral-600 dark:text-neutral-100"
          />
        </div>
        <Button variant="outline" iconLeft={<AdjustmentsHorizontalIcon className="h-5 w-5" />}>
          Filters
        </Button>
      </div>

      <LeadsTable
        leads={filteredLeads}
        users={users}
        onEditLead={handleOpenModal}
        onDeleteLead={handleDeleteLead}
        onViewLead={(lead) => console.log('View lead:', lead.id)} // Replace with navigation to LeadDetailPage
        isLoading={isLoading}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingLead ? 'Edit Lead' : 'Add New Lead'}
        size="2xl"
      >
        <LeadForm 
          onSubmit={handleSubmitLeadForm} 
          initialData={editingLead}
          users={users}
          onCancel={handleCloseModal}
          isLoading={isLoading} 
        />
      </Modal>
    </PageWrapper>
  );
};
