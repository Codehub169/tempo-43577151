import React from 'react';
import { Lead, LeadStatus, LeadSource } from '../../types'; // Assuming these types are defined
import { Button } from '../ui/Button';
import { PencilSquareIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Table, Thead, Tbody, Tr, Th, Td } from '@radix-ui/themes'; // Using Radix Themes table for better styling
import { Badge } from '../ui/Badge'; // Assuming a Badge component exists or will be created

// Mock user type for assignedTo - replace with actual type and data fetching
interface User {
  id: string | number;
  name: string;
}

interface EnrichedLead extends Lead {
  assignedToUser?: User; // Assuming lead objects might be enriched with user details
  createdByUser?: User;
}

interface LeadsTableProps {
  leads: EnrichedLead[];
  onEditLead: (lead: EnrichedLead) => void;
  onDeleteLead: (leadId: string) => void;
  onViewLead: (leadId: string) => void;
  isLoading?: boolean;
  users?: User[]; // To map assignedToId to user name if not pre-enriched
}

const statusColorMap: Record<LeadStatus, string> = {
  [LeadStatus.NEW]: 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100',
  [LeadStatus.CONTACTED]: 'bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-sky-100',
  [LeadStatus.QUALIFIED]: 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100',
  [LeadStatus.PROPOSAL_SENT]: 'bg-purple-100 text-purple-700 dark:bg-purple-700 dark:text-purple-100',
  [LeadStatus.NEGOTIATION]: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100',
  [LeadStatus.UNQUALIFIED]: 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100',
  [LeadStatus.CONVERTED]: 'bg-teal-100 text-teal-700 dark:bg-teal-700 dark:text-teal-100',
};

const sourceColorMap: Record<LeadSource, string> = {
  [LeadSource.WEBSITE]: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-indigo-100',
  [LeadSource.REFERRAL]: 'bg-pink-100 text-pink-700 dark:bg-pink-700 dark:text-pink-100',
  [LeadSource.COLD_CALL]: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100',
  [LeadSource.EMAIL_MARKETING]: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-700 dark:text-cyan-100',
  [LeadSource.SOCIAL_MEDIA]: 'bg-lime-100 text-lime-700 dark:bg-lime-700 dark:text-lime-100',
  [LeadSource.OTHER]: 'bg-stone-100 text-stone-700 dark:bg-stone-700 dark:text-stone-100',
};

export const LeadsTable: React.FC<LeadsTableProps> = ({ leads, onEditLead, onDeleteLead, onViewLead, isLoading, users = [] }) => {
  const getUserName = (userId: string | number | undefined) => {
    if (!userId) return 'N/A';
    const user = users.find(u => String(u.id) === String(userId));
    return user ? user.name : 'Unknown User';
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        <p className="ml-4 text-neutral-600 dark:text-neutral-300">Loading leads...</p>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg shadow">
        <EyeIcon className="mx-auto h-12 w-12 text-neutral-400 dark:text-neutral-500" />
        <h3 className="mt-2 text-lg font-medium text-neutral-900 dark:text-neutral-100">No Leads Found</h3>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">There are currently no leads to display. Try creating a new one!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-lg bg-white dark:bg-neutral-800">
      <Table.Root variant="surface" size="2">
        <Thead className="bg-neutral-50 dark:bg-neutral-700">
          <Tr>
            <Th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Name</Th>
            <Th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Company</Th>
            <Th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Email & Phone</Th>
            <Th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Status</Th>
            <Th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Source</Th>
            <Th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Est. Value</Th>
            <Th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Assigned To</Th>
            <Th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Actions</Th>
          </Tr>
        </Thead>
        <Tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {leads.map((lead) => (
            <Tr key={lead.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-colors duration-150">
              <Td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{lead.firstName} {lead.lastName}</div>
              </Td>
              <Td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">{lead.company || 'N/A'}</Td>
              <Td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-neutral-900 dark:text-neutral-100">{lead.email}</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">{lead.phone || 'N/A'}</div>
              </Td>
              <Td className="px-6 py-4 whitespace-nowrap">
                <Badge className={`${statusColorMap[lead.status] || 'bg-gray-100 text-gray-700'}`}>
                  {lead.status.charAt(0).toUpperCase() + lead.status.slice(1).toLowerCase().replace(/_/g, ' ')}
                </Badge>
              </Td>
              <Td className="px-6 py-4 whitespace-nowrap">
                {lead.source ? (
                   <Badge className={`${sourceColorMap[lead.source] || 'bg-gray-100 text-gray-700'}`}>
                    {lead.source.charAt(0).toUpperCase() + lead.source.slice(1).toLowerCase().replace(/_/g, ' ')}
                  </Badge>
                ) : (
                  <span className="text-xs text-neutral-400 dark:text-neutral-500">N/A</span>
                )}
              </Td>
              <Td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                {formatCurrency(lead.estimatedValue)}
              </Td>
              <Td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                {lead.assignedToUser ? lead.assignedToUser.name : getUserName(lead.assignedToId)}
              </Td>
              <Td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <Button variant="ghost" size="icon" onClick={() => onViewLead(lead.id)} title="View Lead">
                  <EyeIcon className="h-5 w-5 text-neutral-500 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onEditLead(lead)} title="Edit Lead">
                  <PencilSquareIcon className="h-5 w-5 text-neutral-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDeleteLead(lead.id)} title="Delete Lead">
                  <TrashIcon className="h-5 w-5 text-neutral-500 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400" />
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table.Root>
    </div>
  );
};

// A simple Badge component definition (can be moved to ui/Badge.tsx)
// If you already have a Badge component, you can remove this.
// For now, keeping it here to make LeadsTable self-contained for this batch.
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}
const Badge: React.FC<BadgeProps> = ({ children, className, ...props }) => {
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
