import React, { useState } from 'react';
import { Search, Plus, Edit2, Check } from 'lucide-react';
import { pacientes, consultas as consultasIniciales } from '../data/mockData';
import { Consulta } from '../types';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { useToast, Toast } from '../components/ui/Toast';

export function HistoriaClinica() {
  const [consultas, setConsultas] = useState<Consulta[]>(consultasIniciales);
  const [query, setQuery] = useState('');
  const [detalle, setDetalle] = useState<Consulta | null>(null);
  const [editandoNotas, setEditandoNotas] = useState(false);
  const [notasEdit, setNotasEdit] = useState('');
  const [modalNuevo, setModalNuevo] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const [form, setForm] = useState({
    pacienteId: '',
    motivo: '',
    anamnesis: '',
    ta: '', fc: '', temp: '', peso: '', talla: '',
    diagnostico: '',
    cie10: '',
    indicaciones: '',
    proximoControl: '',
  });

  const getPaciente = (id: string) => pacientes.find(p => p.id === id);

  const filtradas = consultas
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .filter(c => {
      const q = query.toLowerCase();
      const p = getPaciente(c.pacienteId);
      return (
        `${p?.nombre} ${p?.apellido}`.toLowerCase().includes(q) ||
        c.diagnostico.toLowerCase().includes(q) ||
        c.motivo.toLowerCase().includes(q)
      );
    });

  function handleNuevaConsulta() {
    if (!form.pacienteId || !form.motivo || !form.diagnostico) return;
    const nueva: Consulta = {
      id: `c-${Date.now()}`,
      pacienteId: form.pacienteId,
      fecha: '2026-06-11',
      motivo: form.motivo,
      anamnesis: form.anamnesis || undefined,
      examenFisico: {
        ta: form.ta || undefined,
        fc: form.fc ? parseInt(form.fc) : undefined,
        temp: form.temp ? parseFloat(form.temp) : undefined,
        peso: form.peso ? parseFloat(form.peso) : undefined,
        talla: form.talla ? parseFloat(form.talla) : undefined,
      },
      diagnostico: form.diagnostico,
      cie10: form.cie10 || undefined,
      indicaciones: form.indicaciones,
      proximoControl: form.proximoControl || undefined,
    };
    setConsultas(prev => [...prev, nueva]);
    setModalNuevo(false);
    addToast('Consulta registrada', 'success');
    setForm({ pacienteId: '', motivo: '', anamnesis: '', ta: '', fc: '', temp: '', peso: '', talla: '', diagnostico: '', cie10: '', indicaciones: '', proximoControl: '' });
  }

  function handleGuardarNotas() {
    if (!detalle) return;
    setConsultas(prev => prev.map(c => c.id === detalle.id ? { ...c, indicaciones: notasEdit } : c));
    setDetalle(c => c ? { ...c, indicaciones: notasEdit } : c);
    setEditandoNotas(false);
    addToast('Notas guardadas', 'success');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            placeholder="Buscar por paciente o diagnóstico…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              width: '100%', paddingLeft: '36px', paddingRight: '12px', paddingTop: '9px', paddingBottom: '9px',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '8px', fontSize: '13px', color: 'var(--text-primary)',
              fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
              boxShadow: 'var(--shadow-sm)',
            }}
          />
        </div>
        <Button variant="primary" onClick={() => setModalNuevo(true)}>
          <Plus size={15} /> Nueva consulta
        </Button>
      </div>

      {/* Lista */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '100px 160px 1fr 200px', padding: '10px 20px', borderBottom: '1px solid var(--border)', background: 'var(--surface-raised)' }}>
          {['Fecha', 'Paciente', 'Diagnóstico', 'Indicaciones'].map(h => (
            <span key={h} style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>

        {filtradas.map(c => {
          const p = getPaciente(c.pacienteId);
          return (
            <button
              key={c.id}
              onClick={() => { setDetalle(c); setNotasEdit(c.indicaciones); setEditandoNotas(false); }}
              className="row-hover"
              style={{
                display: 'grid', gridTemplateColumns: '100px 160px 1fr 200px',
                padding: '12px 20px', width: '100%', textAlign: 'left',
                background: 'none', border: 'none', borderBottom: '1px solid var(--border-subtle)',
                cursor: 'pointer', fontFamily: 'inherit', alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{c.fecha}</span>
              <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{p?.nombre} {p?.apellido}</span>
              <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{c.diagnostico}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.indicaciones}
              </span>
            </button>
          );
        })}
      </div>

      {/* Modal detalle */}
      <Modal open={!!detalle} onClose={() => setDetalle(null)} title="Detalle de consulta" maxWidth={640}>
        {detalle && (() => {
          const p = getPaciente(detalle.pacienteId)!;
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>{p.nombre} {p.apellido}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{detalle.fecha} · {detalle.motivo}</div>
                </div>
                {detalle.cie10 && (
                  <span style={{ fontSize: '11px', color: 'var(--blue)', background: 'var(--blue-bg)', border: '1px solid var(--blue-border)', borderRadius: '6px', padding: '3px 8px' }}>
                    CIE-10: {detalle.cie10}
                  </span>
                )}
              </div>

              {detalle.anamnesis && (
                <Section title="Anamnesis">
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>{detalle.anamnesis}</p>
                </Section>
              )}

              {detalle.examenFisico && Object.values(detalle.examenFisico).some(Boolean) && (
                <Section title="Examen físico">
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {detalle.examenFisico.ta && <Vital label="TA" value={detalle.examenFisico.ta} />}
                    {detalle.examenFisico.fc && <Vital label="FC" value={`${detalle.examenFisico.fc} lpm`} />}
                    {detalle.examenFisico.temp && <Vital label="Temp" value={`${detalle.examenFisico.temp}°C`} />}
                    {detalle.examenFisico.peso && <Vital label="Peso" value={`${detalle.examenFisico.peso} kg`} />}
                    {detalle.examenFisico.talla && <Vital label="Talla" value={`${detalle.examenFisico.talla} cm`} />}
                  </div>
                </Section>
              )}

              <Section title="Diagnóstico">
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{detalle.diagnostico}</p>
              </Section>

              <Section title="Indicaciones y plan">
                {editandoNotas ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <textarea
                      value={notasEdit}
                      onChange={e => setNotasEdit(e.target.value)}
                      rows={4}
                      style={{
                        background: 'var(--surface-raised)', border: '1px solid var(--border)',
                        borderRadius: '8px', padding: '10px', fontSize: '13px',
                        color: 'var(--text-primary)', fontFamily: 'inherit', resize: 'vertical',
                        width: '100%', boxSizing: 'border-box',
                      }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button variant="primary" size="sm" onClick={handleGuardarNotas}>
                        <Check size={13} /> Guardar
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => setEditandoNotas(false)}>Cancelar</Button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', flex: 1 }}>{detalle.indicaciones}</p>
                    <button
                      onClick={() => setEditandoNotas(true)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px', display: 'flex' }}
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                )}
              </Section>

              {detalle.proximoControl && (
                <Section title="Próximo control">
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--blue)' }}>{detalle.proximoControl}</p>
                </Section>
              )}
            </div>
          );
        })()}
      </Modal>

      {/* Modal nueva consulta */}
      <Modal open={modalNuevo} onClose={() => setModalNuevo(false)} title="Nueva consulta" maxWidth={680}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <FormField label="Paciente">
            <select value={form.pacienteId} onChange={e => setForm(f => ({ ...f, pacienteId: e.target.value }))} style={selSt}>
              <option value="">Seleccionar paciente…</option>
              {pacientes.map(p => <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>)}
            </select>
          </FormField>

          <FormField label="Motivo de consulta">
            <input value={form.motivo} onChange={e => setForm(f => ({ ...f, motivo: e.target.value }))} placeholder="Motivo…" style={inpSt} />
          </FormField>

          <FormField label="Anamnesis">
            <textarea value={form.anamnesis} onChange={e => setForm(f => ({ ...f, anamnesis: e.target.value }))} rows={3} style={{ ...inpSt, resize: 'vertical' }} />
          </FormField>

          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Examen físico
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[
                { key: 'ta', label: 'TA (mmHg)', placeholder: '120/80' },
                { key: 'fc', label: 'FC (lpm)', placeholder: '72' },
                { key: 'temp', label: 'Temperatura (°C)', placeholder: '36.5' },
                { key: 'peso', label: 'Peso (kg)', placeholder: '70' },
                { key: 'talla', label: 'Talla (cm)', placeholder: '170' },
              ].map(({ key, label, placeholder }) => (
                <FormField key={key} label={label}>
                  <input
                    placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    style={inpSt}
                  />
                </FormField>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '10px' }}>
            <FormField label="Diagnóstico">
              <input value={form.diagnostico} onChange={e => setForm(f => ({ ...f, diagnostico: e.target.value }))} placeholder="Diagnóstico…" style={inpSt} />
            </FormField>
            <FormField label="CIE-10">
              <input value={form.cie10} onChange={e => setForm(f => ({ ...f, cie10: e.target.value }))} placeholder="I10" style={inpSt} />
            </FormField>
          </div>

          <FormField label="Plan e indicaciones">
            <textarea value={form.indicaciones} onChange={e => setForm(f => ({ ...f, indicaciones: e.target.value }))} rows={3} style={{ ...inpSt, resize: 'vertical' }} />
          </FormField>

          <FormField label="Próximo control">
            <input type="date" value={form.proximoControl} onChange={e => setForm(f => ({ ...f, proximoControl: e.target.value }))} style={inpSt} />
          </FormField>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setModalNuevo(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleNuevaConsulta}>Guardar consulta</Button>
          </div>
        </div>
      </Modal>

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Vital({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)',
      borderRadius: '6px', padding: '5px 9px', fontSize: '12px',
    }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}: </span>
      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>
      {children}
    </div>
  );
}

const inpSt: React.CSSProperties = {
  background: 'var(--canvas)', border: '1px solid var(--border)',
  borderRadius: '8px', padding: '8px 12px',
  fontSize: '13px', color: 'var(--text-primary)',
  fontFamily: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box',
};

const selSt: React.CSSProperties = { ...inpSt, cursor: 'pointer', background: 'var(--surface-raised)' };
