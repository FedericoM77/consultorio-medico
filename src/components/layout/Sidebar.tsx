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
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'agenda', label: 'Agenda', icon: <Calendar size={20} /> },
  { id: 'pacientes', label: 'Pacientes', icon: <Users size={20} /> },
  { id: 'recetas', label: 'Recetas', icon: <FileText size={20} /> },
  { id: 'facturacion', label: 'Facturación', icon: <DollarSign size={20} /> },
  { id: 'historia', label: 'Historia Clínica', icon: <ClipboardList size={20} /> },
  { id: 'estadisticas', label: 'Estadísticas', icon: <BarChart2 size={20} /> },
  { id: 'configuracion', label: 'Configuración', icon: <Settings size={20} /> },
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
        width: expanded ? 220 : 52,
        background: 'var(--bg-card)',
        borderRight: '1px solid var(--border-subtle)',
        transition: 'width 150ms ease',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        paddingTop: '8px',
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
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 16px',
              background: isActive ? 'rgba(228,242,34,0.1)' : 'transparent',
              borderTop: 'none',
              borderRight: 'none',
              borderBottom: 'none',
              borderLeft: isActive ? '2px solid var(--accent-yellow)' : '2px solid transparent',
              borderRadius: '4px',
              margin: '1px 4px',
              cursor: 'pointer',
              color: isActive ? 'var(--accent-yellow)' : 'var(--text-secondary)',
              width: 'calc(100% - 8px)',
              textAlign: 'left',
              whiteSpace: 'nowrap',
              transition: 'color 150ms ease, background 150ms ease',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => {
              if (!isActive) {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.background = 'var(--border-subtle)';
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <span style={{ flexShrink: 0, display: 'flex' }}>{item.icon}</span>
            {expanded && (
              <span style={{ fontSize: '13px', fontWeight: 500 }}>{item.label}</span>
            )}
          </button>
        );
      })}
    </aside>
  );
}
