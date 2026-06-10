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
      {open && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(0,0,0,0.4)' }}
          onClick={onClose}
        />
      )}
      <div
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 91,
          width: '380px',
          background: 'var(--bg-card)',
          borderLeft: '1px solid var(--border)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 200ms ease',
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'sticky', top: 0,
          background: 'var(--bg-card)',
          zIndex: 1,
        }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-secondary)', padding: '4px', borderRadius: '4px',
              display: 'flex', alignItems: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: '24px', flex: 1 }}>
          {children}
        </div>
      </div>
    </>
  );
}
