import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';
import { useClinicData } from '../context/ClinicDataContext';
import { EmptyState } from '../components/ui/EmptyState';

type Periodo = 'semana' | 'mes' | 'trimestre' | 'año';

const HORAS_MAP = ['8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h'];
const DIAS_MAP = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];
const DIAS_FECHAS = ['2026-06-09', '2026-06-10', '2026-06-11', '2026-06-12', '2026-06-13'];
const chartColors = ['var(--blue)', 'var(--green)', 'var(--purple)', 'var(--amber)', 'var(--text-secondary)'];

function money(value: number) {
  return `$${value.toLocaleString('es-AR')}`;
}

export function Estadisticas() {
  const { pacientes, consultas, turnos, cobros } = useClinicData();
  const [periodo, setPeriodo] = useState<Periodo>('mes');
  const pacientesUnicos = new Set(consultas.map(c => c.pacienteId));
  const cancelados = turnos.filter(t => t.estado === 'cancelado').length;
  const ingresos = cobros.filter(c => c.estado === 'cobrado').reduce((sum, cobro) => sum + cobro.monto, 0);
  const m = {
    consultas: consultas.length,
    pacientes: pacientesUnicos.size || pacientes.length,
    ausentismo: turnos.length ? Math.round((cancelados / turnos.length) * 100) : 0,
    nuevos: pacientes.length,
    ingresos: money(ingresos),
  };
  const barDataMes = DIAS_MAP.map((dia, index) => ({
    dia,
    turnos: turnos.filter(t => t.fecha === DIAS_FECHAS[index]).length,
  }));
  const lineData6M = Object.values(cobros.reduce<Record<string, { mes: string; ingresos: number }>>((acc, cobro) => {
    const [, month] = cobro.fecha.split('-');
    const label = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][Number(month) - 1] || month;
    acc[label] = acc[label] || { mes: label, ingresos: 0 };
    acc[label].ingresos += cobro.estado === 'cobrado' ? cobro.monto : 0;
    return acc;
  }, {}));
  const diagnosticos = Object.values(consultas.reduce<Record<string, { nombre: string; cantidad: number }>>((acc, consulta) => {
    acc[consulta.diagnostico] = acc[consulta.diagnostico] || { nombre: consulta.diagnostico, cantidad: 0 };
    acc[consulta.diagnostico].cantidad += 1;
    return acc;
  }, {}))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5)
    .map((diagnostico, index) => ({
      nombre: diagnostico.nombre,
      porcentaje: consultas.length ? Math.round((diagnostico.cantidad / consultas.length) * 100) : 0,
      color: chartColors[index % chartColors.length],
    }));
  const heatmapData = turnos.reduce<Record<string, Record<string, number>>>((acc, turno) => {
    const dayIndex = DIAS_FECHAS.indexOf(turno.fecha);
    if (dayIndex === -1) return acc;
    const dia = DIAS_MAP[dayIndex];
    const hora = `${Number(turno.hora.slice(0, 2))}h`;
    acc[dia] = acc[dia] || {};
    acc[dia][hora] = (acc[dia][hora] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Selector período */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginRight: '4px' }}>Período:</span>
        {(['semana', 'mes', 'trimestre', 'año'] as Periodo[]).map(p => (
          <button
            key={p}
            onClick={() => setPeriodo(p)}
            style={{
              padding: '6px 16px', fontSize: '13px', fontWeight: 500,
              borderRadius: '7px', border: '1px solid var(--border)',
              cursor: 'pointer', fontFamily: 'inherit',
              background: periodo === p ? 'var(--blue)' : 'var(--surface)',
              color: periodo === p ? '#fff' : 'var(--text-secondary)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* 5 métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
        {[
          { label: 'Consultas', value: m.consultas },
          { label: 'Pacientes únicos', value: m.pacientes },
          { label: 'Ausentismo', value: `${m.ausentismo}%` },
          { label: 'Nuevos pacientes', value: m.nuevos },
          { label: 'Ingresos', value: m.ingresos },
        ].map(({ label, value }) => (
          <div key={label} className="card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              {label}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={sTitle}>Consultas por día</h3>
          {turnos.length > 0 ? (
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={barDataMes} margin={{ left: -24, right: 0, top: 4, bottom: 0 }}>
                <XAxis dataKey="dia" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', boxShadow: 'var(--shadow-md)' }} />
                <Bar dataKey="turnos" fill="var(--blue)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="Sin turnos" text="Las consultas por día se completan con la agenda." />
          )}
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <h3 style={sTitle}>Ingresos — últimos 6 meses</h3>
          {lineData6M.length > 0 ? (
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={lineData6M} margin={{ left: -12, right: 0, top: 4, bottom: 0 }}>
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', boxShadow: 'var(--shadow-md)' }}
                  formatter={(v: number) => [`$${v.toLocaleString('es-AR')}`, 'Ingresos']}
                />
                <Line type="monotone" dataKey="ingresos" stroke="var(--blue)" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="Sin ingresos" text="Todavía no hay cobros para mostrar." />
          )}
        </div>
      </div>

      {/* Top diagnósticos + Heatmap */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={sTitle}>Top 5 diagnósticos</h3>
          {diagnosticos.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {diagnosticos.map((d, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{d.nombre}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{d.porcentaje}%</span>
                  </div>
                  <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px' }}>
                    <div style={{ height: '100%', width: `${d.porcentaje}%`, background: d.color, borderRadius: '2px', transition: 'width 400ms ease' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="Sin diagnósticos" text="Los diagnósticos aparecerán al registrar consultas." />
          )}
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <h3 style={sTitle}>Mapa de calor horario</h3>
          {turnos.length > 0 ? (
            <>
              <div style={{ overflowX: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: `40px repeat(${HORAS_MAP.length}, 1fr)`, gap: '2px', minWidth: 480 }}>
                  <div />
                  {HORAS_MAP.map(h => (
                    <div key={h} style={{ fontSize: '9px', color: 'var(--text-muted)', textAlign: 'center', paddingBottom: '4px' }}>{h}</div>
                  ))}
                  {DIAS_MAP.map(dia => (
                    <React.Fragment key={dia}>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>{dia}</div>
                      {HORAS_MAP.map(hora => {
                        const val = heatmapData[dia]?.[hora] ?? 0;
                        const opacity = Math.min(val / 10, 0.9);
                        return (
                          <div
                            key={hora}
                            title={`${dia} ${hora}: ${val} turnos`}
                            style={{
                              height: '20px', borderRadius: '3px',
                              background: `rgba(79,131,248,${opacity})`,
                              border: '1px solid var(--border-subtle)',
                            }}
                          />
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Bajo</span>
                {[0.1, 0.3, 0.5, 0.7, 0.9].map(o => (
                  <div key={o} style={{ width: '16px', height: '10px', borderRadius: '2px', background: `rgba(79,131,248,${o})` }} />
                ))}
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Alto</span>
              </div>
            </>
          ) : (
            <EmptyState title="Sin turnos" text="El mapa se va a completar cuando cargues la agenda." />
          )}
        </div>
      </div>
    </div>
  );
}

const sTitle: React.CSSProperties = {
  margin: '0 0 16px',
  fontSize: '11px', fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase', letterSpacing: '0.06em',
};
