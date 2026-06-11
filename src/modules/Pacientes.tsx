import React, { useState } from 'react';
import { Search, Plus, ChevronRight } from 'lucide-react';
import { pacientes as pacientesIniciales, consultas, recetas, cobros } from '../data/mockData';
import { Paciente } from '../types';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { differenceInYears, parseISO } from 'date-fns';

type TabFicha = 'historia' | 'recetas' | 'cobros' | 'datos';

export function Pacientes() {
  const [pacientes, setPacientes] = useState(pacientesIniciales);
  const [query, setQuery] = useState('');
  const [fichaPaciente, setFichaPaciente] = useState<Paciente | null>(null);
  const [modalNuevo, setModalNuevo] = useState(false);
  const [tabFicha, setTabFicha] = useState<TabFicha>('historia');
  const [nuevoForm, setNuevoForm] = useState({
    nombre: '', apellido: '', dni: '', fechaNacimiento: '',
    obraSocial: '', telefono: '', email: '',
  });

  const filtrados = pacientes.filter(p => {
    const q = query.toLowerCase();
    return (
      `${p.nombre} ${p.apellido}`.toLowerCase().includes(q) ||
      p.dni.includes(q) ||
      p.obraSocial.toLowerCase().includes(q)
    );
  });

  const edad = (fn: string) => differenceInYears(new Date(), parseISO(fn));

  function handleNuevoPaciente() {
    if (!nuevoForm.nombre || !nuevoForm.apellido) return;
    const nuevo: Paciente = {
      id: `p-${Date.now()}`,
      nombre: nuevoForm.nombre,
      apellido: nuevoForm.apellido,
      dni: nuevoForm.dni,
      fechaNacimiento: nuevoForm.fechaNacimiento || '1990-01-01',
      obraSocial: nuevoForm.obraSocial,
      telefono: nuevoForm.telefono,
      email: nuevoForm.email || undefined,
      antecedentes: [],
      alergias: [],
      medicacionCronica: [],
    };
    setPacientes(prev => [...prev, nuevo]);
    setModalNuevo(false);
    setNuevoForm({ nombre: '', apellido: '', dni: '', fechaNacimiento: '', obraSocial: '', telefono: '', email: '' });
  }

  const consultasPaciente = fichaPaciente ? consultas.filter(c => c.pacienteId === fichaPaciente.id) : [];
  const recetasPaciente = fichaPaciente ? recetas.filter(r => r.pacienteId === fichaPaciente.id) : [];
  const cobrosPaciente = fichaPaciente ? cobros.filter(c => c.pacienteId === fichaPaciente.id) : [];

  if (fichaPaciente) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Header ficha */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setFichaPaciente(null)}
            style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '7px', padding: '7px 12px', cursor: 'pointer',
              fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'inherit',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            ← Volver
          </button>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 500, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Ficha del paciente
          </h1>
        </div>

        {/* Cabecera paciente */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '10px', padding: '24px',
          display: 'flex', alignItems: 'center', gap: '20px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <Avatar nombre={`${fichaPaciente.nombre} ${fichaPaciente.apellido}`} size={60} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', letterSpacing: '-0.02em' }}>
              {fichaPaciente.nombre} {fichaPaciente.apellido}
            </div>
            <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <span>{edad(fichaPaciente.fechaNacimiento)} años</span>
              <span>{fichaPaciente.obraSocial}</span>
              <span>{fichaPaciente.telefono}</span>
              {fichaPaciente.email && <span>{fichaPaciente.email}</span>}
            </div>
            {fichaPaciente.antecedentes.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                {fichaPaciente.antecedentes.map(a => (
                  <span key={a} style={{
                    background: 'var(--blue-bg)', color: 'var(--blue)',
                    border: '1px solid var(--blue-border)',
                    borderRadius: '5px', padding: '2px 8px', fontSize: '11px',
                  }}>{a}</span>
                ))}
                {fichaPaciente.alergias.map(a => (
                  <span key={a} style={{
                    background: 'var(--red-bg)', color: 'var(--red)',
                    border: '1px solid var(--red-border)',
                    borderRadius: '5px', padding: '2px 8px', fontSize: '11px',
                  }}>Alergia: {a}</span>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Button variant="primary" size="sm"><Plus size={14} /> Nueva consulta</Button>
            <Button variant="secondary" size="sm">Nueva receta</Button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--border)' }}>
          {([
            { id: 'historia', label: 'Historia Clínica' },
            { id: 'recetas', label: 'Recetas' },
            { id: 'cobros', label: 'Cobros' },
            { id: 'datos', label: 'Datos Personales' },
          ] as { id: TabFicha; label: string }[]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setTabFicha(tab.id)}
              style={{
                padding: '10px 16px', fontSize: '13px', fontWeight: tabFicha === tab.id ? 600 : 400,
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit',
                borderBottom: tabFicha === tab.id ? '2px solid var(--blue)' : '2px solid transparent',
                color: tabFicha === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                marginBottom: '-1px',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tabFicha === 'historia' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {consultasPaciente.length === 0 && <EmptyState text="Sin consultas registradas" />}
            {consultasPaciente.map(c => (
              <div key={c.id} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '10px', padding: '20px',
                display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--blue)' }}>{c.fecha}</div>
                  {c.cie10 && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>CIE-10: {c.cie10}</div>}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>{c.motivo}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{c.diagnostico}</div>
                  {c.examenFisico && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      {c.examenFisico.ta && <Vitals label="TA" value={c.examenFisico.ta} />}
                      {c.examenFisico.fc && <Vitals label="FC" value={`${c.examenFisico.fc} lpm`} />}
                      {c.examenFisico.temp && <Vitals label="Temp" value={`${c.examenFisico.temp}°C`} />}
                      {c.examenFisico.peso && <Vitals label="Peso" value={`${c.examenFisico.peso} kg`} />}
                    </div>
                  )}
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{c.indicaciones}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tabFicha === 'recetas' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recetasPaciente.length === 0 && <EmptyState text="Sin recetas" />}
            {recetasPaciente.map(r => (
              <div key={r.id} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '10px', padding: '20px', boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{r.fecha}</span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {r.esCronica && (
                      <span style={{ fontSize: '10px', color: 'var(--blue)', background: 'var(--blue-bg)', border: '1px solid var(--blue-border)', borderRadius: '5px', padding: '2px 8px' }}>
                        Crónica
                      </span>
                    )}
                    <Badge variant={r.estado} />
                  </div>
                </div>
                {r.medicamentos.map((m, i) => (
                  <div key={i} style={{ fontSize: '13px', color: 'var(--text-primary)', padding: '4px 0' }}>
                    <strong>{m.nombre}</strong> {m.dosis} — {m.posologia}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {tabFicha === 'cobros' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {cobrosPaciente.length === 0 && <EmptyState text="Sin cobros" />}
            {cobrosPaciente.map(c => (
              <div key={c.id} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '16px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{c.fecha}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{c.obraSocial}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, fontVariantNumeric: 'tabular-nums', color: 'var(--text-primary)' }}>
                    ${c.monto.toLocaleString('es-AR')}
                  </span>
                  <Badge variant={c.estado} />
                </div>
              </div>
            ))}
          </div>
        )}

        {tabFicha === 'datos' && (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: '10px', padding: '24px',
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px',
            boxShadow: 'var(--shadow-sm)',
          }}>
            {[
              { label: 'Nombre completo', value: `${fichaPaciente.nombre} ${fichaPaciente.apellido}` },
              { label: 'DNI', value: fichaPaciente.dni },
              { label: 'Fecha de nacimiento', value: fichaPaciente.fechaNacimiento },
              { label: 'Edad', value: `${edad(fichaPaciente.fechaNacimiento)} años` },
              { label: 'Obra social', value: fichaPaciente.obraSocial },
              { label: 'Nro afiliado', value: fichaPaciente.nroAfiliado || '—' },
              { label: 'Teléfono', value: fichaPaciente.telefono },
              { label: 'Email', value: fichaPaciente.email || '—' },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{value}</div>
              </div>
            ))}
            {fichaPaciente.medicacionCronica.length > 0 && (
              <div style={{ gridColumn: '1/-1' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Medicación crónica</div>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{fichaPaciente.medicacionCronica.join(', ')}</div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={15} style={{
            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
          }} />
          <input
            placeholder="Buscar por nombre, DNI u obra social…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              width: '100%', paddingLeft: '36px', paddingRight: '12px',
              paddingTop: '9px', paddingBottom: '9px',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '8px', fontSize: '13px', color: 'var(--text-primary)',
              fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
              boxShadow: 'var(--shadow-sm)',
            }}
          />
        </div>
        <Button variant="primary" onClick={() => setModalNuevo(true)}>
          <Plus size={15} /> Nuevo paciente
        </Button>
      </div>

      {/* Tabla */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '10px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 60px 140px 120px 80px 40px',
          padding: '10px 20px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface-raised)',
        }}>
          {['Paciente', 'Edad', 'Obra social', 'Última consulta', 'Consultas', ''].map(h => (
            <span key={h} style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {h}
            </span>
          ))}
        </div>

        {filtrados.map(p => {
          const consultasP = consultas.filter(c => c.pacienteId === p.id);
          const ultima = consultasP.sort((a, b) => b.fecha.localeCompare(a.fecha))[0];
          return (
            <button
              key={p.id}
              onClick={() => setFichaPaciente(p)}
              style={{
                display: 'grid', gridTemplateColumns: '2fr 60px 140px 120px 80px 40px',
                padding: '13px 20px', width: '100%', textAlign: 'left',
                background: 'none', border: 'none', borderBottom: '1px solid var(--border-subtle)',
                cursor: 'pointer', fontFamily: 'inherit', alignItems: 'center',
                transition: 'background 140ms ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-raised)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Avatar nombre={`${p.nombre} ${p.apellido}`} size={30} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {p.nombre} {p.apellido}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.dni}</div>
                </div>
              </div>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{edad(p.fechaNacimiento)}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{p.obraSocial}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{ultima?.fecha ?? '—'}</span>
              <span style={{ fontSize: '13px', fontVariantNumeric: 'tabular-nums', color: 'var(--text-primary)' }}>{consultasP.length}</span>
              <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
            </button>
          );
        })}
      </div>

      {/* Modal nuevo paciente */}
      <Modal open={modalNuevo} onClose={() => setModalNuevo(false)} title="Nuevo paciente">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FormField label="Nombre">
              <input placeholder="Juan" value={nuevoForm.nombre} onChange={e => setNuevoForm(f => ({ ...f, nombre: e.target.value }))} style={inputSt} />
            </FormField>
            <FormField label="Apellido">
              <input placeholder="García" value={nuevoForm.apellido} onChange={e => setNuevoForm(f => ({ ...f, apellido: e.target.value }))} style={inputSt} />
            </FormField>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FormField label="DNI">
              <input placeholder="12.345.678" value={nuevoForm.dni} onChange={e => setNuevoForm(f => ({ ...f, dni: e.target.value }))} style={inputSt} />
            </FormField>
            <FormField label="Fecha de nacimiento">
              <input type="date" value={nuevoForm.fechaNacimiento} onChange={e => setNuevoForm(f => ({ ...f, fechaNacimiento: e.target.value }))} style={inputSt} />
            </FormField>
          </div>
          <FormField label="Obra social">
            <input placeholder="OSDE, Swiss Medical, Particular…" value={nuevoForm.obraSocial} onChange={e => setNuevoForm(f => ({ ...f, obraSocial: e.target.value }))} style={inputSt} />
          </FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FormField label="Teléfono">
              <input placeholder="11-1234-5678" value={nuevoForm.telefono} onChange={e => setNuevoForm(f => ({ ...f, telefono: e.target.value }))} style={inputSt} />
            </FormField>
            <FormField label="Email">
              <input placeholder="email@ejemplo.com" value={nuevoForm.email} onChange={e => setNuevoForm(f => ({ ...f, email: e.target.value }))} style={inputSt} />
            </FormField>
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <Button variant="secondary" onClick={() => setModalNuevo(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleNuevoPaciente}>Guardar paciente</Button>
          </div>
        </div>
      </Modal>
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

function Vitals({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)',
      borderRadius: '6px', padding: '4px 8px',
      fontSize: '11px',
    }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}: </span>
      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
      {text}
    </div>
  );
}

const inputSt: React.CSSProperties = {
  background: 'var(--surface-raised)', border: '1px solid var(--border)',
  borderRadius: '8px', padding: '9px 12px',
  fontSize: '13px', color: 'var(--text-primary)',
  fontFamily: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box',
};
