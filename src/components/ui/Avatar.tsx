import React from 'react';

interface AvatarProps {
  nombre: string;
  size?: number;
}

const colors = [
  '#5683d2', '#00d638', '#e4f222', '#ff492c', '#9b59b6',
  '#e67e22', '#1abc9c', '#e74c3c',
];

function colorFromName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + hash * 31;
  return colors[Math.abs(hash) % colors.length];
}

export function Avatar({ nombre, size = 36 }: AvatarProps) {
  const parts = nombre.trim().split(' ');
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : nombre.slice(0, 2).toUpperCase();
  const bg = colorFromName(nombre);

  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%',
        background: bg + '33',
        border: `1px solid ${bg}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.35, fontWeight: 500,
        color: bg,
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {initials}
    </div>
  );
}
