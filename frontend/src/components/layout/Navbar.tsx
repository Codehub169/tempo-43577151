import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  Cog8ToothIcon,
  ArrowLeftOnRectangleIcon,
  HomeIcon,
  BriefcaseIcon,
  TicketIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
// Assuming logo.svg is in public folder or handled by Vite correctly
// For src/assets, use: import logoUrl from '../../assets/logo.svg';
const logoUrl = '/logo.svg'; // Public folder path

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Leads', href: '/leads', icon: BriefcaseIcon },
  { name: 'Opportunities', href: '/opportunities', icon: ChartBarIcon },
  { name: 'Accounts', href: '/accounts', icon: BuildingOfficeIcon },
  { name: 'Contacts', href: '/contacts', icon: UserGroupIcon },
  { name: 'Projects', href: '/projects', icon: ClipboardDocumentListIcon },
  { name: 'Tickets', href: '/tickets', icon: TicketIcon },
];

const userNavigation = [
  { name: 'Your Profile', href: '/profile' },
  { name: 'Settings', href: '/settings' },
  { name: 'Sign out', href: '/logout' }, // This should ideally trigger a logout function
];

const Navbar: React.FC = () => {
  // Placeholder for auth status - replace with actual auth context
  const isAuthenticated = true; 

  return (
    <Disclosure as="nav" className="bg-white dark:bg-neutral-800 shadow-md fixed w-full z-40 top-0 left-0">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <Link to="/" className="flex-shrink-0">
                  <img className="h-10 w-auto" src={logoUrl} alt="ProCRM Logo" />
                </Link>
                <div className="hidden md:ml-6 md:flex md:space-x-4">
                  {isAuthenticated && navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) => clsx(
                        'inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ease-in-out',
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-300'
                          : 'text-neutral-500 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-700 dark:hover:text-neutral-100'
                      )}
                    >
                      <item.icon className="h-5 w-5 mr-2" aria-hidden="true" />
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>

              {isAuthenticated && (
                <div className="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex rounded-full bg-white dark:bg-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800">
                        <span className="sr-only">Open user menu</span>
                        <UserCircleIcon className="h-8 w-8 rounded-full text-neutral-500 dark:text-neutral-400" />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={React.Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-neutral-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <Link
                                to={item.href}
                                className={clsx(
                                  active ? 'bg-neutral-100 dark:bg-neutral-700' : '',
                                  'block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 font-inter'
                                )}
                              >
                                {item.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              )}

              <div className="-mr-2 flex items-center md:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-neutral-400 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-500 dark:hover:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile menu panel */}
          <Disclosure.Panel className="md:hidden border-t border-neutral-200 dark:border-neutral-700">
            {isAuthenticated && (
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={NavLink}
                    to={item.href}
                    className={({ isActive }: { isActive: boolean }) => clsx(
                      'flex items-center rounded-md px-3 py-2 text-base font-medium transition-colors duration-150 ease-in-out',
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-300'
                        : 'text-neutral-500 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-700 dark:hover:text-neutral-100'
                    )}
                  >
                    <item.icon className="h-6 w-6 mr-3" aria-hidden="true" />
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            )}
            {isAuthenticated && (
              <div className="border-t border-neutral-200 dark:border-neutral-600 pb-3 pt-4">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <UserCircleIcon className="h-10 w-10 rounded-full text-neutral-500 dark:text-neutral-400" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-neutral-800 dark:text-white font-poppins">User Name</div>
                    <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400 font-inter">user@example.com</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  {userNavigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as={Link}
                      to={item.href}
                      className="block rounded-md px-3 py-2 text-base font-medium text-neutral-500 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-700 dark:hover:text-neutral-100 font-inter"
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
