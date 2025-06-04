import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string | React.ReactNode;
  titleClassName?: string;
  headerContent?: React.ReactNode; // For custom content in header, like buttons
  bodyClassName?: string;
  footerContent?: React.ReactNode;
  footerClassName?: string;
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'glass-darker';
}

const Card: React.FC<CardProps> = ({
  title,
  titleClassName,
  headerContent,
  bodyClassName,
  footerContent,
  footerClassName,
  children,
  className,
  variant = 'default',
  ...props
}) => {
  const cardClasses = clsx(
    'rounded-lg shadow-lg overflow-hidden',
    {
      'bg-white dark:bg-neutral-800': variant === 'default',
      'glassmorphism': variant === 'glass',
      'glassmorphism-darker': variant === 'glass-darker',
    },
    className
  );

  const headerBaseClasses = 'px-4 py-5 sm:px-6';
  const bodyBaseClasses = 'px-4 py-5 sm:p-6';
  const footerBaseClasses = 'px-4 py-4 sm:px-6 bg-neutral-50 dark:bg-neutral-700/50 border-t border-neutral-200 dark:border-neutral-700';

  return (
    <div className={cardClasses} {...props}>
      {(title || headerContent) && (
        <div className={clsx(headerBaseClasses, 'flex justify-between items-center border-b border-neutral-200 dark:border-neutral-700')}>
          {title && (
            typeof title === 'string' ? (
              <h3 className={clsx('text-lg font-semibold leading-6 text-neutral-900 dark:text-white font-poppins', titleClassName)}>
                {title}
              </h3>
            ) : (
              title
            )
          )}
          {headerContent}
        </div>
      )}
      <div className={clsx(bodyBaseClasses, bodyClassName)}>
        {children}
      </div>
      {footerContent && (
        <div className={clsx(footerBaseClasses, footerClassName)}>
          {footerContent}
        </div>
      )}
    </div>
  );
};

export default Card;
