import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Drawer({ open, onClose, title, children }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <>
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 90,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 200ms ease',
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 91,
          width: '400px',
          background: 'var(--surface)',
          borderLeft: '1px solid var(--border)',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.4)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 220ms cubic-bezier(0.4,0,0.2,1)',
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px',
          borderBottom: '1px solid var(--border)',
          position: 'sticky', top: 0,
          background: 'var(--surface-raised)',
          zIndex: 1,
          boxShadow: '0 1px 0 var(--border)',
        }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: 'var(--surface-overlay)', border: '1px solid var(--border)',
              cursor: 'pointer', color: 'var(--text-secondary)',
              padding: '5px', borderRadius: '7px',
              display: 'flex', alignItems: 'center',
              transition: 'all 120ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <X size={16} />
          </button>
        </div>
        <div style={{ padding: '24px', flex: 1 }}>
          {children}
        </div>
      </div>
    </>
  );
}
