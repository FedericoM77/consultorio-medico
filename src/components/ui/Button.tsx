import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: 'var(--accent-yellow)',
    color: 'var(--bg-canvas)',
    border: 'none',
  },
  secondary: {
    background: 'transparent',
    color: 'var(--text-primary)',
    border: '1px solid var(--border)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--accent-blue)',
    border: 'none',
  },
  destructive: {
    background: 'transparent',
    color: 'var(--accent-orange)',
    border: '1px solid var(--accent-orange)',
  },
};

export function Button({ variant = 'secondary', size = 'md', children, style, ...props }: ButtonProps) {
  const padding = size === 'sm' ? '6px 14px' : '10px 20px';
  const fontSize = size === 'sm' ? '12px' : '13px';

  return (
    <button
      style={{
        ...variantStyles[variant],
        borderRadius: '4px',
        padding,
        fontSize,
        fontWeight: 500,
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'opacity 150ms ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        whiteSpace: 'nowrap',
        ...style,
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      {...props}
    >
      {children}
    </button>
  );
}
