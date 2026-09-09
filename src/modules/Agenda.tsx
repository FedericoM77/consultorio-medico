import React, { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useClinicData } from '../context/ClinicDataContext';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Modal } from '../components/ui/Modal';
import { Drawer } from '../components/ui/Drawer';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Medico, Paciente, Turno } from '../types';
import { useToast } from '../components/ui/Toast';
import { Toast } from '../components/ui/Toast';

type Vista = 'dia' | 'semana' | 'macro';

const HORAS = Array.from({ length: 25 }, (_, i) => {
  const h = 8 + Math.floor(i / 2);
  const m = i % 2 === 0 ? '00' : '30';
  return `${String(h).padStart(2, '0')}:${m}`;
}).filter(h => h <= '20:00');

const DIAS = ['Lun 09', 'Mar 10', 'Mié 11', 'Jue 12', 'Vie 13'];

const estadoColors: Record<string, string> = {
  confirmado: 'var(--green-bg)',
  'en-consultorio': 'var(--blue-bg)',
  pendiente: 'var(--amber-bg)',
  cancelado: 'var(--red-bg)',
  atendido: 'var(--border-subtle)',
};

const estadoBorders: Record<string, string> = {
  confirmado: 'var(--green-border)',
  'en-consultorio': 'var(--blue-border)',
  pendiente: 'var(--amber-border)',
  cancelado: 'var(--red-border)',
  atendido: 'var(--border)',
};

