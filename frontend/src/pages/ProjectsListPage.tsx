import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
// import { ProjectForm } from '../components/projects/ProjectForm'; // To be created
import { MagnifyingGlassIcon, PlusIcon, EyeIcon, PencilSquareIcon, TrashIcon, BriefcaseIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { Project, User, Account, ProjectStatus, RelatedEntityType } from '../types';
// Mock services - replace with actual API calls
// import * as projectService from '../services/projectService';
// import * as userService from '../services/userService';
// import * as accountService from '../services/accountService';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { formatDate, formatCurrency } from '../utils/formatters'; // Assuming formatters exist

// Mock Data (Remove when API is integrated)
const mockProjects: Project[] = [
  {
    id: 'proj1', name: 'CRM Implementation', accountId: 'acc1',
    status: ProjectStatus.IN_PROGRESS, startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), 
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    budget: 500000, projectManagerId: 1, createdById: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'proj2', name: 'Mobile App Development', accountId: 'acc2',
    status: ProjectStatus.PLANNING, startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    budget: 1200000, projectManagerId: 2, createdById: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'proj3', name: 'Website Redesign', accountId: 'acc1',
    status: ProjectStatus.COMPLETED, startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    budget: 300000, projectManagerId: 1, createdById: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

const mockUsers: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', roles: ['admin'] },
  { id: 2, name: 'Project Lead', email: 'pm@example.com', roles: ['project_manager'] },
];

const mockAccounts: Account[] = [
  { id: 'acc1', name: 'Innovate Solutions Ltd', industry: 'IT Services', createdById: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'acc2', name: 'Tech Mahindra', industry: 'IT Consulting', createdById: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const projectStatusColors: Record<ProjectStatus, string> = {
  [ProjectStatus.NOT_STARTED]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  [ProjectStatus.PLANNING]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  [ProjectStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [ProjectStatus.ON_HOLD]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  [ProjectStatus.COMPLETED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [ProjectStatus.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export const ProjectsListPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchProjectsData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Replace with actual API calls
      // const [projectsRes, usersRes, accountsRes] = await Promise.all([
      //   projectService.getProjects({ page: 1, limit: 100 }),
      //   userService.getUsers(),
      //   accountService.getAccounts({ page: 1, limit: 100 })
      // ]);
      // setProjects(projectsRes.data.map(p => ({ ...p, account: accountsRes.data.find(a => a.id === p.accountId), projectManager: usersRes.data.find(u => u.id === p.projectManagerId) })));
      // setUsers(usersRes.data);
      // setAccounts(accountsRes.data);
      setProjects(mockProjects.map(p => ({
         ...p, 
         account: mockAccounts.find(a => a.id === p.accountId),
         projectManager: mockUsers.find(u => u.id === p.projectManagerId)
      })));
      setUsers(mockUsers);
      setAccounts(mockAccounts);
    } catch (error) {
      console.error('Failed to fetch projects data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjectsData();
  }, [fetchProjectsData]);

  const handleOpenModal = (project: Project | null = null) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleSubmitProjectForm = async (data: any) => {
    setIsLoading(true);
    try {
      if (editingProject) {
        // await projectService.updateProject(editingProject.id, data);
        console.log('Update project:', editingProject.id, data);
      } else {
        // await projectService.createProject(data);
        console.log('Create project:', data);
      }
      await fetchProjectsData();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setIsLoading(true);
      try {
        // await projectService.deleteProject(projectId);
        console.log('Delete project:', projectId);
        await fetchProjectsData();
      } catch (error) {
        console.error('Failed to delete project:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.account?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  return (
    <PageWrapper
      title="Manage Projects"
      headerContent={
        <Button onClick={() => handleOpenModal()} variant="accent" iconLeft={<PlusIcon className="h-5 w-5" />}>
          Add New Project
        </Button>
      }
    >
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Input
          type="text"
          placeholder="Search projects (name, account, status...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:max-w-xs"
          iconLeft={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
        />
      </div>

      {isLoading && projects.length === 0 ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading projects...</p>
        </div>
      ) : !isLoading && filteredProjects.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-neutral-800 rounded-lg shadow">
          <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No projects found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm ? 'Try adjusting your search or filter criteria.' : 'Get started by adding a new project.'}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Button onClick={() => handleOpenModal()} variant="primary" iconLeft={<PlusIcon className="h-5 w-5" />}>
                Add New Project
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Project Name</TableHeaderCell>
                <TableHeaderCell>Account</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Start Date</TableHeaderCell>
                <TableHeaderCell>End Date</TableHeaderCell>
                <TableHeaderCell>Budget</TableHeaderCell>
                <TableHeaderCell>Project Manager</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors duration-150">
                  <TableCell className="font-medium text-neutral-900 dark:text-white">
                    <Link to={`/projects/${project.id}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                      {project.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {project.account ? (
                      <Link to={`/accounts/${project.accountId}`} className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center">
                        <BuildingOffice2Icon className="h-4 w-4 mr-1.5 text-gray-500 dark:text-gray-400" />
                        {project.account.name}
                      </Link>
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge colorScheme={projectStatusColors[project.status]} className="capitalize">
                      {project.status.replace('_', ' ').toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{project.startDate ? formatDate(project.startDate) : 'N/A'}</TableCell>
                  <TableCell>{project.endDate ? formatDate(project.endDate) : 'N/A'}</TableCell>
                  <TableCell>{project.budget ? formatCurrency(project.budget, 'INR') : 'N/A'}</TableCell>
                  <TableCell>{project.projectManager?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost" onClick={() => navigate(`/projects/${project.id}`)} title="View Project">
                        <EyeIcon className="h-5 w-5" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleOpenModal(project)} title="Edit Project">
                        <PencilSquareIcon className="h-5 w-5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400" onClick={() => handleDeleteProject(project.id)} title="Delete Project">
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
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingProject ? 'Edit Project' : 'Add New Project'} size="3xl">
          {/* Replace with actual ProjectForm component */}
          <div className="p-6">
            <p className="text-center text-gray-600 dark:text-gray-400">
              Project Form will be here. (<code>frontend/src/components/projects/ProjectForm.tsx</code>)
            </p>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmitProjectForm({ name: 'Test Project' }); }} className="mt-4 space-y-4">
              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Name</label>
                <Input id="projectName" name="name" type="text" defaultValue={editingProject?.name || ''} required />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
                <Button type="submit" isLoading={isLoading}>{editingProject ? 'Save Changes' : 'Add Project'}</Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </PageWrapper>
  );
};
