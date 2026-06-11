import React, { useState } from 'react';
import { Calendar, DollarSign, Users, Clock, MessageCircle, AlertCircle, FileText, ArrowUpRight, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { pacientes, turnos, cobros } from '../data/mockData';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Drawer } from '../components/ui/Drawer';
import { Button } from '../components/ui/Button';
import { Turno } from '../types';

const barData = [
  { dia: 'Lun', turnos: 8 },
  { dia: 'Mar', turnos: 11 },
  { dia: 'Mié', turnos: 9 },
  { dia: 'Jue', turnos: 10 },
  { dia: 'Vie', turnos: 7 },
];

const turnosHoy = turnos.filter(t => t.fecha === '2026-06-11');
const cobrosHoy = cobros.filter(c => c.fecha === '2026-06-11');
const totalCobradoHoy = cobrosHoy.filter(c => c.estado === 'cobrado').reduce((s, c) => s + c.monto, 0);
const pendientesHoy = cobrosHoy.filter(c => c.estado === 'pendiente').length;
const confirmados = turnosHoy.filter(t => t.estado === 'confirmado').length;
const pendientesTurno = turnosHoy.filter(t => t.estado === 'pendiente').length;

const statusBorderColor: Record<string, string> = {
  confirmado: 'var(--green)',
  'en-consultorio': 'var(--blue)',
  pendiente: 'var(--amber)',
  cancelado: 'var(--red)',
  atendido: 'var(--text-muted)',
};