export function Agenda() {
  const { pacientes, medicos, turnos: turnosIniciales, consultas } = useClinicData();
  const [vista, setVista] = useState<Vista>('dia');
  const [turnos, setTurnos] = useState<Turno[]>(turnosIniciales);
  const [drawerTurno, setDrawerTurno] = useState<Turno | null>(null);
  const [modalNuevo, setModalNuevo] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const [form, setForm] = useState({
    pacienteId: '',
    medicoId: medicos[0]?.id || '',
    hora: '09:00',
    duracion: '30' as '15' | '30' | '45' | '60',
    motivo: '',
    obraSocial: '',
  });

  const turnosHoy = turnos.filter(t => t.fecha === '2026-06-11');
  const drawerPaciente = drawerTurno ? pacientes.find(p => p.id === drawerTurno.pacienteId) : null;
  const drawerMedico = drawerTurno ? medicos.find(m => m.id === (drawerTurno.medicoId || medicos[0]?.id)) : null;

  function handleNuevoTurno() {
    const medicoId = form.medicoId || medicos[0]?.id;
    if (!medicoId) {
      addToast('Primero cargá un médico desde Configuración', 'error');
      return;
    }
    if (!form.pacienteId || !form.motivo) {
      addToast('Completá paciente y motivo del turno', 'error');
      return;
    }
    const p = pacientes.find(p => p.id === form.pacienteId)!;
    const nuevo: Turno = {
      id: `t-${Date.now()}`,
      pacienteId: form.pacienteId,
      medicoId,
      fecha: '2026-06-11',
      hora: form.hora,
      duracion: parseInt(form.duracion) as Turno['duracion'],
      motivo: form.motivo,
      estado: 'confirmado',
      obraSocial: form.obraSocial || p.obraSocial,
    };
    setTurnos(prev => [...prev, nuevo]);
    setModalNuevo(false);
    addToast('Turno agendado correctamente', 'success');
    setForm({ pacienteId: '', medicoId, hora: '09:00', duracion: '30', motivo: '', obraSocial: '' });
  }

  return (
    <div className="module-stack" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header del módulo */}
      <div className="agenda-toolbar responsive-toolbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <div className="segmented-actions" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {(['dia', 'semana', 'macro'] as Vista[]).map(v => (
            <button
              key={v}
              onClick={() => setVista(v)}
              style={{
                padding: '6px 16px', fontSize: '13px', fontWeight: 500,
                borderRadius: '7px', border: '1px solid var(--border)',
                cursor: 'pointer', fontFamily: 'inherit',
                background: vista === v ? 'var(--blue)' : 'var(--surface)',
                color: vista === v ? '#fff' : 'var(--text-secondary)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {v === 'dia' ? 'Día' : v === 'semana' ? 'Semana' : 'Macro día'}
            </button>
          ))}
        </div>

        <div className="responsive-toolbar" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button style={navBtnStyle}><ChevronLeft size={16} /></button>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', padding: '0 8px' }}>
              {vista === 'semana' ? 'Semana del 09 al 13/06' : 'Miércoles 11/06'}
            </span>
            <button style={navBtnStyle}><ChevronRight size={16} /></button>
          </div>
          <Button variant="primary" onClick={() => setModalNuevo(true)}>
            <Plus size={15} /> Nuevo turno
          </Button>
        </div>
      </div>

      {vista === 'dia' ? (
        <DiaView pacientes={pacientes} medicos={medicos} turnos={turnosHoy} onClickTurno={setDrawerTurno} />
      ) : vista === 'semana' ? (
        <SemanaView pacientes={pacientes} medicos={medicos} turnos={turnos} onClickTurno={setDrawerTurno} />
      ) : (
        <MacroDiaView pacientes={pacientes} medicos={medicos} turnos={turnosHoy} onClickTurno={setDrawerTurno} />
      )}

      {/* Drawer detalle */}
      <Drawer open={!!drawerTurno} onClose={() => setDrawerTurno(null)} title="Detalle de turno">
        {drawerTurno && drawerPaciente && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Avatar nombre={`${drawerPaciente.nombre} ${drawerPaciente.apellido}`} size={48} />
              <div>
                <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>
                  {drawerPaciente.nombre} {drawerPaciente.apellido}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {drawerPaciente.obraSocial}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Row label="Hora" value={drawerTurno.hora} />
              {drawerMedico && <Row label="Médico" value={`${drawerMedico.nombre} · ${drawerMedico.especialidad}`} />}
              <Row label="Motivo" value={drawerTurno.motivo} />
              <Row label="Estado" value={<Badge variant={drawerTurno.estado} />} />
              <Row label="Duración" value={`${drawerTurno.duracion} min`} />
              <Row label="Obra social" value={drawerPaciente.obraSocial} />
              <Row label="Teléfono" value={drawerPaciente.telefono} />
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Últimas consultas
              </div>
              {consultas
                .filter(c => c.pacienteId === drawerPaciente.id)
                .slice(0, 3)
                .map((c) => (
                  <div key={c.id} style={{ fontSize: '12px', color: 'var(--text-secondary)', padding: '4px 0' }}>
                    {c.fecha} — {c.motivo}
                  </div>
                ))}
              {consultas.filter(c => c.pacienteId === drawerPaciente.id).length === 0 && (
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Sin consultas previas registradas</div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Button variant="primary" style={{ justifyContent: 'center' }}>Iniciar consulta</Button>
              <Button variant="secondary" style={{ justifyContent: 'center' }}>Reprogramar</Button>
              <Button variant="destructive" style={{ justifyContent: 'center' }}>Cancelar turno</Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Modal nuevo turno */}
      <Modal open={modalNuevo} onClose={() => setModalNuevo(false)} title="Nuevo turno">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FormField label="Paciente">
            <select
              value={form.pacienteId}
              onChange={e => setForm(f => ({ ...f, pacienteId: e.target.value }))}
              style={selectStyle}
            >
              <option value="">Seleccionar paciente…</option>
              {pacientes.map(p => (
                <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
              ))}
            </select>
            {pacientes.length === 0 && (
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Primero cargá un paciente para asignarle un turno.
              </div>
            )}
          </FormField>

          <FormField label="Médico">
            <select
              value={form.medicoId || medicos[0]?.id || ''}
              onChange={e => setForm(f => ({ ...f, medicoId: e.target.value }))}
              style={selectStyle}
            >
              <option value="">Seleccionar médico…</option>
              {medicos.map(medico => (
                <option key={medico.id} value={medico.id}>
                  {medico.nombre} · {medico.especialidad}
                </option>
              ))}
            </select>
            {medicos.length === 0 && (
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Primero cargá un médico desde Configuración para asignarle turnos.
              </div>
            )}
          </FormField>

          <div className="responsive-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FormField label="Hora">
              <input
                type="time" value={form.hora}
                onChange={e => setForm(f => ({ ...f, hora: e.target.value }))}
                style={inputStyle}
              />
            </FormField>
            <FormField label="Duración">
              <select
                value={form.duracion}
                onChange={e => setForm(f => ({ ...f, duracion: e.target.value as '15' | '30' | '45' | '60' }))}
                style={selectStyle}
              >
                {['15', '30', '45', '60'].map(d => (
                  <option key={d} value={d}>{d} min</option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField label="Motivo">
            <input
              placeholder="Motivo de la consulta"
              value={form.motivo}
              onChange={e => setForm(f => ({ ...f, motivo: e.target.value }))}
              style={inputStyle}
            />
          </FormField>

          <FormField label="Obra social">
            <input
              placeholder="Obra social (opcional)"
              value={form.obraSocial}
              onChange={e => setForm(f => ({ ...f, obraSocial: e.target.value }))}
              style={inputStyle}
            />
          </FormField>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <Button variant="secondary" onClick={() => setModalNuevo(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleNuevoTurno}>Confirmar turno</Button>
          </div>
        </div>
      </Modal>

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

function DiaView({ pacientes, medicos, turnos, onClickTurno }: { pacientes: Paciente[]; medicos: Medico[]; turnos: Turno[]; onClickTurno: (t: Turno) => void }) {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{ position: 'relative' }}>
        {HORAS.map(hora => (
          <div
            key={hora}
            style={{
              display: 'grid', gridTemplateColumns: '64px 1fr',
              borderBottom: '1px solid var(--border-subtle)',
              minHeight: '48px',
            }}
          >
            <div style={{
              padding: '4px 12px', fontSize: '11px',
              color: 'var(--text-muted)', borderRight: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'flex-start',
            }}>
              {hora}
            </div>
            <div style={{ position: 'relative' }}>
              {turnos
                .filter(t => t.hora === hora)
                .map(turno => {
                  const p = pacientes.find(p => p.id === turno.pacienteId);
                  const medico = medicos.find(m => m.id === (turno.medicoId || medicos[0]?.id));
                  return (
                    <button
                      key={turno.id}
                      onClick={() => onClickTurno(turno)}
                      style={{
                        position: 'absolute', left: '4px', right: '4px', top: '4px',
                        background: estadoColors[turno.estado] || 'var(--border-subtle)',
                        border: `1px solid ${estadoBorders[turno.estado] || 'var(--border)'}`,
                        borderLeft: `4px solid ${medico?.color || estadoBorders[turno.estado] || 'var(--border)'}`,
                        borderRadius: '6px',
                        padding: '6px 10px', cursor: 'pointer', fontFamily: 'inherit',
                        textAlign: 'left',
                        height: `${(turno.duracion / 30) * 48 - 8}px`,
                        display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2px',
                      }}
                    >
                      <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {p?.nombre} {p?.apellido}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {turno.motivo}{medico ? ` · ${medico.especialidad}` : ''}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
        {turnos.length === 0 && (
          <EmptyState title="Sin turnos cargados" text="La agenda de este consultorio todavía está vacía." />
        )}
      </div>
    </div>
  );
}

function SemanaView({ pacientes, medicos, turnos, onClickTurno }: { pacientes: Paciente[]; medicos: Medico[]; turnos: Turno[]; onClickTurno: (t: Turno) => void }) {
  const diasFechas = ['2026-06-09', '2026-06-10', '2026-06-11', '2026-06-12', '2026-06-13'];

  return (
    <div className="card" style={{ overflow: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '64px repeat(5, 1fr)', minWidth: 700 }}>
        <div style={{ background: 'var(--surface-raised)', borderBottom: '1px solid var(--border)', padding: '8px' }} />
        {DIAS.map(dia => (
          <div key={dia} style={{
            background: 'var(--surface-raised)', borderBottom: '1px solid var(--border)',
            borderLeft: '1px solid var(--border-subtle)',
            padding: '8px 12px', fontSize: '12px', fontWeight: 500,
            color: dia === 'Mié 11' ? 'var(--blue)' : 'var(--text-secondary)',
            textAlign: 'center',
          }}>
            {dia}
          </div>
        ))}

        {HORAS.filter((_, i) => i % 2 === 0).map((hora) => (
          <React.Fragment key={hora}>
            <div style={{
              borderBottom: '1px solid var(--border-subtle)',
              padding: '4px 8px', fontSize: '11px', color: 'var(--text-muted)',
              minHeight: '48px', display: 'flex', alignItems: 'center',
            }}>
              {hora}
            </div>
            {diasFechas.map((fecha, di) => {
              const slotTurnos = turnos.filter(t => t.fecha === fecha && t.hora === hora);
              return (
                <div key={di} style={{
                  borderLeft: '1px solid var(--border-subtle)',
                  borderBottom: '1px solid var(--border-subtle)',
                  padding: '4px',
                  minHeight: '48px',
                }}>
                  {slotTurnos.map(t => {
                    const p = pacientes.find(pp => pp.id === t.pacienteId);
                    const medico = medicos.find(m => m.id === (t.medicoId || medicos[0]?.id));
                    return (
                      <button
                        key={t.id}
                        onClick={() => onClickTurno(t)}
                        style={{
                          background: estadoColors[t.estado],
                          border: `1px solid ${estadoBorders[t.estado] || 'var(--border)'}`,
                          borderLeft: `3px solid ${medico?.color || estadoBorders[t.estado] || 'var(--border)'}`,
                          borderRadius: '4px',
                          padding: '4px 6px', cursor: 'pointer', width: '100%',
                          textAlign: 'left', fontFamily: 'inherit',
                          fontSize: '11px', color: 'var(--text-primary)',
                          marginBottom: '2px',
                        }}
                      >
                        {t.hora} {p?.nombre} {p?.apellido?.charAt(0)}.
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function MacroDiaView({ pacientes, medicos, turnos, onClickTurno }: { pacientes: Paciente[]; medicos: Medico[]; turnos: Turno[]; onClickTurno: (t: Turno) => void }) {
  if (medicos.length === 0) {
    return (
      <div className="card" style={{ overflow: 'hidden' }}>
        <EmptyState
          title="Sin médicos cargados"
          text="Entrá a Configuración > Médicos para cargar profesionales y armar sus agendas."
        />
      </div>
    );
  }

  const minWidth = Math.max(760, 72 + medicos.length * 210);

  return (
    <div className="card" style={{ overflow: 'auto' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `72px repeat(${medicos.length}, minmax(190px, 1fr))`,
        minWidth,
      }}>
        <div style={{
          background: 'var(--surface-raised)',
          borderBottom: '1px solid var(--border)',
          padding: '10px 8px',
        }} />

        {medicos.map(medico => (
          <div
            key={medico.id}
            style={{
              background: 'var(--surface-raised)',
              borderBottom: '1px solid var(--border)',
              borderLeft: '1px solid var(--border-subtle)',
              padding: '10px 12px',
              minHeight: '58px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '3px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: medico.color, flexShrink: 0 }} />
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {medico.nombre}
              </span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{medico.especialidad}</span>
          </div>
        ))}

        {HORAS.map(hora => (
          <React.Fragment key={hora}>
            <div style={{
              borderBottom: '1px solid var(--border-subtle)',
              padding: '5px 8px',
              fontSize: '11px',
              color: 'var(--text-muted)',
              minHeight: '56px',
              display: 'flex',
              alignItems: 'center',
            }}>
              {hora}
            </div>

            {medicos.map(medico => {
              const disponible = isMedicoDisponible(medico, 'Mié', hora);
              const slotTurnos = turnos.filter(turno => (
                (turno.medicoId || medicos[0]?.id) === medico.id && turno.hora === hora
              ));

              return (
                <div
                  key={`${medico.id}-${hora}`}
                  style={{
                    borderLeft: '1px solid var(--border-subtle)',
                    borderBottom: '1px solid var(--border-subtle)',
                    padding: '5px',
                    minHeight: '56px',
                    background: disponible ? 'transparent' : 'var(--surface-raised)',
                  }}
                >
                  {slotTurnos.map(turno => {
                    const paciente = pacientes.find(p => p.id === turno.pacienteId);
                    return (
                      <button
                        key={turno.id}
                        onClick={() => onClickTurno(turno)}
                        style={{
                          background: estadoColors[turno.estado] || 'var(--border-subtle)',
                          border: `1px solid ${estadoBorders[turno.estado] || 'var(--border)'}`,
                          borderLeft: `3px solid ${medico.color}`,
                          borderRadius: '5px',
                          padding: '6px 7px',
                          cursor: 'pointer',
                          width: '100%',
                          textAlign: 'left',
                          fontFamily: 'inherit',
                          marginBottom: '4px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                        }}
                      >
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {paciente ? `${paciente.nombre} ${paciente.apellido}` : 'Paciente'}
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                          {turno.motivo}
                        </span>
                      </button>
                    );
                  })}
                  {slotTurnos.length === 0 && disponible && (
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Disponible</span>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function isMedicoDisponible(medico: Medico, dia: string, hora: string) {
  const horario = medico.horarios.find(h => h.dia === dia && h.activo);
  return !!horario && horario.desde <= hora && horario.hasta > hora;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>
      {children}
    </div>
  );
}

const navBtnStyle: React.CSSProperties = {
  background: 'var(--surface)', border: '1px solid var(--border)',
  borderRadius: '7px', padding: '6px', cursor: 'pointer',
  color: 'var(--text-secondary)', display: 'flex', alignItems: 'center',
  boxShadow: 'var(--shadow-sm)',
};

const inputStyle: React.CSSProperties = {
  background: 'var(--surface-raised)', border: '1px solid var(--border)',
  borderRadius: '8px', padding: '9px 12px',
  fontSize: '13px', color: 'var(--text-primary)',
  fontFamily: 'inherit', outline: 'none', width: '100%',
  boxSizing: 'border-box',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
};
