import React from 'react';

interface SectionCardProps {
  title: string;
  description?: string;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  description,
  toolbar,
  children,
  footer,
  className = '',
}) => (
  <section
    className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col space-y-4 ${className}`}
  >
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-gray-500 max-w-3xl">{description}</p>
        )}
      </div>
      {toolbar && <div className="flex items-center space-x-2">{toolbar}</div>}
    </header>
    <div className="flex-1 space-y-4">{children}</div>
    {footer && <footer className="pt-4 border-t border-gray-100">{footer}</footer>}
  </section>
);
