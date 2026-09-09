import React, { useRef, useState } from 'react';
import { Clock, Image as ImageIcon, Plus, Trash2, Upload, UserRound } from 'lucide-react';
import { createDefaultHorarios, DIAS_ATENCION, useClinicData } from '../context/ClinicDataContext';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast, Toast } from '../components/ui/Toast';
import type { HorarioAtencion } from '../types';

type TabConf = 'consultorio' | 'medico' | 'medicos' | 'agenda' | 'notificaciones' | 'plan';

const DIAS_SEMANA = DIAS_ATENCION;
const HORAS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
const COLORES_MEDICO = ['var(--blue)', 'var(--green)', 'var(--purple)', 'var(--amber)', 'var(--red)'];
const NUEVO_MEDICO_INICIAL = {
  nombre: '',
  especialidad: '',
  matricula: '',
  email: '',
  telefono: '',
  color: 'var(--blue)',
};

const planesData = [
  { nombre: 'Básico', precio: '$29/mes', features: ['1 médico', 'Hasta 500 turnos/mes', 'Historia clínica', 'Recetas básicas'] },
  { nombre: 'Pro', precio: '$59/mes', features: ['3 médicos', 'Turnos ilimitados', 'Estadísticas avanzadas', 'WhatsApp automático', 'Facturación electrónica'], destacado: true },
  { nombre: 'Clínica', precio: '$129/mes', features: ['Médicos ilimitados', 'Multi-consultorio', 'API personalizada', 'Soporte prioritario', 'Integración obras sociales'] },
];

