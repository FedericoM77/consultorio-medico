import React, { useState } from 'react';
import {
  LayoutDashboard, Calendar, Users, FileText,
  DollarSign, ClipboardList, BarChart2, Settings,
} from 'lucide-react';
import { ModuloActivo } from '../../types';

interface NavItem {
  id: ModuloActivo;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'dashboard',     label: 'Dashboard',       icon: <LayoutDashboard size={18} /> },
  { id: 'agenda',        label: 'Agenda',           icon: <Calendar size={18} /> },
  { id: 'pacientes',     label: 'Pacientes',        icon: <Users size={18} /> },
  { id: 'recetas',       label: 'Recetas',          icon: <FileText size={18} /> },
  { id: 'facturacion',   label: 'Facturación',      icon: <DollarSign size={18} /> },
  { id: 'historia',      label: 'Historia Clínica', icon: <ClipboardList size={18} /> },
  { id: 'estadisticas',  label: 'Estadísticas',     icon: <BarChart2 size={18} /> },
  { id: 'configuracion', label: 'Configuración',    icon: <Settings size={18} /> },
];

interface SidebarProps {
  activo: ModuloActivo;
  onChange: (m: ModuloActivo) => void;
}

export function Sidebar({ activo, onChange }: SidebarProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{
        position: 'fixed', left: 0, top: 48, bottom: 0, zIndex: 50,
        width: expanded ? 216 : 52,
        background: 'var(--bg-card)',
        borderRight: '1px solid var(--border-subtle)',
        transition: 'width 180ms cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: '8px 6px',
        gap: '2px',
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
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0 6px',
              height: '40px',
              background: isActive ? 'var(--accent-yellow-glow)' : 'transparent',
              borderTop: 'none',
              borderRight: 'none',
              borderBottom: 'none',
              borderLeft: isActive ? '2px solid var(--accent-yellow)' : '2px solid transparent',
              borderRadius: '8px',
              cursor: 'pointer',
              color: isActive ? 'var(--accent-yellow)' : 'var(--text-secondary)',
              width: '100%',
              textAlign: 'left',
              whiteSpace: 'nowrap',
              transition: 'all 150ms ease',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => {
              if (!isActive) {
                e.currentTarget.style.background = 'var(--bg-hover)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }
            }}
          >
            <span style={{
              width: 32, height: 32, borderRadius: '8px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: isActive ? 'var(--accent-yellow-glow)' : 'transparent',
              transition: 'background 150ms ease',
            }}>
              {item.icon}
            </span>
            {expanded && (
              <span style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '-0.01em' }}>
                {item.label}
              </span>
            )}
          </button>
        );
      })}
    </aside>
  );
}
