import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-md w-full bg-white dark:bg-neutral-800/50 p-8 sm:p-12 rounded-xl shadow-2xl backdrop-blur-lg border border-neutral-200 dark:border-neutral-700/50">
        <ExclamationTriangleIcon className="mx-auto h-20 w-20 text-primary-500 dark:text-primary-400 mb-6" />
        
        <h1 className="text-6xl font-extrabold text-primary-600 dark:text-primary-400 tracking-tight sm:text-7xl font-poppins">
          404
        </h1>
        <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-gray-100 sm:text-3xl font-poppins">
          Page Not Found
        </h2>
        <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
          Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you might have mistyped the URL.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            asChild 
            variant="primary" 
            size="lg"
            className="w-full sm:w-auto shadow-lg hover:shadow-primary-500/50 transition-shadow duration-300"
          >
            <Link to="/">
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Go to Dashboard
            </Link>
          </Button>
          <Button 
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
        
        <p className="mt-10 text-xs text-gray-500 dark:text-gray-400">
          If you believe this is an error, please contact support.
        </p>
      </div>
      <footer className="absolute bottom-6 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} ProCRM. All rights reserved.
      </footer>
    </div>
  );
}