export function Configuracion() {
  const { medicoInfo, medicos, logoUrl, setLogoUrl, addMedico, updateMedicoHorarios } = useClinicData();
  const [tab, setTab] = useState<TabConf>('consultorio');
  const [modalPlan, setModalPlan] = useState(false);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  const [consultorioForm, setConsultorioForm] = useState({
    nombre: medicoInfo.consultorio,
    direccion: medicoInfo.direccion,
    telefono: medicoInfo.telefono,
    especialidad: medicoInfo.especialidad,
  });

  const [medicoForm, setMedicoForm] = useState({
    nombre: medicoInfo.nombre,
    matriculaNacional: medicoInfo.matriculaNacional,
    matriculaProvincial: medicoInfo.matriculaProvincial,
    especialidad: medicoInfo.especialidad,
  });

  const [agendaForm, setAgendaForm] = useState({
    duracionDefault: '30',
    buffer: '5',
  });

  const [notifForm, setNotifForm] = useState({
    whatsapp: true,
    horasAntes: '24',
    seguimiento: true,
  });

  const [nuevoMedico, setNuevoMedico] = useState(NUEVO_MEDICO_INICIAL);
  const [logoNombre, setLogoNombre] = useState('');

  const [horariosActivos, setHorariosActivos] = useState<Record<string, Set<string>>>(
    Object.fromEntries(DIAS_SEMANA.map(d => [d, new Set<string>(
      d !== 'Sáb' ? HORAS.slice(0, 8) : []
    )]))
  );

  function toggleHorario(dia: string, hora: string) {
    setHorariosActivos(prev => {
      const set = new Set(prev[dia]);
      if (set.has(hora)) set.delete(hora);
      else set.add(hora);
      return { ...prev, [dia]: set };
    });
  }

  function handleGuardar() {
    addToast('Configuración guardada', 'success');
  }

  function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Subí un archivo de imagen válido', 'error');
      return;
    }

    if (file.size > 1_500_000) {
      addToast('Usá una imagen de hasta 1.5 MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setLogoUrl(String(reader.result));
      setLogoNombre(file.name);
      addToast('Logo actualizado', 'success');
    };
    reader.onerror = () => addToast('No se pudo leer el logo', 'error');
    reader.readAsDataURL(file);
  }

  function handleQuitarLogo() {
    setLogoUrl(null);
    setLogoNombre('');
    if (logoInputRef.current) logoInputRef.current.value = '';
    addToast('Logo quitado', 'info');
  }

  function handleAgregarMedico() {
    const nombre = nuevoMedico.nombre.trim();
    const especialidad = nuevoMedico.especialidad.trim();

    if (!nombre || !especialidad) {
      addToast('Completá nombre y especialidad del médico', 'error');
      return;
    }

    addMedico({
      nombre,
      especialidad,
      matricula: nuevoMedico.matricula.trim(),
      email: nuevoMedico.email.trim(),
      telefono: nuevoMedico.telefono.trim(),
      color: nuevoMedico.color,
      horarios: createDefaultHorarios(),
    });
    setNuevoMedico(NUEVO_MEDICO_INICIAL);
    addToast('Médico agregado a la agenda', 'success');
  }

  function updateHorarioMedico(medicoId: string, dia: string, cambios: Partial<HorarioAtencion>) {
    const medico = medicos.find(m => m.id === medicoId);
    if (!medico) return;

    updateMedicoHorarios(
      medicoId,
      medico.horarios.map(horario => (
        horario.dia === dia ? { ...horario, ...cambios } : horario
      )),
    );
  }

  const tabs: { id: TabConf; label: string }[] = [
    { id: 'consultorio', label: 'Consultorio' },
    { id: 'medico', label: 'Médico' },
    { id: 'medicos', label: 'Médicos' },
    { id: 'agenda', label: 'Agenda' },
    { id: 'notificaciones', label: 'Notificaciones' },
    { id: 'plan', label: 'Plan' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--border)' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '10px 16px', fontSize: '13px', fontWeight: tab === t.id ? 600 : 400,
              background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              borderBottom: tab === t.id ? '2px solid var(--blue)' : '2px solid transparent',
              color: tab === t.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              marginBottom: '-1px',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Consultorio */}
      {tab === 'consultorio' && (
        <div className="card" style={cardSt}>
          <h3 style={h3St}>Datos del consultorio</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <FormField label="Nombre del consultorio">
              <input value={consultorioForm.nombre} onChange={e => setConsultorioForm(f => ({ ...f, nombre: e.target.value }))} style={inpSt} />
            </FormField>
            <FormField label="Especialidad">
              <input value={consultorioForm.especialidad} onChange={e => setConsultorioForm(f => ({ ...f, especialidad: e.target.value }))} style={inpSt} />
            </FormField>
            <FormField label="Teléfono">
              <input value={consultorioForm.telefono} onChange={e => setConsultorioForm(f => ({ ...f, telefono: e.target.value }))} style={inpSt} />
            </FormField>
          </div>
          <FormField label="Dirección">
            <input value={consultorioForm.direccion} onChange={e => setConsultorioForm(f => ({ ...f, direccion: e.target.value }))} style={inpSt} />
          </FormField>
          <FormField label="Logo del encabezado">
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleLogoChange}
              style={{ display: 'none' }}
            />
            <div style={{
              background: 'var(--surface-raised)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}>
              <div style={{
                width: '58px',
                height: '58px',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0,
              }}>
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo del consultorio"
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px', boxSizing: 'border-box' }}
                  />
                ) : (
                  <ImageIcon size={22} color="var(--text-muted)" />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '3px' }}>
                  {logoNombre || (logoUrl ? 'Logo cargado' : 'Sin logo cargado')}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  PNG, JPG, WebP o SVG · hasta 1.5 MB
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <Button type="button" variant="secondary" onClick={() => logoInputRef.current?.click()}>
                  <Upload size={14} /> Subir
                </Button>
                {logoUrl && (
                  <Button type="button" variant="ghost" onClick={handleQuitarLogo}>
                    <Trash2 size={14} /> Quitar
                  </Button>
                )}
              </div>
            </div>
          </FormField>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" onClick={handleGuardar}>Guardar cambios</Button>
          </div>
        </div>
      )}

      {/* Médico */}
      {tab === 'medico' && (
        <div className="card" style={cardSt}>
          <h3 style={h3St}>Datos del médico</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <FormField label="Nombre completo">
              <input value={medicoForm.nombre} onChange={e => setMedicoForm(f => ({ ...f, nombre: e.target.value }))} style={inpSt} />
            </FormField>
            <FormField label="Especialidad">
              <input value={medicoForm.especialidad} onChange={e => setMedicoForm(f => ({ ...f, especialidad: e.target.value }))} style={inpSt} />
            </FormField>
            <FormField label="Matrícula Nacional">
              <input value={medicoForm.matriculaNacional} onChange={e => setMedicoForm(f => ({ ...f, matriculaNacional: e.target.value }))} style={inpSt} />
            </FormField>
            <FormField label="Matrícula Provincial">
              <input value={medicoForm.matriculaProvincial} onChange={e => setMedicoForm(f => ({ ...f, matriculaProvincial: e.target.value }))} style={inpSt} />
            </FormField>
          </div>
          <FormField label="Firma (se imprime en recetas)">
            <div style={{
              background: 'var(--surface-raised)', border: '1px solid var(--border)',
              borderRadius: '8px', padding: '16px',
              fontStyle: 'italic', fontSize: '16px', color: 'var(--text-primary)',
            }}>
              {medicoForm.nombre}
            </div>
          </FormField>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" onClick={handleGuardar}>Guardar cambios</Button>
          </div>
        </div>
      )}

      {/* Médicos */}
      {tab === 'medicos' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px',
          alignItems: 'start',
        }}>
          <div className="card" style={cardSt}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserRound size={17} color="var(--blue)" />
              <h3 style={h3St}>Alta de médicos</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <FormField label="Nombre completo">
                <input
                  value={nuevoMedico.nombre}
                  onChange={e => setNuevoMedico(f => ({ ...f, nombre: e.target.value }))}
                  placeholder="Ej. Dra. Ana Pérez"
                  style={inpSt}
                />
              </FormField>
              <FormField label="Especialidad">
                <input
                  value={nuevoMedico.especialidad}
                  onChange={e => setNuevoMedico(f => ({ ...f, especialidad: e.target.value }))}
                  placeholder="Ej. Dermatología"
                  style={inpSt}
                />
              </FormField>
              <FormField label="Matrícula">
                <input
                  value={nuevoMedico.matricula}
                  onChange={e => setNuevoMedico(f => ({ ...f, matricula: e.target.value }))}
                  placeholder="MN 00.000"
                  style={inpSt}
                />
              </FormField>
              <FormField label="Teléfono">
                <input
                  value={nuevoMedico.telefono}
                  onChange={e => setNuevoMedico(f => ({ ...f, telefono: e.target.value }))}
                  placeholder="11-0000-0000"
                  style={inpSt}
                />
              </FormField>
            </div>

            <FormField label="Email">
              <input
                value={nuevoMedico.email}
                onChange={e => setNuevoMedico(f => ({ ...f, email: e.target.value }))}
                placeholder="medico@consultorio.com"
                style={inpSt}
              />
            </FormField>

            <FormField label="Color en agenda">
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {COLORES_MEDICO.map(color => (
                  <button
                    key={color}
                    aria-label={`Elegir color ${color}`}
                    onClick={() => setNuevoMedico(f => ({ ...f, color }))}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      background: color,
                      border: nuevoMedico.color === color ? '2px solid var(--text-primary)' : '2px solid var(--border)',
                      boxShadow: nuevoMedico.color === color ? '0 0 0 3px var(--blue-bg)' : 'none',
                    }}
                  />
                ))}
              </div>
            </FormField>

            <Button variant="primary" onClick={handleAgregarMedico} style={{ justifyContent: 'center' }}>
              <Plus size={15} /> Agregar médico
            </Button>
          </div>

          <div className="card" style={cardSt}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={17} color="var(--blue)" />
              <h3 style={h3St}>Agenda por médico</h3>
            </div>

            {medicos.length === 0 ? (
              <EmptyState
                title="Sin médicos cargados"
                text="Agregá un médico para definir sus horarios y verlo en la agenda macro."
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {medicos.map(medico => (
                  <div
                    key={medico.id}
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      background: 'var(--surface)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: medico.color, flexShrink: 0 }} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {medico.nombre}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {medico.especialidad}{medico.matricula ? ` · ${medico.matricula}` : ''}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {medico.email || medico.telefono || 'Sin contacto'}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '8px' }}>
                      {medico.horarios.map(horario => (
                        <div
                          key={horario.dia}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '34px 1fr 1fr 34px',
                            gap: '8px',
                            alignItems: 'center',
                            padding: '8px',
                            borderRadius: '7px',
                            border: '1px solid var(--border-subtle)',
                            background: horario.activo ? 'var(--surface-raised)' : 'transparent',
                          }}
                        >
                          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                            {horario.dia}
                          </span>
                          <input
                            type="time"
                            value={horario.desde}
                            disabled={!horario.activo}
                            onChange={e => updateHorarioMedico(medico.id, horario.dia, { desde: e.target.value })}
                            style={miniInputSt}
                          />
                          <input
                            type="time"
                            value={horario.hasta}
                            disabled={!horario.activo}
                            onChange={e => updateHorarioMedico(medico.id, horario.dia, { hasta: e.target.value })}
                            style={miniInputSt}
                          />
                          <button
                            aria-label={`Activar ${horario.dia}`}
                            onClick={() => updateHorarioMedico(medico.id, horario.dia, { activo: !horario.activo })}
                            style={{
                              width: '32px',
                              height: '20px',
                              borderRadius: '10px',
                              border: 'none',
                              background: horario.activo ? 'var(--blue)' : 'var(--border)',
                              cursor: 'pointer',
                              position: 'relative',
                            }}
                          >
                            <span style={{
                              width: '14px',
                              height: '14px',
                              borderRadius: '50%',
                              background: '#fff',
                              position: 'absolute',
                              top: '3px',
                              left: horario.activo ? '15px' : '3px',
                              transition: 'left 120ms ease',
                            }} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Agenda */}
      {tab === 'agenda' && (
        <div className="card" style={cardSt}>
          <h3 style={h3St}>Configuración de agenda</h3>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <FormField label="Duración default de consulta">
              <select value={agendaForm.duracionDefault} onChange={e => setAgendaForm(f => ({ ...f, duracionDefault: e.target.value }))} style={{ ...inpSt, width: '160px' }}>
                {['15', '20', '30', '45', '60'].map(v => <option key={v} value={v}>{v} min</option>)}
              </select>
            </FormField>
            <FormField label="Buffer entre turnos">
              <select value={agendaForm.buffer} onChange={e => setAgendaForm(f => ({ ...f, buffer: e.target.value }))} style={{ ...inpSt, width: '160px' }}>
                {['0', '5', '10', '15'].map(v => <option key={v} value={v}>{v} min</option>)}
              </select>
            </FormField>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Horarios de atención
            </div>
            <div style={{ overflowX: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: `60px repeat(${HORAS.length}, 1fr)`, gap: '3px', minWidth: 600 }}>
                <div />
                {HORAS.map(h => (
                  <div key={h} style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center' }}>{h.slice(0, 5)}</div>
                ))}
                {DIAS_SEMANA.map(dia => (
                  <React.Fragment key={dia}>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>{dia}</div>
                    {HORAS.map(hora => {
                      const activo = horariosActivos[dia]?.has(hora);
                      return (
                        <button
                          key={hora}
                          onClick={() => toggleHorario(dia, hora)}
                          style={{
                            height: '24px', borderRadius: '4px', cursor: 'pointer',
                            background: activo ? 'var(--blue-bg)' : 'var(--surface-raised)',
                            border: activo ? '1px solid var(--blue-border)' : '1px solid var(--border-subtle)',
                            transition: 'all 120ms ease',
                          }}
                        />
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
              Click en cada celda para activar/desactivar el horario
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" onClick={handleGuardar}>Guardar cambios</Button>
          </div>
        </div>
      )}

      {/* Notificaciones */}
      {tab === 'notificaciones' && (
        <div className="card" style={cardSt}>
          <h3 style={h3St}>Notificaciones automáticas</h3>

          <Toggle
            label="Recordatorio por WhatsApp"
            sublabel="Envía recordatorio automático antes del turno"
            value={notifForm.whatsapp}
            onChange={v => setNotifForm(f => ({ ...f, whatsapp: v }))}
          />

          {notifForm.whatsapp && (
            <FormField label="Enviar recordatorio con cuánta anticipación">
              <select
                value={notifForm.horasAntes}
                onChange={e => setNotifForm(f => ({ ...f, horasAntes: e.target.value }))}
                style={{ ...inpSt, width: '200px' }}
              >
                <option value="12">12 horas antes</option>
                <option value="24">24 horas antes</option>
                <option value="48">48 horas antes</option>
              </select>
            </FormField>
          )}

          <Toggle
            label="Recordatorio de seguimiento"
            sublabel="Notifica al paciente cuando se acerca la fecha de próximo control"
            value={notifForm.seguimiento}
            onChange={v => setNotifForm(f => ({ ...f, seguimiento: v }))}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" onClick={handleGuardar}>Guardar cambios</Button>
          </div>
        </div>
      )}

      {/* Plan */}
      {tab === 'plan' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="card" style={{
            ...cardSt,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Plan Básico · $29 USD/mes
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Próximo cobro: 11/07/2026 · federicomatias72@gmail.com
              </div>
            </div>
            <Button variant="primary" onClick={() => setModalPlan(true)}>Ver planes</Button>
          </div>

          <div className="card" style={cardSt}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Incluido en tu plan
            </div>
            {['1 médico', 'Hasta 500 turnos/mes', 'Historia clínica completa', 'Recetas digitales', 'Facturación básica'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', fontSize: '13px', color: 'var(--text-primary)' }}>
                <span style={{ color: 'var(--green)', fontWeight: 600 }}>✓</span> {f}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal planes */}
      <Modal open={modalPlan} onClose={() => setModalPlan(false)} title="Elegir plan" maxWidth={720}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          {planesData.map(p => (
            <div
              key={p.nombre}
              style={{
                background: p.destacado ? 'var(--blue-bg)' : 'var(--surface-raised)',
                border: `1px solid ${p.destacado ? 'var(--blue-border)' : 'var(--border)'}`,
                borderRadius: '10px', padding: '20px',
                display: 'flex', flexDirection: 'column', gap: '12px',
              }}
            >
              <div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{p.nombre}</div>
                <div style={{ fontSize: '20px', fontWeight: 600, color: p.destacado ? 'var(--blue)' : 'var(--text-primary)', marginTop: '4px', letterSpacing: '-0.02em' }}>{p.precio}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--green)', fontWeight: 600 }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <Button
                variant={p.destacado ? 'primary' : 'secondary'}
                style={{ marginTop: 'auto' }}
                onClick={() => { setModalPlan(false); addToast(`Cambiaste al plan ${p.nombre}`, 'success'); }}
              >
                {p.nombre === 'Básico' ? 'Plan actual' : `Cambiar a ${p.nombre}`}
              </Button>
            </div>
          ))}
        </div>
      </Modal>

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

function Toggle({ label, sublabel, value, onChange }: {
  label: string; sublabel: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
      <div>
        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{label}</div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{sublabel}</div>
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: '42px', height: '22px', borderRadius: '11px', border: 'none',
          background: value ? 'var(--blue)' : 'var(--border)',
          cursor: 'pointer', position: 'relative', transition: 'background 150ms ease', flexShrink: 0,
        }}
      >
        <div style={{
          width: '16px', height: '16px', borderRadius: '50%', background: 'white',
          position: 'absolute', top: '3px',
          left: value ? '23px' : '3px',
          transition: 'left 150ms ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }} />
      </button>
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

const cardSt: React.CSSProperties = {
  padding: '24px',
  display: 'flex', flexDirection: 'column', gap: '16px',
};

const h3St: React.CSSProperties = {
  margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em',
};

const inpSt: React.CSSProperties = {
  background: 'var(--surface-raised)', border: '1px solid var(--border)',
  borderRadius: '8px', padding: '9px 12px',
  fontSize: '13px', color: 'var(--text-primary)',
  fontFamily: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box',
};

const miniInputSt: React.CSSProperties = {
  ...inpSt,
  padding: '6px 8px',
  fontSize: '11px',
};
