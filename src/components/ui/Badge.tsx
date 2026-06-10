import React from 'react';

type BadgeVariant = 'confirmado' | 'en-consultorio' | 'pendiente' | 'cancelado' | 'atendido' | 'vigente' | 'vencida' | 'cobrado' | 'a-facturar';

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  confirmado:       { background: 'var(--accent-green-glow)',  color: 'var(--accent-green)',  border: '1px solid rgba(0,200,83,0.25)' },
  'en-consultorio': { background: 'var(--accent-yellow-glow)', color: 'var(--accent-yellow)', border: '1px solid rgba(212,224,0,0.25)' },
  pendiente:        { background: 'var(--accent-blue-glow)',   color: 'var(--accent-blue)',   border: '1px solid rgba(79,126,240,0.25)' },
  cancelado:        { background: 'var(--accent-orange-glow)', color: 'var(--accent-orange)', border: '1px solid rgba(240,79,44,0.25)' },
  atendido:         { background: 'rgba(122,122,140,0.12)',    color: 'var(--text-secondary)', border: '1px solid rgba(122,122,140,0.2)' },
  vigente:          { background: 'var(--accent-green-glow)',  color: 'var(--accent-green)',  border: '1px solid rgba(0,200,83,0.25)' },
  vencida:          { background: 'var(--accent-orange-glow)', color: 'var(--accent-orange)', border: '1px solid rgba(240,79,44,0.25)' },
  cobrado:          { background: 'var(--accent-green-glow)',  color: 'var(--accent-green)',  border: '1px solid rgba(0,200,83,0.25)' },
  'a-facturar':     { background: 'var(--accent-blue-glow)',   color: 'var(--accent-blue)',   border: '1px solid rgba(79,126,240,0.25)' },
};

const labels: Record<BadgeVariant, string> = {
  confirmado: 'Confirmado',
  'en-consultorio': 'En consultorio',
  pendiente: 'Pendiente',
  cancelado: 'Cancelado',
  atendido: 'Atendido',
  vigente: 'Vigente',
  vencida: 'Vencida',
  cobrado: 'Cobrado',
  'a-facturar': 'A facturar',
};

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
}

export function Badge({ variant, label }: BadgeProps) {
  return (
    <span style={{
      ...variantStyles[variant],
      borderRadius: '6px',
      padding: '3px 8px',
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '0.01em',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%',
        background: 'currentColor', opacity: 0.8, flexShrink: 0,
      }} />
      {label ?? labels[variant]}
    </span>
  );
}
