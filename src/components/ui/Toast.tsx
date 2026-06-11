import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

export interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastProps {
  toasts: ToastData[];
  onRemove: (id: string) => void;
}

export function Toast({ toasts, onRemove }: ToastProps) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 200,
      display: 'flex', flexDirection: 'column', gap: '8px',
      pointerEvents: 'none',
    }}>
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: ToastData; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const iconColor = toast.type === 'success' ? 'var(--green)' : toast.type === 'error' ? 'var(--red)' : 'var(--blue)';
  const icon = toast.type === 'success'
    ? <CheckCircle size={15} />
    : toast.type === 'error'
    ? <XCircle size={15} />
    : <Info size={15} />;

  return (
    <div
      className="anim-toast"
      style={{
        background: 'var(--surface-raised)',
        border: '1px solid var(--border)',
        color: 'var(--text-primary)',
        borderRadius: '10px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        minWidth: '280px',
        maxWidth: '360px',
        boxShadow: 'var(--shadow-lg)',
        pointerEvents: 'auto',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <span style={{ color: iconColor, flexShrink: 0, display: 'flex' }}>{icon}</span>
      <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', flex: 1 }}>{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', padding: '0', flexShrink: 0,
          display: 'flex', alignItems: 'center',
          fontSize: '14px', lineHeight: 1,
        }}
      >✕</button>
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  const addToast = React.useCallback((message: string, type: ToastData['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}
