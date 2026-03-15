import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'gold' | 'success' | 'warning';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-[var(--wedding-beige)] text-[var(--wedding-text)]',
    gold: 'bg-[var(--wedding-gold-light)] text-[var(--wedding-text)]',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-xs
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
