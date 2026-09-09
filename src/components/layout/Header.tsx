import React from 'react';
import { LogOut, Moon, Sun, Bell, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useClinicData } from '../../context/ClinicDataContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { AuthSession } from '../../modules/Auth';

interface HeaderProps {
  session: AuthSession;
  onLogout: () => void;
}

export function Header({ session, onLogout }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { logoUrl } = useClinicData();
  const today = format(new Date(), "d MMM yyyy", { locale: es });

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60,
      height: 48,
      background: theme === 'dark' ? 'rgba(8,12,20,0.85)' : 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px',
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: 28, height: 28, borderRadius: '8px',
          background: logoUrl ? 'var(--surface-raised)' : 'var(--blue)',
          border: logoUrl ? '1px solid var(--border)' : 'none',
          padding: logoUrl ? 2 : 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          overflow: 'hidden',
        }}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`Logo ${session.consultorio}`}
              style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '6px' }}
            />
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2.5C5 2.5 3 5 3 7.5c0 3 2.5 5 5 5s5-2 5-5C13 5 11 2.5 8 2.5z" fill="white" opacity="0.9"/>
              <rect x="7" y="5" width="2" height="5" rx="1" fill="white"/>
              <rect x="5.5" y="9" width="5" height="2" rx="1" fill="white"/>
            </svg>
          )}
        </div>
        <div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {session.consultorio}
          </span>
        </div>
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginRight: '8px', textTransform: 'capitalize' }}>
          {today}
        </span>

        <IconBtn onClick={toggleTheme} title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}>
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </IconBtn>

        <IconBtn style={{ position: 'relative' }}>
          <Bell size={15} />
          <span style={{
            position: 'absolute', top: 7, right: 7,
            width: 5, height: 5, borderRadius: '50%',
            background: 'var(--red)',
            border: '1.5px solid var(--surface)',
          }} />
        </IconBtn>

        <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 4px' }} />

        {/* User */}
        <button style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          padding: '4px 8px', borderRadius: '7px', fontFamily: 'inherit',
          transition: 'background 150ms ease',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-raised)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <div style={{
            width: 26, height: 26, borderRadius: '6px',
            background: 'var(--blue-bg)',
            border: '1px solid var(--blue-border)',
            color: 'var(--blue)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.02em',
          }}>
            {session.iniciales}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{session.medico}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{session.especialidad}</div>
          </div>
          <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
        </button>

        <IconBtn onClick={onLogout} title="Cerrar sesión">
          <LogOut size={15} />
        </IconBtn>
      </div>
    </header>
  );
}

function IconBtn({ children, style, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      style={{
        background: 'transparent',
        border: '1px solid var(--border)',
        borderRadius: '7px',
        width: 32, height: 32,
        cursor: 'pointer',
        color: 'var(--text-secondary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 150ms ease',
        flexShrink: 0,
        position: 'relative',
        ...style,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--surface-raised)';
        e.currentTarget.style.borderColor = 'var(--text-muted)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
      {...props}
    >
      {children}
    </button>
  );
}
