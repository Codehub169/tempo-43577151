import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../components/ui/Table'; // Assuming a generic Table component
import { Badge } from '../components/ui/Badge'; // Assuming a generic Badge component
import { PlusIcon, MagnifyingGlassIcon, EyeIcon, PencilSquareIcon, TrashIcon, TicketIcon as PageIcon } from '@heroicons/react/24/outline';
import { Ticket, User, Account, Project, TicketStatus, TicketPriority } from '../types'; // Assuming these types exist
import { formatDate } from '../utils/formatters'; // Assuming utils

// Mock data - replace with API calls
const mockTickets: Ticket[] = [
  {
    id: 'tkt_1',
    title: 'Login issue on staging environment', 
    description: 'Users are unable to login to the staging server after the last deployment.',
    status: TicketStatus.OPEN,
    priority: TicketPriority.HIGH,
    accountId: 'acc_1',
    projectId: 'proj_1',
    createdById: 1,
    assignedToId: 2,
    createdAt: new Date('2023-10-01T10:00:00Z'),
    updatedAt: new Date('2023-10-01T11:00:00Z'),
  },
  {
    id: 'tkt_2',
    title: 'API performance degradation',
    description: 'The main API endpoint /api/data is responding slowly.',
    status: TicketStatus.IN_PROGRESS,
    priority: TicketPriority.URGENT,
    accountId: 'acc_2',
    createdById: 3,
    assignedToId: 1,
    createdAt: new Date('2023-10-02T14:00:00Z'),
    updatedAt: new Date('2023-10-02T15:30:00Z'),
  },
];

const mockUsers: User[] = [
  { id: 1, name: 'Alice Wonderland', email: 'alice@example.com', roles: ['admin'] },
  { id: 2, name: 'Bob The Builder', email: 'bob@example.com', roles: ['user'] },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', roles: ['user'] },
];

const mockAccounts: Account[] = [
  { id: 'acc_1', name: 'Stark Industries', industry: 'Technology', createdAt: new Date(), updatedAt: new Date() },
  { id: 'acc_2', name: 'Wayne Enterprises', industry: 'Conglomerate', createdAt: new Date(), updatedAt: new Date() },
];

const mockProjects: Project[] = [
  { id: 'proj_1', name: 'Iron Man Suit Mark V', accountId: 'acc_1', status: 'IN_PROGRESS', createdAt: new Date(), updatedAt: new Date() },
];

