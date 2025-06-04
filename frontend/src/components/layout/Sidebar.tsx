import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  QueueListIcon, 
  LightBulbIcon, 
  BuildingOffice2Icon, 
  UserGroupIcon, 
  BriefcaseIcon, 
  TicketIcon, 
  Cog6ToothIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  exact?: boolean;
}

const primaryNavigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, exact: true },
  { name: 'Leads', href: '/leads', icon: QueueListIcon },
  { name: 'Opportunities', href: '/opportunities', icon: LightBulbIcon },
  { name: 'Accounts', href: '/accounts', icon: BuildingOffice2Icon },
  { name: 'Contacts', href: '/contacts', icon: UserGroupIcon },
  { name: 'Projects', href: '/projects', icon: BriefcaseIcon },
  { name: 'Support Tickets', href: '/tickets', icon: TicketIcon },
];

const secondaryNavigation: NavItem[] = [
  { name: 'Activities', href: '/activities', icon: ClipboardDocumentListIcon },
  { name: 'Reports', href: '/reports', icon: ChartBarIcon }, 
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (item: NavItem) => {
    if (item.exact) {
      return location.pathname === item.href;
    }
    return location.pathname.startsWith(item.href);
  };

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-neutral-800 dark:bg-neutral-900 text-neutral-100 transition-all duration-300 ease-in-out shadow-lg">
      <div className="flex items-center justify-center h-20 border-b border-neutral-700 dark:border-neutral-800">
        <img className="h-10 w-auto" src="/logo.svg" alt="ProCRM" />
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        <h3 className="px-3 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">Main Menu</h3>
        {primaryNavigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={clsx(
              'group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out',
              isActive(item)
                ? 'bg-primary-500 text-white shadow-sm hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700'
                : 'text-neutral-300 hover:bg-neutral-700 hover:text-white dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200'
            )}
          >
            <item.icon className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
            {item.name}
          </NavLink>
        ))}
        <h3 className="px-3 pt-4 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2 mt-4">Tools & Settings</h3>
        {secondaryNavigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={clsx(
              'group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out',
              isActive(item)
                ? 'bg-primary-500 text-white shadow-sm hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700'
                : 'text-neutral-300 hover:bg-neutral-700 hover:text-white dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200'
            )}
          >
            <item.icon className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-3 border-t border-neutral-700 dark:border-neutral-800">
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          © {new Date().getFullYear()} ProCRM Inc.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
