import React, { useState } from 'react';
import { DollarSign, TrendingUp, Users, BarChart2 } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { cobros as cobrosIniciales, pacientes } from '../data/mockData';
import { Cobro } from '../types';
import { Badge } from '../components/ui/Badge';
import { useToast, Toast } from '../components/ui/Toast';

const lineData = [
  { dia: '12/5', monto: 28000 },
  { dia: '13/5', monto: 42000 },
  { dia: '14/5', monto: 35000 },
  { dia: '15/5', monto: 56000 },
  { dia: '16/5', monto: 48000 },
  { dia: '19/5', monto: 62000 },
  { dia: '20/5', monto: 45000 },
  { dia: '21/5', monto: 38000 },
  { dia: '22/5', monto: 71000 },
  { dia: '23/5', monto: 58000 },
  { dia: '26/5', monto: 43000 },
  { dia: '27/5', monto: 52000 },
  { dia: '28/5', monto: 67000 },
  { dia: '29/5', monto: 48000 },
  { dia: '30/5', monto: 55000 },
  { dia: '2/6', monto: 60000 },
  { dia: '3/6', monto: 74000 },
  { dia: '4/6', monto: 68000 },
  { dia: '5/6', monto: 82000 },
  { dia: '6/6', monto: 51000 },
  { dia: '9/6', monto: 76000 },
  { dia: '10/6', monto: 88000 },
];

const pieData = [
  { name: 'OSDE', value: 35 },
  { name: 'Swiss Medical', value: 22 },
  { name: 'Galeno', value: 18 },
  { name: 'IOMA', value: 12 },
  { name: 'PAMI', value: 8 },
  { name: 'Particular', value: 5 },
];

const pieColors = ['#4f83f8', '#3fb950', '#a371f7', '#8b949e', '#f85149', '#d29922'];

const liquidaciones = [
  { os: 'OSDE', consultas: 8, monto: 112000, estado: 'Presentada' },
  { os: 'Swiss Medical', consultas: 5, monto: 75000, estado: 'Cobrada' },
  { os: 'Galeno', consultas: 4, monto: 50000, estado: 'Pendiente' },
  { os: 'IOMA', consultas: 3, monto: 33000, estado: 'Presentada' },
  { os: 'PAMI', consultas: 4, monto: 34000, estado: 'Cobrada' },
];

const liquidEstado = (e: string): React.CSSProperties => ({
  fontSize: '11px', borderRadius: '5px', padding: '3px 8px', display: 'inline-block',
  background: e === 'Cobrada' ? 'var(--green-bg)' : e === 'Presentada' ? 'var(--blue-bg)' : 'var(--amber-bg)',
  color: e === 'Cobrada' ? 'var(--green)' : e === 'Presentada' ? 'var(--blue)' : 'var(--amber)',
  border: `1px solid ${e === 'Cobrada' ? 'var(--green-border)' : e === 'Presentada' ? 'var(--blue-border)' : 'var(--amber-border)'}`,
});

type FiltroEstado = 'todos' | 'cobrado' | 'pendiente' | 'a-facturar';

