import React, { useState } from 'react';
import {
  LayoutDashboard, Calendar, Users, FileText,
  DollarSign, ClipboardList, BarChart2, Settings,
} from 'lucide-react';
import { ModuloActivo } from '../../types';

const navItems: { id: ModuloActivo; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard',     label: 'Dashboard',       icon: <LayoutDashboard size={17} /> },
  { id: 'agenda',        label: 'Agenda',           icon: <Calendar size={17} /> },
  { id: 'pacientes',     label: 'Pacientes',        icon: <Users size={17} /> },
  { id: 'recetas',       label: 'Recetas',          icon: <FileText size={17} /> },
  { id: 'facturacion',   label: 'Facturación',      icon: <DollarSign size={17} /> },
  { id: 'historia',      label: 'Historia Clínica', icon: <ClipboardList size={17} /> },
  { id: 'estadisticas',  label: 'Estadísticas',     icon: <BarChart2 size={17} /> },
  { id: 'configuracion', label: 'Configuración',    icon: <Settings size={17} /> },
];

interface SidebarProps {
  activo: ModuloActivo;
  onChange: (m: ModuloActivo) => void;
}

export function Sidebar({ activo, onChange }: SidebarProps) {
  const [expanded, setExpanded] = useState(false);
  const w = expanded ? 220 : 56;

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{
        position: 'fixed', left: 0, top: 48, bottom: 0, zIndex: 50,
        width: w,
        background: 'var(--canvas)',
        borderRight: '1px solid var(--border)',
        transition: 'width 200ms cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: '12px 8px',
        gap: '1px',
      }}
    >
      {navItems.map(item => {
        const isActive = activo === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            title={!expanded ? item.label : undefined}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              height: '36px',
              padding: '0 10px',
              background: isActive ? 'var(--surface)' : 'transparent',
              borderTop: 'none', borderRight: 'none', borderBottom: 'none',
              borderLeft: isActive ? '2px solid var(--blue)' : '2px solid transparent',
              borderRadius: '7px',
              cursor: 'pointer',
              color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
              width: '100%', textAlign: 'left',
              whiteSpace: 'nowrap', overflow: 'hidden',
              fontFamily: 'inherit',
              transition: 'all 150ms ease',
              boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
            }}
            onMouseEnter={e => {
              if (!isActive) {
                e.currentTarget.style.background = 'var(--surface)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-muted)';
              }
            }}
          >
            <span style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, width: 20,
              color: isActive ? 'var(--blue)' : 'inherit',
            }}>
              {item.icon}
            </span>
            <span style={{
              fontSize: '13px', fontWeight: isActive ? 600 : 400,
              opacity: expanded ? 1 : 0,
              transition: 'opacity 120ms ease',
              letterSpacing: '-0.01em',
            }}>
              {item.label}
            </span>
          </button>
        );
      })}

      {/* Spacer + version */}
      <div style={{ flex: 1 }} />
      {expanded && (
        <div style={{
          padding: '8px 10px', fontSize: '10px',
          color: 'var(--text-muted)', letterSpacing: '0.03em',
        }}>
          v1.0.0 · Plan Básico
        </div>
      )}
    </aside>
  );
}
