import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Cog6ToothIcon, UsersIcon, PaintBrushIcon, PuzzlePieceIcon, BellAlertIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export function SettingsPage() {
  const settingsCategories = [
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions.',
      icon: UsersIcon,
      link: '#',
      disabled: true,
    },
    {
      title: 'Customization',
      description: 'Customize fields, layouts, and branding.',
      icon: PaintBrushIcon,
      link: '#',
      disabled: true,
    },
    {
      title: 'Integrations',
      description: 'Connect with other applications and services.',
      icon: PuzzlePieceIcon,
      link: '#',
      disabled: true,
    },
    {
      title: 'Notifications',
      description: 'Configure notification preferences.',
      icon: BellAlertIcon,
      link: '#',
      disabled: true,
    },
    {
      title: 'Security Settings',
      description: 'Manage password policies and two-factor authentication.',
      icon: ShieldCheckIcon,
      link: '#',
      disabled: true,
    },
    {
      title: 'System Configuration',
      description: 'Advanced system settings and logs.',
      icon: Cog6ToothIcon,
      link: '#',
      disabled: true,
    },
  ];

  return (
    <PageWrapper title="Application Settings">
      <div className="text-center mb-12">
        <Cog6ToothIcon className="mx-auto h-16 w-16 text-primary-500 dark:text-primary-400" />
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          This section is under development. Future settings will appear here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsCategories.map((category) => (
          <Card key={category.title} className={`hover:shadow-lg transition-shadow duration-300 ${category.disabled ? 'opacity-60 cursor-not-allowed' : ''}`} variant="glass">
            <Card.Body className="flex flex-col items-center text-center p-6">
              <category.icon className="h-12 w-12 text-primary-500 dark:text-primary-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">{category.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{category.description}</p>
              {/* <Button variant="outline" size="sm" disabled={category.disabled} onClick={() => alert('Navigate to ' + category.title)}>
                Go to {category.title}
              </Button> */}
            </Card.Body>
          </Card>
        ))}
      </div>
    </PageWrapper>
  );
}
