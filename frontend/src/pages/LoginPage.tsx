import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ShieldCheckIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
// import { useAuth } from '../contexts/AuthContext'; // Uncomment when AuthContext is ready

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  // const { login, isLoading, error } = useAuth(); // Uncomment when AuthContext is ready
  const [isLoading, setIsLoading] = useState(false); // Temporary loading state
  const [error, setError] = useState<string | null>(null); // Temporary error state

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setError(null);
    setIsLoading(true);
    // await login(data.email, data.password); // Uncomment when AuthContext is ready
    // Simulate API call
    setTimeout(() => {
      if (data.email === 'admin@procrm.com' && data.password === 'password123') {
        console.log('Login successful:', data);
        localStorage.setItem('authToken', 'dummy-token'); // Simulate token storage
        navigate('/'); // Navigate to dashboard on successful login
      } else {
        setError('Invalid email or password. Try admin@procrm.com / password123');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 flex flex-col justify-center items-center p-4">
      <div className="flex items-center mb-8 text-neutral-700 dark:text-neutral-200">
        <img src="/logo.svg" alt="ProCRM Logo" className="h-12 w-auto mr-3" />
        <h1 className="text-4xl font-poppins font-bold">ProCRM</h1>
      </div>
      <Card 
        variant='glass' 
        className="w-full max-w-md shadow-2xl dark:shadow-neutral-700/50"
        titleClassName='text-center text-2xl font-poppins font-semibold text-neutral-700 dark:text-neutral-100'
      >
        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center mb-6">
            <ShieldCheckIcon className="h-16 w-16 text-primary-500 mb-3" />
            <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100">Welcome Back!</h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">Sign in to access your CRM dashboard.</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              error={errors.email?.message}
              disabled={isLoading}
              inputClassName="dark:bg-neutral-700/50 dark:border-neutral-600 dark:text-neutral-100"
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
              disabled={isLoading}
              inputClassName="dark:bg-neutral-700/50 dark:border-neutral-600 dark:text-neutral-100"
            />
            
            {error && (
              <p className="text-sm text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-md text-center">
                {error}
              </p>
            )}

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full text-lg py-3"
              isLoading={isLoading}
              iconRight={!isLoading ? <ArrowRightOnRectangleIcon className="h-5 w-5" /> : undefined}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          
          <p className="mt-8 text-center text-sm text-neutral-600 dark:text-neutral-400">
            Don't have an account?{' '}
            <a href="#" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
              Contact Support
            </a>
          </p>
        </div>
      </Card>
       <footer className="mt-12 text-center text-sm text-neutral-500 dark:text-neutral-400">
        &copy; {new Date().getFullYear()} ProCRM. All rights reserved. <br />
        An End-to-End CRM for Indian IT Companies.
      </footer>
    </div>
  );
};
