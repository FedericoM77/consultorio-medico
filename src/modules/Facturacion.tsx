import React, { useState } from 'react';
import { DollarSign, TrendingUp, Users, BarChart2 } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useClinicData } from '../context/ClinicDataContext';
import { Cobro } from '../types';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast, Toast } from '../components/ui/Toast';

const pieColors = ['#4f83f8', '#3fb950', '#a371f7', '#8b949e', '#f85149', '#d29922'];

const liquidEstado = (e: string): React.CSSProperties => ({
  fontSize: '11px', borderRadius: '5px', padding: '3px 8px', display: 'inline-block',
  background: e === 'Cobrada' ? 'var(--green-bg)' : e === 'Presentada' ? 'var(--blue-bg)' : 'var(--amber-bg)',
  color: e === 'Cobrada' ? 'var(--green)' : e === 'Presentada' ? 'var(--blue)' : 'var(--amber)',
  border: `1px solid ${e === 'Cobrada' ? 'var(--green-border)' : e === 'Presentada' ? 'var(--blue-border)' : 'var(--amber-border)'}`,
});

type FiltroEstado = 'todos' | 'cobrado' | 'pendiente' | 'a-facturar';

export function Facturacion() {
  const { cobros: cobrosIniciales, pacientes } = useClinicData();
  const [cobros, setCobros] = useState<Cobro[]>(cobrosIniciales);
  const [filtro, setFiltro] = useState<FiltroEstado>('todos');
  const { toasts, addToast, removeToast } = useToast();

  const totalMes = cobros.filter(c => c.estado === 'cobrado').reduce((s, c) => s + c.monto, 0);
  const pendiente = cobros.filter(c => c.estado === 'pendiente').reduce((s, c) => s + c.monto, 0);
  const totalConsultas = cobros.length;
  const cobradosCount = cobros.filter(c => c.estado === 'cobrado').length;
  const ticketProm = cobradosCount ? Math.round(totalMes / cobradosCount) : 0;

  const filtrados = filtro === 'todos' ? cobros : cobros.filter(c => c.estado === filtro);
  const lineData = Object.values(cobros.reduce<Record<string, { dia: string; monto: number }>>((acc, cobro) => {
    const [, month, day] = cobro.fecha.split('-');
    const label = `${Number(day)}/${Number(month)}`;
    acc[label] = acc[label] || { dia: label, monto: 0 };
    acc[label].monto += cobro.monto;
    return acc;
  }, {}));
  const pieData = Object.values(cobros.reduce<Record<string, { name: string; value: number }>>((acc, cobro) => {
    acc[cobro.obraSocial] = acc[cobro.obraSocial] || { name: cobro.obraSocial, value: 0 };
    acc[cobro.obraSocial].value += 1;
    return acc;
  }, {}));
  const liquidaciones = Object.values(cobros.reduce<Record<string, { os: string; consultas: number; monto: number; estado: string }>>((acc, cobro) => {
    acc[cobro.obraSocial] = acc[cobro.obraSocial] || { os: cobro.obraSocial, consultas: 0, monto: 0, estado: 'Pendiente' };
    acc[cobro.obraSocial].consultas += 1;
    acc[cobro.obraSocial].monto += cobro.monto;
    acc[cobro.obraSocial].estado = cobro.estado === 'cobrado' ? 'Cobrada' : cobro.estado === 'a-facturar' ? 'Presentada' : 'Pendiente';
    return acc;
  }, {}));

  function marcarCobrado(id: string) {
    setCobros(prev => prev.map(c => c.id === id ? { ...c, estado: 'cobrado' as const } : c));
    addToast('Cobro registrado', 'success');
  }

  const getPaciente = (id: string) => pacientes.find(p => p.id === id);

  return (
    <div className="module-stack" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Métricas header */}
      <div className="responsive-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        <MetricCard icon={<DollarSign size={15} style={{ color: 'var(--green)' }} />} label="Total cobrado mes" value={`$${totalMes.toLocaleString('es-AR')}`} iconClass="icon-g" glowClass="glow-g" />
        <MetricCard icon={<TrendingUp size={15} style={{ color: 'var(--amber)' }} />} label="Pendiente de cobro" value={`$${pendiente.toLocaleString('es-AR')}`} iconClass="icon-a" glowClass="glow-a" />
        <MetricCard icon={<Users size={15} style={{ color: 'var(--blue)' }} />} label="Consultas" value={String(totalConsultas)} iconClass="icon-b" glowClass="glow-b" />
        <MetricCard icon={<BarChart2 size={15} style={{ color: 'var(--purple)' }} />} label="Ticket promedio" value={`$${ticketProm.toLocaleString('es-AR')}`} iconClass="icon-p" glowClass="glow-p" />
      </div>

      {/* Gráficos */}
      <div className="responsive-split" style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '14px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={sectionTitle}>Ingresos — últimos 30 días</h3>
          {lineData.length > 0 ? (
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
          ) : (
            <EmptyState title="Sin ingresos" text="Todavía no hay cobros para graficar." />
          )}
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <h3 style={sectionTitle}>Por obra social</h3>
          {pieData.length > 0 ? (
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
          ) : (
            <EmptyState title="Sin obras sociales" text="La distribución se va a generar con los cobros." />
          )}
        </div>
      </div>

      {/* Tabla movimientos */}
      <div className="card table-card" style={{ overflow: 'hidden' }}>
        <div className="responsive-toolbar" style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--surface-raised)', flexWrap: 'wrap' }}>
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

        <div className="table-scroll">
        <div className="billing-grid" style={{ display: 'grid', gridTemplateColumns: '100px 1fr 140px 100px 100px 80px', padding: '8px 20px', borderBottom: '1px solid var(--border)' }}>
          {['Fecha', 'Paciente', 'Obra social', 'Monto', 'Estado', ''].map(h => (
            <span key={h} style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
          ))}
        </div>

        {filtrados.map(c => {
          const p = getPaciente(c.pacienteId);
          return (
            <div
              key={c.id}
              className="row-hover billing-grid"
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
        {filtrados.length === 0 && (
          <EmptyState title="Sin movimientos" text="Este consultorio no tiene cobros cargados." />
        )}
        </div>
      </div>

      {/* Liquidaciones */}
      <div className="card table-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', background: 'var(--surface-raised)' }}>
          <h3 style={sectionTitle}>Liquidaciones obras sociales — Junio 2026</h3>
        </div>
        <div className="table-scroll">
        {liquidaciones.map(l => (
          <div
            key={l.os}
            className="liquidaciones-grid"
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
        {liquidaciones.length === 0 && (
          <EmptyState title="Sin liquidaciones" text="No hay obras sociales para liquidar todavía." />
        )}
        </div>
      </div>

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

function MetricCard({ icon, label, value, iconClass, glowClass }: { icon: React.ReactNode; label: string; value: string; iconClass: string; glowClass: string }) {
  return (
    <div className={`card ${glowClass}`} style={{ padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <div className={iconClass} style={{
          width: 34, height: 34, borderRadius: '9px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </div>
        <span className="section-label">{label}</span>
      </div>
      <div className="num-display" style={{ fontSize: '26px' }}>{value}</div>
    </div>
  );
}

const sectionTitle: React.CSSProperties = {
  margin: '0 0 14px',
  fontSize: '11px', fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase', letterSpacing: '0.06em',
};