export function Dashboard() {
  const [drawerTurno, setDrawerTurno] = useState<Turno | null>(null);
  const getPaciente = (id: string) => pacientes.find(p => p.id === id);
  const drawerPaciente = drawerTurno ? getPaciente(drawerTurno.pacienteId) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        <MetricCard
          icon={<Calendar size={15} />}
          label="Turnos hoy"
          value={String(turnosHoy.length)}
          sub={`${confirmados} confirmados · ${pendientesTurno} pendientes`}
          color="var(--blue)"
          colorBg="var(--blue-bg)"
          trend="+2 vs ayer"
        />
        <MetricCard
          icon={<DollarSign size={15} />}
          label="Cobrado hoy"
          value={`$${totalCobradoHoy.toLocaleString('es-AR')}`}
          sub={`${pendientesHoy} pendientes de cobro`}
          color="var(--green)"
          colorBg="var(--green-bg)"
          trend="+12% vs sem."
        />
        <MetricCard
          icon={<Users size={15} />}
          label="Nuevos este mes"
          value="18"
          sub="pacientes nuevos"
          color="var(--purple)"
          colorBg="var(--purple-bg)"
          trend="+6 vs mes ant."
        />
        <MetricCard
          icon={<Clock size={15} />}
          label="Próximo turno"
          value="10:30"
          sub="Juan Ramírez · en 12 min"
          color="var(--amber)"
          colorBg="var(--amber-bg)"
        />
      </div>

      {/* Content row */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '14px' }}>

        {/* Agenda del día */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Agenda del día
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Miércoles 11 de junio</span>
            </div>
            <span style={{
              fontSize: '11px', fontWeight: 600, color: 'var(--blue)',
              background: 'var(--blue-bg)',
              border: '1px solid var(--blue-border)',
              borderRadius: '6px', padding: '3px 10px',
            }}>
              {turnosHoy.length} turnos
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {turnosHoy.map(turno => {
              const p = getPaciente(turno.pacienteId);
              if (!p) return null;
              const borderColor = statusBorderColor[turno.estado] || 'var(--border)';
              return (
                <button
                  key={turno.id}
                  onClick={() => setDrawerTurno(turno)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '52px 34px 1fr auto',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    background: 'var(--surface-raised)',
                    border: '1px solid var(--border-subtle)',
                    borderLeft: `2px solid ${borderColor}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    transition: 'all 140ms ease',
                    width: '100%',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--surface-overlay)';
                    e.currentTarget.style.borderColor = borderColor;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--surface-raised)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    (e.currentTarget.style as any).borderLeftColor = borderColor;
                  }}
                >
                  <span style={{
                    fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)',
                    fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em',
                  }}>
                    {turno.hora}
                  </span>
                  <Avatar nombre={`${p.nombre} ${p.apellido}`} size={30} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '1px', letterSpacing: '-0.01em' }}>
                      {p.nombre} {p.apellido}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {turno.motivo} · <span style={{ color: 'var(--text-muted)' }}>{turno.obraSocial}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Badge variant={turno.estado} />
                    <ChevronRight size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel derecho */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Cobros */}
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={sectionTitle}>Cobros del día</h3>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--green)', fontVariantNumeric: 'tabular-nums' }}>
                ${totalCobradoHoy.toLocaleString('es-AR')}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {cobrosHoy.slice(0, 5).map(c => {
                const p = getPaciente(c.pacienteId);
                return (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {p?.nombre} {p?.apellido}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                        ${c.monto.toLocaleString('es-AR')}
                      </span>
                      <Badge variant={c.estado} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alertas */}
          <div style={card}>
            <h3 style={{ ...sectionTitle, marginBottom: '12px' }}>Alertas</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <AlertItem icon={<MessageCircle size={13} />} color="var(--green)" bg="var(--green-bg)" text="WhatsApp enviado a 7 pacientes" />
              <AlertItem icon={<AlertCircle size={13} />} color="var(--red)" bg="var(--red-bg)" text="Cancelación — Roberto Sánchez" />
              <AlertItem icon={<FileText size={13} />} color="var(--blue)" bg="var(--blue-bg)" text="2 recetas crónicas por renovar" />
            </div>
          </div>

          {/* Chart */}
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={sectionTitle}>Turnos / semana</h3>
              <span style={{ fontSize: '11px', color: 'var(--green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                <ArrowUpRight size={11} /> +8%
              </span>
            </div>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -28, bottom: 0 }} barSize={14}>
                <XAxis dataKey="dia" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: 'var(--border-subtle)', radius: 4 }}
                  contentStyle={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: '8px', fontSize: '12px', boxShadow: 'var(--shadow-md)',
                    color: 'var(--text-primary)',
                  }}
                />
                <Bar dataKey="turnos" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                  {barData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.dia === 'Mié' ? 'var(--blue)' : 'var(--border)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Drawer detalle */}
      <Drawer open={!!drawerTurno} onClose={() => setDrawerTurno(null)} title="Detalle de turno">
        {drawerTurno && drawerPaciente && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', background: 'var(--surface-raised)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <Avatar nombre={`${drawerPaciente.nombre} ${drawerPaciente.apellido}`} size={48} />
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '3px' }}>
                  {drawerPaciente.nombre} {drawerPaciente.apellido}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {drawerPaciente.obraSocial} · {drawerTurno.hora}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              <InfoRow label="Motivo" value={drawerTurno.motivo} />
              <InfoRow label="Estado" value={<Badge variant={drawerTurno.estado} />} />
              <InfoRow label="Duración" value={`${drawerTurno.duracion} min`} />
              <InfoRow label="DNI" value={drawerPaciente.dni} />
              <InfoRow label="Teléfono" value={drawerPaciente.telefono} />
              {drawerPaciente.antecedentes.length > 0 && (
                <InfoRow label="Antecedentes" value={drawerPaciente.antecedentes.join(', ')} />
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
              <Button variant="primary" style={{ justifyContent: 'center' }}>Iniciar consulta</Button>
              <Button variant="secondary" style={{ justifyContent: 'center' }}>Reprogramar</Button>
              <Button variant="destructive" style={{ justifyContent: 'center' }}>Cancelar turno</Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

/* ── subcomponents ─────────────────────────────────────── */

function MetricCard({ icon, label, value, sub, color, colorBg, trend }: {
  icon: React.ReactNode; label: string; value: string; sub: string;
  color: string; colorBg: string; trend?: string;
}) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '10px',
      padding: '18px 20px',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex', flexDirection: 'column', gap: '0',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{
          width: 32, height: 32, borderRadius: '8px',
          background: colorBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: color,
          flexShrink: 0,
        }}>
          {icon}
        </div>
        {trend && (
          <span style={{ fontSize: '11px', color: 'var(--green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
            <ArrowUpRight size={11} /> {trend}
          </span>
        )}
      </div>

      <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>
        {label}
      </div>
      <div style={{ fontSize: '26px', fontWeight: 600, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '5px' }}>
        {value}
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{sub}</div>
    </div>
  );
}

function AlertItem({ icon, color, bg, text }: { icon: React.ReactNode; color: string; bg: string; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{
        width: 26, height: 26, borderRadius: '7px',
        background: bg, color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{text}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '9px 0', borderBottom: '1px solid var(--border-subtle)',
    }}>
      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

const card: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: '10px',
  padding: '20px',
  boxShadow: 'var(--shadow-sm)',
};

const sectionTitle: React.CSSProperties = {
  margin: 0,
  fontSize: '11px', fontWeight: 600,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase', letterSpacing: '0.07em',
};
