import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ variant = 'secondary', size = 'md', children, style, ...props }: ButtonProps) {
  const heights: Record<typeof size, string> = { sm: '30px', md: '34px', lg: '40px' };
  const pads:    Record<typeof size, string> = { sm: '0 12px', md: '0 16px', lg: '0 20px' };
  const sizes:   Record<typeof size, string> = { sm: '12px', md: '13px', lg: '14px' };

  const base: React.CSSProperties = {
    height: heights[size], padding: pads[size],
    fontSize: sizes[size], fontWeight: 500, letterSpacing: '-0.01em',
    cursor: 'pointer', fontFamily: 'inherit', borderRadius: '7px',
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    whiteSpace: 'nowrap', transition: 'all 140ms ease',
    outline: 'none',
  };

  const variants: Record<Variant, React.CSSProperties> = {
    primary: {
      background: 'var(--blue)',
      color: '#fff',
      border: '1px solid transparent',
      fontWeight: 600,
      boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
    },
    secondary: {
      background: 'var(--surface)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--blue)',
      border: '1px solid var(--blue-border)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid transparent',
    },
    destructive: {
      background: 'var(--red-bg)',
      color: 'var(--red)',
      border: '1px solid var(--red-border)',
    },
  };

  const hovers: Record<Variant, React.CSSProperties> = {
    primary:     { filter: 'brightness(1.1)' },
    secondary:   { background: 'var(--surface-raised)', borderColor: 'var(--text-muted)' },
    outline:     { background: 'var(--blue-bg)' },
    ghost:       { background: 'var(--surface-raised)', color: 'var(--text-primary)' },
    destructive: { filter: 'brightness(1.05)' },
  };

  const [hov, setHov] = React.useState(false);

  return (
    <button
      style={{ ...base, ...variants[variant], ...(hov ? hovers[variant] : {}), ...style }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      {...props}
    >
      {children}
    </button>
  );
}