export const ticketStatusColors: Record<TicketStatus, string> = {
  [TicketStatus.OPEN]: 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100',
  [TicketStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-600 dark:text-yellow-100',
  [TicketStatus.RESOLVED]: 'bg-green-100 text-green-700 dark:bg-green-600 dark:text-green-100',
  [TicketStatus.CLOSED]: 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-100',
  [TicketStatus.REOPENED]: 'bg-purple-100 text-purple-700 dark:bg-purple-600 dark:text-purple-100',
};

export const ticketPriorityColors: Record<TicketPriority, string> = {
  [TicketPriority.LOW]: 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-100',
  [TicketPriority.MEDIUM]: 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100',
  [TicketPriority.HIGH]: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-600 dark:text-yellow-100',
  [TicketPriority.URGENT]: 'bg-red-100 text-red-700 dark:bg-red-600 dark:text-red-100',
};

interface EnrichedTicket extends Ticket {
  assignedToUser?: User;
  createdByUser?: User;
  account?: Account;
  project?: Project;
}

export function SupportTicketsListPage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<EnrichedTicket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTicketsData = useCallback(async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUsers(mockUsers);
    setAccounts(mockAccounts);
    setProjects(mockProjects);
    const enriched = mockTickets.map(ticket => ({
      ...ticket,
      assignedToUser: mockUsers.find(u => u.id === ticket.assignedToId),
      createdByUser: mockUsers.find(u => u.id === ticket.createdById),
      account: mockAccounts.find(a => a.id === ticket.accountId),
      project: mockProjects.find(p => p.id === ticket.projectId),
    }));
    setTickets(enriched);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchTicketsData();
  }, [fetchTicketsData]);

  const handleOpenModal = (ticket: Ticket | null = null) => {
    setEditingTicket(ticket);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingTicket(null);
    setIsModalOpen(false);
  };

  const handleSubmitTicketForm = async (data: any) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (editingTicket) {
      console.log('Updating ticket:', editingTicket.id, data);
      // Update logic here: setTickets(prev => prev.map(t => t.id === editingTicket.id ? {...t, ...data} : t));
    } else {
      console.log('Creating new ticket:', data);
      // Create logic here: setTickets(prev => [...prev, {...data, id: `tkt_${Date.now()}`}]);
    }
    handleCloseModal();
    fetchTicketsData(); // Re-fetch to simulate update
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Deleting ticket:', ticketId);
      // Delete logic here: setTickets(prev => prev.filter(t => t.id !== ticketId));
      fetchTicketsData(); // Re-fetch to simulate update
    }
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket =>
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.account?.name && ticket.account.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ticket.project?.name && ticket.project.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ticket.status && ticket.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ticket.priority && ticket.priority.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [tickets, searchTerm]);

  const getUserName = (userId?: number) => users.find(u => u.id === userId)?.name || 'N/A';
  const getAccountName = (accountId?: string) => accounts.find(a => a.id === accountId)?.name || 'N/A';
  const getProjectName = (projectId?: string) => projects.find(p => p.id === projectId)?.name || 'N/A';

  return (
    <PageWrapper
      title="Support Tickets"
      headerContent={
        <Button onClick={() => handleOpenModal()} iconLeft={<PlusIcon className="h-5 w-5" />}>
          Add New Ticket
        </Button>
      }
    >
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Input
          placeholder="Search tickets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
          iconLeft={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />}
        />
        {/* Placeholder for advanced filters */}
        <Button variant="outline" disabled>Filters</Button>
      </div>

      {isLoading && !filteredTickets.length ? (
        <div className="flex justify-center items-center h-64">
          <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : !filteredTickets.length ? (
        <div className="text-center py-12">
          <PageIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No tickets found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new support ticket.</p>
          <div className="mt-6">
            <Button onClick={() => handleOpenModal()} iconLeft={<PlusIcon className="h-5 w-5" />}>
              Add New Ticket
            </Button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors duration-150">
                  <TableCell className="font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    <Link to={`/tickets/${ticket.id}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                      {ticket.title}
                    </Link>
                  </TableCell>
                  <TableCell>{ticket.account ? <Link to={`/accounts/${ticket.accountId}`} className="hover:underline">{ticket.account.name}</Link> : 'N/A'}</TableCell>
                  <TableCell>{ticket.project ? <Link to={`/projects/${ticket.projectId}`} className="hover:underline">{ticket.project.name}</Link> : 'N/A'}</TableCell>
                  <TableCell>
                    <Badge className={ticketStatusColors[ticket.status]}>{ticket.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={ticketPriorityColors[ticket.priority]}>{ticket.priority}</Badge>
                  </TableCell>
                  <TableCell>{ticket.assignedToUser?.name || 'Unassigned'}</TableCell>
                  <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                  <TableCell className="space-x-2 whitespace-nowrap">
                    <Button size="sm" variant="ghost" onClick={() => navigate(`/tickets/${ticket.id}`)} title="View">
                      <EyeIcon className="h-5 w-5" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleOpenModal(ticket)} title="Edit">
                      <PencilSquareIcon className="h-5 w-5" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteTicket(ticket.id)} className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400" title="Delete">
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
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTicket ? 'Edit Ticket' : 'Add New Ticket'}>
          {/* Placeholder for TicketForm */}
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitTicketForm({ title: 'New Ticket from Modal' }); }} className="space-y-6">
            <div>
              <label htmlFor="ticketTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ticket Title</label>
              <Input id="ticketTitle" name="title" type="text" defaultValue={editingTicket?.title || ''} required className="mt-1" />
            </div>
            <div>
              <label htmlFor="ticketDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea id="ticketDescription" name="description" rows={3} defaultValue={editingTicket?.description || ''} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-neutral-700 dark:text-gray-200"></textarea>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
              <Button type="submit" isLoading={isLoading}>Save Ticket</Button>
            </div>
          </form>
        </Modal>
      )}
    </PageWrapper>
  );
}
