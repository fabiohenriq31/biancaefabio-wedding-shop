import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[var(--wedding-text)] text-white hover:opacity-90',
    secondary: 'bg-[var(--wedding-nude)] text-[var(--wedding-text)] hover:bg-[var(--wedding-beige)]',
    ghost: 'bg-transparent text-[var(--wedding-text)] hover:bg-[var(--wedding-beige)]',
    outline: 'bg-transparent border border-[var(--wedding-text)] text-[var(--wedding-text)] hover:bg-[var(--wedding-beige)]'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
