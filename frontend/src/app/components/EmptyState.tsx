import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && (
        <div className="mb-4 text-[var(--wedding-text-light)]">
          {icon}
        </div>
      )}
      <h3 className="text-xl mb-2 text-[var(--wedding-text)]">
        {title}
      </h3>
      {description && (
        <p className="text-[var(--wedding-text-light)] mb-6 max-w-md">
          {description}
        </p>
      )}
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
}
