import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export function Button({ variant = 'secondary', size = 'md', children, style, ...props }: ButtonProps) {
  const padding = size === 'sm' ? '0 14px' : '0 18px';
  const height = size === 'sm' ? '32px' : '36px';
  const fontSize = size === 'sm' ? '12px' : '13px';

  const base: React.CSSProperties = {
    height, padding, fontSize, fontWeight: 500,
    cursor: 'pointer', fontFamily: 'inherit',
    borderRadius: '8px',
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    whiteSpace: 'nowrap',
    transition: 'all 150ms ease',
    letterSpacing: '-0.01em',
    position: 'relative',
  };

  const variants: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      background: 'var(--accent-yellow)',
      color: '#0a0a0f',
      border: 'none',
      boxShadow: '0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(212,224,0,0.3)',
      fontWeight: 600,
    },
    secondary: {
      background: 'transparent',
      color: 'var(--text-primary)',
      border: '1px solid var(--border)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--accent-blue)',
      border: 'none',
      boxShadow: 'none',
    },
    destructive: {
      background: 'var(--accent-orange-glow)',
      color: 'var(--accent-orange)',
      border: '1px solid var(--accent-orange)',
      boxShadow: 'none',
    },
  };

  const hoverStyles: Record<ButtonVariant, Partial<React.CSSProperties>> = {
    primary: { filter: 'brightness(1.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.3), 0 0 12px var(--accent-yellow-glow)' },
    secondary: { background: 'var(--bg-hover)', borderColor: 'var(--text-muted)' },
    ghost: { background: 'var(--accent-blue-glow)' },
    destructive: { background: 'rgba(240,79,44,0.15)' },
  };

  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      style={{ ...base, ...variants[variant], ...(hovered ? hoverStyles[variant] : {}), ...style }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      {children}
    </button>
  );
}
