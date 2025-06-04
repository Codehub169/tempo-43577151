import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  title?: string;
  titleClassName?: string;
  headerContent?: React.ReactNode; // For buttons or other elements next to the title
  className?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  title,
  titleClassName = 'text-3xl font-bold text-neutral-800 dark:text-neutral-100 font-poppins',
  headerContent,
  className = '',
}) => {
  return (
    <div className={`p-4 sm:p-6 lg:p-8 ${className}`}>
      {(title || headerContent) && (
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          {title && (
            <h1 className={titleClassName}>
              {title}
            </h1>
          )}
          {headerContent && <div className="mt-4 sm:mt-0 sm:ml-4">{headerContent}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default PageWrapper;