export function Facturacion() {
  const [cobros, setCobros] = useState<Cobro[]>(cobrosIniciales);
  const [filtro, setFiltro] = useState<FiltroEstado>('todos');
  const { toasts, addToast, removeToast } = useToast();

  const totalMes = cobros.filter(c => c.estado === 'cobrado').reduce((s, c) => s + c.monto, 0);
  const pendiente = cobros.filter(c => c.estado === 'pendiente').reduce((s, c) => s + c.monto, 0);
  const totalConsultas = cobros.length;
  const ticketProm = Math.round(totalMes / cobros.filter(c => c.estado === 'cobrado').length);

  const filtrados = filtro === 'todos' ? cobros : cobros.filter(c => c.estado === filtro);

  function marcarCobrado(id: string) {
    setCobros(prev => prev.map(c => c.id === id ? { ...c, estado: 'cobrado' as const } : c));
    addToast('Cobro registrado', 'success');
  }

  const getPaciente = (id: string) => pacientes.find(p => p.id === id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Métricas header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        <MetricCard icon={<DollarSign size={15} />} label="Total cobrado mes" value={`$${totalMes.toLocaleString('es-AR')}`} color="var(--green)" bg="var(--green-bg)" />
        <MetricCard icon={<TrendingUp size={15} />} label="Pendiente de cobro" value={`$${pendiente.toLocaleString('es-AR')}`} color="var(--amber)" bg="var(--amber-bg)" />
        <MetricCard icon={<Users size={15} />} label="Consultas" value={String(totalConsultas)} color="var(--blue)" bg="var(--blue-bg)" />
        <MetricCard icon={<BarChart2 size={15} />} label="Ticket promedio" value={`$${ticketProm.toLocaleString('es-AR')}`} color="var(--purple)" bg="var(--purple-bg)" />
      </div>

      {/* Gráficos */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '14px' }}>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '10px', padding: '20px', boxShadow: 'var(--shadow-sm)',
        }}>
          <h3 style={sectionTitle}>Ingresos — últimos 30 días</h3>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={lineData} margin={{ left: -20, right: 8, top: 4, bottom: 0 }}>
              <XAxis dataKey="dia" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', boxShadow: 'var(--shadow-md)' }}
                formatter={(v: number) => [`$${v.toLocaleString('es-AR')}`, 'Ingresos']}
              />
              <Line type="monotone" dataKey="monto" stroke="var(--blue)" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '10px', padding: '20px', boxShadow: 'var(--shadow-sm)',
        }}>
          <h3 style={sectionTitle}>Por obra social</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={60} dataKey="value" stroke="none" isAnimationActive={false}>
                {pieData.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
              </Pie>
              <Legend iconSize={8} wrapperStyle={{ fontSize: '11px', color: 'var(--text-secondary)' }} />
              <Tooltip
                contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla movimientos */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '10px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--surface-raised)' }}>
          <h3 style={{ ...sectionTitle, flex: 1 }}>Movimientos</h3>
          {(['todos', 'cobrado', 'pendiente', 'a-facturar'] as FiltroEstado[]).map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              style={{
                padding: '4px 12px', fontSize: '12px', borderRadius: '6px',
                border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'inherit',
                background: filtro === f ? 'var(--blue)' : 'transparent',
                color: filtro === f ? '#fff' : 'var(--text-secondary)',
              }}
            >
              {f === 'todos' ? 'Todos' : f === 'cobrado' ? 'Cobrado' : f === 'pendiente' ? 'Pendiente' : 'A facturar'}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 140px 100px 100px 80px', padding: '8px 20px', borderBottom: '1px solid var(--border)' }}>
          {['Fecha', 'Paciente', 'Obra social', 'Monto', 'Estado', ''].map(h => (
            <span key={h} style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
          ))}
        </div>

        {filtrados.map(c => {
          const p = getPaciente(c.pacienteId);
          return (
            <div
              key={c.id}
              style={{
                display: 'grid', gridTemplateColumns: '100px 1fr 140px 100px 100px 80px',
                padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)', alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{c.fecha}</span>
              <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{p?.nombre} {p?.apellido}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{c.obraSocial}</span>
              <span style={{ fontSize: '13px', fontWeight: 500, fontVariantNumeric: 'tabular-nums', color: 'var(--text-primary)' }}>
                ${c.monto.toLocaleString('es-AR')}
              </span>
              <Badge variant={c.estado} />
              {c.estado === 'pendiente' && (
                <button
                  onClick={() => marcarCobrado(c.id)}
                  style={{
                    background: 'var(--blue)', color: '#fff',
                    border: 'none', borderRadius: '6px', padding: '5px 10px',
                    fontSize: '11px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Cobrar
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Liquidaciones */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '10px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', background: 'var(--surface-raised)' }}>
          <h3 style={sectionTitle}>Liquidaciones obras sociales — Junio 2026</h3>
        </div>
        {liquidaciones.map(l => (
          <div
            key={l.os}
            style={{
              display: 'grid', gridTemplateColumns: '1fr 80px 120px 120px',
              padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)', alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{l.os}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{l.consultas} consultas</span>
            <span style={{ fontSize: '13px', fontWeight: 500, fontVariantNumeric: 'tabular-nums', color: 'var(--text-primary)' }}>
              ${l.monto.toLocaleString('es-AR')}
            </span>
            <span style={liquidEstado(l.estado)}>{l.estado}</span>
          </div>
        ))}
      </div>

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

function MetricCard({ icon, label, value, color, bg }: { icon: React.ReactNode; label: string; value: string; color: string; bg: string }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: '10px', padding: '18px 20px', boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <div style={{
          width: 30, height: 30, borderRadius: '7px',
          background: bg, color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </div>
        <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      </div>
      <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>{value}</div>
    </div>
  );
}

const sectionTitle: React.CSSProperties = {
  margin: '0 0 14px',
  fontSize: '11px', fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase', letterSpacing: '0.06em',
};
