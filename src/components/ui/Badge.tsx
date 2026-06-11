import React from 'react';

type BadgeVariant = 'confirmado' | 'en-consultorio' | 'pendiente' | 'cancelado' | 'atendido' | 'vigente' | 'vencida' | 'cobrado' | 'a-facturar';

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  confirmado:        { background: 'var(--green-bg)',  color: 'var(--green)',  border: '1px solid var(--green-border)' },
  'en-consultorio':  { background: 'var(--blue-bg)',   color: 'var(--blue)',   border: '1px solid var(--blue-border)' },
  pendiente:         { background: 'var(--amber-bg)',  color: 'var(--amber)',  border: '1px solid var(--amber-border)' },
  cancelado:         { background: 'var(--red-bg)',    color: 'var(--red)',    border: '1px solid var(--red-border)' },
  atendido:          { background: 'var(--surface-raised)', color: 'var(--text-secondary)', border: '1px solid var(--border)' },
  vigente:           { background: 'var(--green-bg)',  color: 'var(--green)',  border: '1px solid var(--green-border)' },
  vencida:           { background: 'var(--red-bg)',    color: 'var(--red)',    border: '1px solid var(--red-border)' },
  cobrado:           { background: 'var(--green-bg)',  color: 'var(--green)',  border: '1px solid var(--green-border)' },
  'a-facturar':      { background: 'var(--purple-bg)', color: 'var(--purple)', border: '1px solid var(--purple-border)' },
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
      padding: '3px 9px',
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '0.02em',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%',
        background: 'currentColor', flexShrink: 0,
      }} />
      {label ?? labels[variant]}
    </span>
  );
}
