import React, { useState } from 'react';
import { Plus, RefreshCw, Printer } from 'lucide-react';
import { pacientes, recetas as recetasIniciales, medicoInfo } from '../data/mockData';
import { Receta } from '../types';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { useToast, Toast } from '../components/ui/Toast';

const cronicas = recetasIniciales.filter(r => r.esCronica);

export function Recetas() {
  const [recetas, setRecetas] = useState<Receta[]>(recetasIniciales);
  const [modalNuevo, setModalNuevo] = useState(false);
  const [modalPreview, setModalPreview] = useState<Receta | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  const [form, setForm] = useState({
    pacienteId: '',
    medicamentos: [{ nombre: '', principioActivo: '', dosis: '', posologia: '', duracion: '' }],
    indicaciones: '',
    esCronica: false,
  });

  function handleEmitir() {
    if (!form.pacienteId || form.medicamentos[0].nombre === '') return;
    const nueva: Receta = {
      id: `r-${Date.now()}`,
      pacienteId: form.pacienteId,
      fecha: '2026-06-11',
      medicamentos: form.medicamentos.filter(m => m.nombre),
      indicaciones: form.indicaciones || undefined,
      estado: 'vigente',
      esCronica: form.esCronica,
    };
    setRecetas(prev => [...prev, nueva]);
    setModalNuevo(false);
    addToast('Receta emitida correctamente', 'success');
    setForm({ pacienteId: '', medicamentos: [{ nombre: '', principioActivo: '', dosis: '', posologia: '', duracion: '' }], indicaciones: '', esCronica: false });
  }

  function handleRenovar(receta: Receta) {
    const nueva: Receta = {
      ...receta,
      id: `r-${Date.now()}`,
      fecha: '2026-06-11',
      estado: 'vigente',
    };
    setRecetas(prev => [...prev, nueva]);
    addToast('Receta renovada', 'success');
    setModalPreview(nueva);
  }

  function addMed() {
    setForm(f => ({ ...f, medicamentos: [...f.medicamentos, { nombre: '', principioActivo: '', dosis: '', posologia: '', duracion: '' }] }));
  }

  const getPaciente = (id: string) => pacientes.find(p => p.id === id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Recetas</h2>
        <Button variant="primary" onClick={() => setModalNuevo(true)}>
          <Plus size={15} /> Nueva receta
        </Button>
      </div>

      {/* Lista de recetas */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '10px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', background: 'var(--surface-raised)' }}>
          <h3 style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Todas las recetas ({recetas.length})
          </h3>
        </div>
        {recetas.map(r => {
          const p = getPaciente(r.pacienteId);
          return (
            <div
              key={r.id}
              style={{
                display: 'grid', gridTemplateColumns: '100px 1fr 180px auto',
                alignItems: 'center', gap: '16px',
                padding: '13px 20px', borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{r.fecha}</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '2px' }}>
                  {p?.nombre} {p?.apellido}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {r.medicamentos.map(m => `${m.nombre} ${m.dosis}`).join(' · ')}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {r.esCronica && (
                  <span style={{ fontSize: '10px', color: 'var(--blue)', background: 'var(--blue-bg)', border: '1px solid var(--blue-border)', borderRadius: '5px', padding: '2px 8px' }}>
                    Crónica
                  </span>
                )}
                <Badge variant={r.estado} />
              </div>
              <button
                onClick={() => setModalPreview(r)}
                style={{
                  background: 'var(--surface-raised)', border: '1px solid var(--border)',
                  borderRadius: '6px', padding: '6px 10px', cursor: 'pointer',
                  fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}
              >
                <Printer size={13} /> Ver
              </button>
            </div>
          );
        })}
      </div>

      {/* Sección crónicas */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '10px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', background: 'var(--surface-raised)' }}>
          <h3 style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Medicación crónica — renovación mensual
          </h3>
        </div>
        {cronicas.map(r => {
          const p = getPaciente(r.pacienteId);
          return (
            <div
              key={r.id}
              style={{
                display: 'grid', gridTemplateColumns: '1fr auto',
                alignItems: 'center', gap: '16px',
                padding: '13px 20px', borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '2px' }}>
                  {p?.nombre} {p?.apellido}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {r.medicamentos.map(m => `${m.nombre} ${m.dosis}`).join(' · ')} · Último: {r.fecha}
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={() => handleRenovar(r)}>
                <RefreshCw size={13} /> Renovar
              </Button>
            </div>
          );
        })}
      </div>

      {/* Modal nueva receta */}
      <Modal open={modalNuevo} onClose={() => setModalNuevo(false)} title="Nueva receta" maxWidth={640}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FormField label="Paciente">
            <select value={form.pacienteId} onChange={e => setForm(f => ({ ...f, pacienteId: e.target.value }))} style={selectSt}>
              <option value="">Seleccionar paciente…</option>
              {pacientes.map(p => <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>)}
            </select>
          </FormField>

          {form.medicamentos.map((med, i) => (
            <div key={i} style={{
              background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)',
              borderRadius: '8px', padding: '16px',
              display: 'flex', flexDirection: 'column', gap: '10px',
            }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Medicamento {i + 1}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <FormField label="Nombre comercial">
                  <input placeholder="Amlodipina" value={med.nombre}
                    onChange={e => { const m = [...form.medicamentos]; m[i].nombre = e.target.value; setForm(f => ({ ...f, medicamentos: m })); }}
                    style={inputSt} />
                </FormField>
                <FormField label="Principio activo">
                  <input placeholder="Amlodipina besilato" value={med.principioActivo}
                    onChange={e => { const m = [...form.medicamentos]; m[i].principioActivo = e.target.value; setForm(f => ({ ...f, medicamentos: m })); }}
                    style={inputSt} />
                </FormField>
                <FormField label="Dosis">
                  <input placeholder="10mg" value={med.dosis}
                    onChange={e => { const m = [...form.medicamentos]; m[i].dosis = e.target.value; setForm(f => ({ ...f, medicamentos: m })); }}
                    style={inputSt} />
                </FormField>
                <FormField label="Posología">
                  <input placeholder="1 comprimido por día" value={med.posologia}
                    onChange={e => { const m = [...form.medicamentos]; m[i].posologia = e.target.value; setForm(f => ({ ...f, medicamentos: m })); }}
                    style={inputSt} />
                </FormField>
                <FormField label="Duración">
                  <input placeholder="3 meses / Crónico" value={med.duracion}
                    onChange={e => { const m = [...form.medicamentos]; m[i].duracion = e.target.value; setForm(f => ({ ...f, medicamentos: m })); }}
                    style={inputSt} />
                </FormField>
              </div>
            </div>
          ))}

          {form.medicamentos.length < 3 && (
            <button onClick={addMed} style={{
              background: 'transparent', border: '1px dashed var(--border)', borderRadius: '8px',
              padding: '10px', cursor: 'pointer', fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'inherit',
            }}>
              + Agregar medicamento
            </button>
          )}

          <FormField label="Indicaciones adicionales">
            <textarea
              placeholder="Indicaciones para el paciente…"
              value={form.indicaciones}
              onChange={e => setForm(f => ({ ...f, indicaciones: e.target.value }))}
              rows={3}
              style={{ ...inputSt, resize: 'vertical' }}
            />
          </FormField>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-primary)' }}>
            <input type="checkbox" checked={form.esCronica}
              onChange={e => setForm(f => ({ ...f, esCronica: e.target.checked }))} />
            Medicación crónica (aparece en renovación mensual)
          </label>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setModalNuevo(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleEmitir}>Emitir receta</Button>
          </div>
        </div>
      </Modal>

      {/* Modal preview receta */}
      <Modal open={!!modalPreview} onClose={() => setModalPreview(null)} title="Vista previa de receta">
        {modalPreview && (() => {
          const p = getPaciente(modalPreview.pacienteId)!;
          return (
            <div style={{
              background: 'white', color: '#000', borderRadius: '8px', padding: '24px',
              fontFamily: 'serif', lineHeight: 1.6,
            }}>
              <div style={{ borderBottom: '2px solid #000', paddingBottom: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{medicoInfo.nombre}</div>
                <div style={{ fontSize: '13px' }}>{medicoInfo.especialidad}</div>
                <div style={{ fontSize: '12px' }}>M.N. {medicoInfo.matriculaNacional} · M.P. {medicoInfo.matriculaProvincial}</div>
                <div style={{ fontSize: '12px' }}>{medicoInfo.consultorio} — {medicoInfo.direccion}</div>
              </div>

              <div style={{ fontSize: '12px', marginBottom: '12px' }}>
                <strong>Paciente:</strong> {p.nombre} {p.apellido} — DNI {p.dni}<br />
                <strong>Obra social:</strong> {p.obraSocial}<br />
                <strong>Fecha:</strong> {modalPreview.fecha}
              </div>

              <div style={{ marginBottom: '12px' }}>
                {modalPreview.medicamentos.map((m, i) => (
                  <div key={i} style={{ marginBottom: '10px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Rp. {m.nombre} {m.dosis}</div>
                    <div style={{ fontSize: '12px', paddingLeft: '16px' }}>{m.principioActivo}</div>
                    <div style={{ fontSize: '12px', paddingLeft: '16px' }}>Posología: {m.posologia}</div>
                    {m.duracion && <div style={{ fontSize: '12px', paddingLeft: '16px' }}>Duración: {m.duracion}</div>}
                  </div>
                ))}
              </div>

              {modalPreview.indicaciones && (
                <div style={{ fontSize: '12px', borderTop: '1px solid #ccc', paddingTop: '8px', marginBottom: '16px' }}>
                  <strong>Indicaciones:</strong> {modalPreview.indicaciones}
                </div>
              )}

              <div style={{ borderTop: '1px solid #000', paddingTop: '24px', marginTop: '24px', textAlign: 'right', fontSize: '12px', fontStyle: 'italic' }}>
                Dra. María García — Clínica Médica
              </div>
            </div>
          );
        })()}
      </Modal>

      <Toast toasts={toasts} onRemove={removeToast} />
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

const inputSt: React.CSSProperties = {
  background: 'var(--canvas)', border: '1px solid var(--border)',
  borderRadius: '8px', padding: '8px 12px',
  fontSize: '13px', color: 'var(--text-primary)',
  fontFamily: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box',
};

const selectSt: React.CSSProperties = { ...inputSt, cursor: 'pointer', background: 'var(--surface-raised)' };
