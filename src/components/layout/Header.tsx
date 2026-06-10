import React from 'react';
import { Moon, Sun, Bell } from 'lucide-react';
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
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Logo + nombre */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: 26, height: 26, borderRadius: '7px',
          background: 'var(--accent-yellow)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1.5C7 1.5 2 4 2 8a5 5 0 0010 0c0-4-5-6.5-5-6.5z" fill="var(--bg-canvas)" opacity="0.9"/>
            <rect x="6" y="5" width="2" height="4" rx="1" fill="var(--bg-canvas)"/>
            <rect x="5" y="8" width="4" height="2" rx="1" fill="var(--bg-canvas)"/>
          </svg>
        </div>
        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Centro Médico Belgrano
        </span>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'capitalize', marginRight: '4px' }}>
          {today}
        </span>

        {/* Bell */}
        <button style={iconBtnStyle}>
          <Bell size={15} />
          <span style={{
            position: 'absolute', top: '6px', right: '6px',
            width: '6px', height: '6px', borderRadius: '50%',
            background: 'var(--accent-orange)',
            border: '1.5px solid var(--bg-card)',
          }} />
        </button>

        {/* Toggle */}
        <button onClick={toggleTheme} style={iconBtnStyle} title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}>
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 4px' }} />

        {/* Doctor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '4px 8px', borderRadius: '8px', transition: 'background 150ms ease' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <Avatar nombre="María García" size={26} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>Dra. García</span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Clínica Médica</span>
          </div>
        </div>
      </div>
    </header>
  );
}

const iconBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  width: 32, height: 32,
  cursor: 'pointer',
  color: 'var(--text-secondary)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'all 150ms ease',
  position: 'relative',
};
