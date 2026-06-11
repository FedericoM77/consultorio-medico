import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';

type Periodo = 'semana' | 'mes' | 'trimestre' | 'año';

const metricas: Record<Periodo, {
  consultas: number; pacientes: number; ausentismo: number; nuevos: number; ingresos: string;
}> = {
  semana: { consultas: 9, pacientes: 9, ausentismo: 9, nuevos: 2, ingresos: '$74.000' },
  mes: { consultas: 38, pacientes: 28, ausentismo: 8, nuevos: 18, ingresos: '$412.000' },
  trimestre: { consultas: 112, pacientes: 64, ausentismo: 7, nuevos: 41, ingresos: '$1.248.000' },
  año: { consultas: 421, pacientes: 156, ausentismo: 6, nuevos: 98, ingresos: '$4.820.000' },
};

const barDataMes = [
  { dia: 'Lun', turnos: 7 },
  { dia: 'Mar', turnos: 11 },
  { dia: 'Mié', turnos: 9 },
  { dia: 'Jue', turnos: 10 },
  { dia: 'Vie', turnos: 6 },
];

const lineData6M = [
  { mes: 'Ene', ingresos: 380000 },
  { mes: 'Feb', ingresos: 392000 },
  { mes: 'Mar', ingresos: 415000 },
  { mes: 'Abr', ingresos: 398000 },
  { mes: 'May', ingresos: 428000 },
  { mes: 'Jun', ingresos: 412000 },
];

const diagnosticos = [
  { nombre: 'Hipertensión arterial', porcentaje: 34, color: 'var(--blue)' },
  { nombre: 'Control sano adulto', porcentaje: 22, color: 'var(--green)' },
  { nombre: 'Diabetes tipo 2', porcentaje: 18, color: 'var(--purple)' },
  { nombre: 'Lumbalgia', porcentaje: 14, color: 'var(--amber)' },
  { nombre: 'Rinitis alérgica', porcentaje: 12, color: 'var(--text-secondary)' },
];

const HORAS_MAP = ['8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h'];
const DIAS_MAP = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];

const heatmapData: Record<string, Record<string, number>> = {
  'Lun': { '8h': 2, '9h': 5, '10h': 8, '11h': 6, '12h': 4, '13h': 1, '14h': 0, '15h': 2, '16h': 5, '17h': 7, '18h': 4, '19h': 2 },
  'Mar': { '8h': 3, '9h': 6, '10h': 10, '11h': 8, '12h': 5, '13h': 2, '14h': 0, '15h': 3, '16h': 6, '17h': 9, '18h': 5, '19h': 3 },
  'Mié': { '8h': 2, '9h': 5, '10h': 8, '11h': 7, '12h': 4, '13h': 1, '14h': 0, '15h': 2, '16h': 5, '17h': 8, '18h': 5, '19h': 2 },
  'Jue': { '8h': 3, '9h': 7, '10h': 9, '11h': 7, '12h': 6, '13h': 2, '14h': 1, '15h': 3, '16h': 7, '17h': 9, '18h': 6, '19h': 3 },
  'Vie': { '8h': 2, '9h': 4, '10h': 6, '11h': 5, '12h': 3, '13h': 1, '14h': 0, '15h': 2, '16h': 4, '17h': 5, '18h': 3, '19h': 1 },
};

export function Estadisticas() {
  const [periodo, setPeriodo] = useState<Periodo>('mes');
  const m = metricas[periodo];

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
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={barDataMes} margin={{ left: -24, right: 0, top: 4, bottom: 0 }}>
              <XAxis dataKey="dia" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', boxShadow: 'var(--shadow-md)' }} />
              <Bar dataKey="turnos" fill="var(--blue)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <h3 style={sTitle}>Ingresos — últimos 6 meses</h3>
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
        </div>
      </div>

      {/* Top diagnósticos + Heatmap */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={sTitle}>Top 5 diagnósticos</h3>
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
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <h3 style={sTitle}>Mapa de calor horario</h3>
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
                    const opacity = val / 10;
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
