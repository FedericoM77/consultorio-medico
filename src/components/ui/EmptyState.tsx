import React from 'react';

export function EmptyState({ title, text }: { title: string; text?: string }) {
  return (
    <div style={{
      padding: '28px',
      textAlign: 'center',
      color: 'var(--text-secondary)',
      fontSize: '13px',
      borderTop: '1px solid var(--border-subtle)',
    }}>
      <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: text ? '4px' : 0 }}>
        {title}
      </div>
      {text && (
        <div style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {text}
        </div>
      )}
    </div>
  );
}
