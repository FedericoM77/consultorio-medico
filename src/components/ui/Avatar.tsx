import React from 'react';

interface AvatarProps {
  nombre: string;
  size?: number;
}

// Enterprise palette — maps to CSS vars but uses fixed rgba for gradient
const colorPalette = [
  { bg: 'rgba(79,142,247,0.18)', border: 'rgba(79,142,247,0.4)', color: '#4f8ef7' },
  { bg: 'rgba(52,214,105,0.15)', border: 'rgba(52,214,105,0.35)', color: '#34d669' },
  { bg: 'rgba(167,139,250,0.18)', border: 'rgba(167,139,250,0.4)', color: '#a78bfa' },
  { bg: 'rgba(245,166,35,0.15)', border: 'rgba(245,166,35,0.35)', color: '#f5a623' },
  { bg: 'rgba(245,73,90,0.15)', border: 'rgba(245,73,90,0.35)', color: '#f5495a' },
  { bg: 'rgba(20,184,166,0.15)', border: 'rgba(20,184,166,0.35)', color: '#14b8a6' },
];

function colorFromName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + hash * 31;
  return colorPalette[Math.abs(hash) % colorPalette.length];
}

export function Avatar({ nombre, size = 36 }: AvatarProps) {
  const parts = nombre.trim().split(' ');
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : nombre.slice(0, 2).toUpperCase();
  const palette = colorFromName(nombre);

  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%',
        background: palette.bg,
        border: `1.5px solid ${palette.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.33, fontWeight: 600, letterSpacing: '-0.01em',
        color: palette.color,
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {initials}
    </div>
  );
}
