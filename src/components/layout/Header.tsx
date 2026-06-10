import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Avatar } from '../ui/Avatar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const today = format(new Date(), "EEEE d 'de' MMMM", { locale: es });

  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60,
        height: 48,
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px 0 16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--accent-yellow)',
        }} />
        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
          Centro Médico Belgrano
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
          {today}
        </span>

        <button
          onClick={toggleTheme}
          style={{
            background: 'var(--bg-card-deep)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            padding: '6px',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center',
            transition: 'color 150ms ease',
          }}
          title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar nombre="María García" size={28} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)' }}>Dra. García</span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Clínica Médica</span>
          </div>
        </div>
      </div>
    </header>
  );
}
