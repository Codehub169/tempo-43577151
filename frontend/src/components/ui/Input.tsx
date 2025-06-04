import React, { forwardRef, InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { ExclamationCircleIcon } from '@radix-ui/react-icons';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  error?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>((
  { 
    label,
    name,
    type = 'text',
    error,
    wrapperClassName,
    labelClassName,
    inputClassName,
    errorClassName,
    iconLeft,
    iconRight,
    disabled,
    ...props 
  },
  ref
) => {
  const baseInputClasses = clsx(
    'block w-full appearance-none rounded-md border px-3 py-2 placeholder-neutral-400 shadow-sm focus:outline-none sm:text-sm',
    'transition-colors duration-150 ease-in-out',
    {
      'border-neutral-300 focus:border-primary-500 focus:ring-primary-500': !error && !disabled,
      'border-red-500 focus:border-red-500 focus:ring-red-500': error,
      'bg-neutral-100 border-neutral-300 cursor-not-allowed text-neutral-500': disabled,
      'pl-10': iconLeft,
      'pr-10': iconRight,
    },
    inputClassName
  );

  return (
    <div className={clsx('w-full', wrapperClassName)}>
      {label && (
        <label 
          htmlFor={name} 
          className={clsx('block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1', labelClassName)}
        >
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        {iconLeft && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {React.cloneElement(iconLeft as React.ReactElement, { className: 'h-5 w-5 text-neutral-400' })}
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          ref={ref}
          disabled={disabled}
          className={baseInputClasses}
          {...props}
        />
        {iconRight && !error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
             {React.cloneElement(iconRight as React.ReactElement, { className: 'h-5 w-5 text-neutral-400' })}
          </div>
        )}
        {error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>
      {error && (
        <p className={clsx('mt-1 text-xs text-red-600', errorClassName)} id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
