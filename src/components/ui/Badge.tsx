import React from 'react';

type BadgeVariant = 'confirmado' | 'en-consultorio' | 'pendiente' | 'cancelado' | 'atendido' | 'vigente' | 'vencida' | 'cobrado' | 'a-facturar';

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  confirmado: { background: 'rgba(0,214,56,0.15)', color: 'var(--accent-green)' },
  'en-consultorio': { background: 'rgba(228,242,34,0.15)', color: 'var(--accent-yellow)' },
  pendiente: { background: 'rgba(86,131,210,0.15)', color: 'var(--accent-blue)' },
  cancelado: { background: 'rgba(255,73,44,0.15)', color: 'var(--accent-orange)' },
  atendido: { background: 'rgba(153,155,163,0.15)', color: 'var(--text-secondary)' },
  vigente: { background: 'rgba(0,214,56,0.15)', color: 'var(--accent-green)' },
  vencida: { background: 'rgba(255,73,44,0.15)', color: 'var(--accent-orange)' },
  cobrado: { background: 'rgba(0,214,56,0.15)', color: 'var(--accent-green)' },
  'a-facturar': { background: 'rgba(86,131,210,0.15)', color: 'var(--accent-blue)' },
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
    <span
      style={{
        ...variantStyles[variant],
        borderRadius: '999px',
        padding: '3px 10px',
        fontSize: '11px',
        fontWeight: 500,
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }}
    >
      {label ?? labels[variant]}
    </span>
  );
}
