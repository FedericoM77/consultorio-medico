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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
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

  const icon = toast.type === 'success'
    ? <CheckCircle size={16} style={{ color: 'var(--accent-green)' }} />
    : toast.type === 'error'
    ? <XCircle size={16} style={{ color: 'var(--accent-orange)' }} />
    : <Info size={16} style={{ color: 'var(--accent-blue)' }} />;

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        color: 'var(--text-primary)',
        borderRadius: '8px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        minWidth: '280px',
        maxWidth: '360px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        animation: 'fadeIn 150ms ease',
      }}
    >
      {icon}
      <span style={{ fontSize: '13px', fontWeight: 500 }}>{toast.message}</span>
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
