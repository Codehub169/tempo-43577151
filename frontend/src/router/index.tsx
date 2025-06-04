import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';

// Lazy load page components for better initial load performance
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const LeadsListPage = lazy(() => import('../pages/LeadsListPage'));
const LeadDetailPage = lazy(() => import('../pages/LeadDetailPage'));
const OpportunitiesListPage = lazy(() => import('../pages/OpportunitiesListPage'));
const OpportunityDetailPage = lazy(() => import('../pages/OpportunityDetailPage'));
const AccountsListPage = lazy(() => import('../pages/AccountsListPage'));
const AccountDetailPage = lazy(() => import('../pages/AccountDetailPage'));
const ContactsListPage = lazy(() => import('../pages/ContactsListPage'));
const ContactDetailPage = lazy(() => import('../pages/ContactDetailPage'));
const ProjectsListPage = lazy(() => import('../pages/ProjectsListPage'));
const ProjectDetailPage = lazy(() => import('../pages/ProjectDetailPage'));
const SupportTicketsListPage = lazy(() => import('../pages/SupportTicketsListPage'));
const SupportTicketDetailPage = lazy(() => import('../pages/SupportTicketDetailPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));

const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center h-screen w-screen bg-neutral-100 dark:bg-neutral-900">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
    <p className="ml-4 text-xl font-semibold text-neutral-700 dark:text-neutral-200">Loading...</p>
  </div>
);

const MainLayout: React.FC = () => (
  <div className="flex h-screen bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-50 dark:bg-neutral-800 p-0">
        {/* PageWrapper is applied within each page component for specific padding */}
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  </div>
);

const AuthLayout: React.FC = () => (
  <Suspense fallback={<LoadingFallback />}>
    <Outlet />
  </Suspense>
);

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/leads" element={<LeadsListPage />} />
            <Route path="/leads/:leadId" element={<LeadDetailPage />} />
            <Route path="/opportunities" element={<OpportunitiesListPage />} />
            <Route path="/opportunities/:opportunityId" element={<OpportunityDetailPage />} />
            <Route path="/accounts" element={<AccountsListPage />} />
            <Route path="/accounts/:accountId" element={<AccountDetailPage />} />
            <Route path="/contacts" element={<ContactsListPage />} />
            <Route path="/contacts/:contactId" element={<ContactDetailPage />} />
            <Route path="/projects" element={<ProjectsListPage />} />
            <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
            <Route path="/tickets" element={<SupportTicketsListPage />} />
            <Route path="/tickets/:ticketId" element={<SupportTicketDetailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
