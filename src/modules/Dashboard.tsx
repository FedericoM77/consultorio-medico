import React, { useState } from 'react';
import { Calendar, DollarSign, Users, Clock, MessageCircle, AlertCircle, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { pacientes, turnos, cobros } from '../data/mockData';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Drawer } from '../components/ui/Drawer';
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

export function Dashboard() {
  const [drawerTurno, setDrawerTurno] = useState<Turno | null>(null);

  const getPaciente = (id: string) => pacientes.find(p => p.id === id);

  const drawerPaciente = drawerTurno ? getPaciente(drawerTurno.pacienteId) : null;

  const pendientesHoy = cobrosHoy.filter(c => c.estado === 'pendiente').length;
  const confirmados = turnosHoy.filter(t => t.estado === 'confirmado').length;
  const pendientesTurno = turnosHoy.filter(t => t.estado === 'pendiente').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <MetricCard
          icon={<Calendar size={18} />}
          label="Turnos hoy"
          value={String(turnosHoy.length)}
          sub={`${confirmados} confirmados · ${pendientesTurno} pendientes`}
          color="var(--accent-yellow)"
        />
        <MetricCard
          icon={<DollarSign size={18} />}
          label="Cobrado hoy"
          value={`$${totalCobradoHoy.toLocaleString('es-AR')}`}
          sub={`${pendientesHoy} pendientes de cobro`}
          color="var(--accent-green)"
        />
        <MetricCard
          icon={<Users size={18} />}
          label="Nuevos este mes"
          value="18"
          sub="pacientes"
          color="var(--accent-blue)"
        />
        <MetricCard
          icon={<Clock size={18} />}
          label="Próximo turno"
          value="10:30"
          sub="en 12 min — Juan Ramírez"
          color="var(--accent-orange)"
        />
      </div>

      {/* Content row */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '16px' }}>
        {/* Agenda del día */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
          borderRadius: '12px', padding: '24px',
        }}>
          <h2 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
            Agenda del día — miércoles 11/06
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {turnosHoy.map(turno => {
              const p = getPaciente(turno.pacienteId);
              if (!p) return null;
              return (
                <button
                  key={turno.id}
                  onClick={() => setDrawerTurno(turno)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '52px 36px 1fr auto',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    background: 'var(--bg-card-deep)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    transition: 'border-color 150ms ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                >
                  <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                    {turno.hora}
                  </span>
                  <Avatar nombre={`${p.nombre} ${p.apellido}`} size={32} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '2px' }}>
                      {p.nombre} {p.apellido}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {turno.motivo} · {turno.obraSocial}
                    </div>
                  </div>
                  <Badge variant={turno.estado} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel derecho */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Cobros del día */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
            borderRadius: '12px', padding: '20px',
          }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
              COBROS DEL DÍA
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {cobrosHoy.slice(0, 5).map(c => {
                const p = getPaciente(c.pacienteId);
                return (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {p?.nombre} {p?.apellido}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
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
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
            borderRadius: '12px', padding: '20px',
          }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
              ALERTAS
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <AlertItem icon={<MessageCircle size={14} />} color="var(--accent-green)" text="WhatsApp enviado a 7 pacientes" />
              <AlertItem icon={<AlertCircle size={14} />} color="var(--accent-orange)" text="1 cancelación recibida — Roberto Sánchez" />
              <AlertItem icon={<FileText size={14} />} color="var(--accent-blue)" text="2 recetas crónicas por renovar" />
            </div>
          </div>

          {/* Mini gráfico */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
            borderRadius: '12px', padding: '20px',
          }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
              TURNOS / SEMANA
            </h3>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -32, bottom: 0 }}>
                <XAxis dataKey="dia" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: 'var(--border-subtle)' }}
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px' }}
                />
                <Bar dataKey="turnos" fill="var(--accent-yellow)" radius={[3, 3, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Drawer de turno */}
      <Drawer open={!!drawerTurno} onClose={() => setDrawerTurno(null)} title="Detalle de turno">
        {drawerTurno && drawerPaciente && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Avatar nombre={`${drawerPaciente.nombre} ${drawerPaciente.apellido}`} size={48} />
              <div>
                <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>
                  {drawerPaciente.nombre} {drawerPaciente.apellido}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {drawerPaciente.obraSocial} · {drawerTurno.hora}
                </div>
              </div>
            </div>

            <InfoRow label="Motivo" value={drawerTurno.motivo} />
            <InfoRow label="Estado" value={<Badge variant={drawerTurno.estado} />} />
            <InfoRow label="Duración" value={`${drawerTurno.duracion} min`} />
            <InfoRow label="DNI" value={drawerPaciente.dni} />
            <InfoRow label="Teléfono" value={drawerPaciente.telefono} />
            {drawerPaciente.antecedentes.length > 0 && (
              <InfoRow label="Antecedentes" value={drawerPaciente.antecedentes.join(', ')} />
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              <button style={{
                background: 'var(--accent-yellow)', color: 'var(--bg-canvas)',
                border: 'none', borderRadius: '4px', padding: '10px',
                fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Iniciar consulta
              </button>
              <button style={{
                background: 'transparent', color: 'var(--text-primary)',
                border: '1px solid var(--border)', borderRadius: '4px', padding: '10px',
                fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Reprogramar
              </button>
              <button style={{
                background: 'transparent', color: 'var(--accent-orange)',
                border: '1px solid var(--accent-orange)', borderRadius: '4px', padding: '10px',
                fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Cancelar turno
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

function MetricCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string; sub: string; color: string;
}) {
  return (
    <div style={{
      background: 'var(--bg-card-deep)', border: '1px solid var(--border-subtle)',
      borderRadius: '12px', padding: '20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color }}>
        {icon}
        <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: '28px', fontWeight: 500, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums', marginBottom: '4px' }}>
        {value}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{sub}</div>
    </div>
  );
}

function AlertItem({ icon, color, text }: { icon: React.ReactNode; color: string; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ color }}>{icon}</span>
      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{text}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{value}</span>
    </div>
  );
}
