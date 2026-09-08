import React, { useState } from 'react';
import { ArrowRight, Building2, Check, LockKeyhole, Mail, Stethoscope, UserRound } from 'lucide-react';
import { Button } from '../components/ui/Button';

export interface AuthSession {
  medico: string;
  email: string;
  consultorio: string;
  especialidad: string;
  iniciales: string;
}

type AuthMode = 'login' | 'alta';

const inputSt: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  background: 'var(--surface-raised)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  color: 'var(--text-primary)',
  fontFamily: 'inherit',
  fontSize: '13px',
  outline: 'none',
  padding: '10px 12px',
};

const labelSt: React.CSSProperties = {
  color: 'var(--text-secondary)',
  fontSize: '12px',
  fontWeight: 500,
};

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map(part => part[0]?.toUpperCase()).join('');
  return initials || 'CM';
}

export function Auth({ onAuth }: { onAuth: (session: AuthSession) => void }) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loginForm, setLoginForm] = useState({
    email: 'mgarcia@centromedicobelgrano.com',
    password: 'demo123',
  });
  const [altaForm, setAltaForm] = useState({
    consultorio: 'Centro Médico Belgrano',
    especialidad: 'Clínica Médica',
    direccion: 'Av. Cabildo 1425 Piso 2 Of. 8, CABA',
    telefono: '11-4789-3300',
    medico: 'Dra. María García',
    email: 'mgarcia@centromedicobelgrano.com',
    matricula: 'MN 98.765',
    password: 'demo123',
  });

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    onAuth({
      medico: 'Dra. María García',
      email: loginForm.email,
      consultorio: 'Centro Médico Belgrano',
      especialidad: 'Clínica Médica',
      iniciales: 'MG',
    });
  }

  function handleAlta(e: React.FormEvent) {
    e.preventDefault();
    onAuth({
      medico: altaForm.medico,
      email: altaForm.email,
      consultorio: altaForm.consultorio,
      especialidad: altaForm.especialidad,
      iniciales: initialsFromName(altaForm.medico),
    });
  }

  return (
    <main className="auth-shell" style={{
      minHeight: '100vh',
      background: 'var(--canvas)',
      color: 'var(--text-primary)',
      display: 'grid',
      gridTemplateColumns: 'minmax(320px, 440px) minmax(360px, 1fr)',
    }}>
      <section className="auth-hero" style={{
        borderRight: '1px solid var(--border)',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, transparent 60%), var(--surface)',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '8px',
            background: 'var(--blue)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
          }}>
            <Stethoscope size={18} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '-0.02em' }}>Centro Médico Belgrano</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Gestión clínica privada</div>
          </div>
        </div>

        <div>
          <div className="section-label" style={{ marginBottom: '14px' }}>Acceso profesional</div>
          <h1 style={{
            margin: 0,
            color: 'var(--text-primary)',
            fontSize: '34px',
            lineHeight: 1.05,
            fontWeight: 700,
            letterSpacing: '-0.04em',
            maxWidth: 340,
          }}>
            Consultorio, agenda e historia clínica en una sola vista.
          </h1>
          <p style={{
            margin: '16px 0 0',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            lineHeight: 1.6,
            maxWidth: 340,
          }}>
            Demo funcional para médicos: turnos, pacientes, recetas, cobros y configuración del consultorio.
          </p>
        </div>

        <div style={{ display: 'grid', gap: '10px' }}>
          {[
            'Agenda diaria y semanal',
            'Alta de consultorio integrada',
            'Acceso seguro para profesionales',
          ].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '12px' }}>
              <span style={{
                width: 18, height: 18, borderRadius: '6px',
                background: 'var(--green-bg)',
                border: '1px solid var(--green-border)',
                color: 'var(--green)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Check size={12} />
              </span>
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="auth-panel-wrap" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
      }}>
        <div className="card anim-fade-up" style={{
          width: '100%',
          maxWidth: mode === 'login' ? 420 : 760,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4px',
            padding: '4px',
            background: 'var(--surface-raised)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '9px',
          }}>
            <button onClick={() => setMode('login')} style={tabSt(mode === 'login')}>Ingresar</button>
            <button onClick={() => setMode('alta')} style={tabSt(mode === 'alta')}>Alta consultorio</button>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h2 style={titleSt}>Ingresar</h2>
                <p style={copySt}>Accedé con el usuario demo o tus credenciales del consultorio.</p>
              </div>
              <Field label="Email" icon={<Mail size={14} />}>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                  style={inputSt}
                  required
                />
              </Field>
              <Field label="Contraseña" icon={<LockKeyhole size={14} />}>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                  style={inputSt}
                  required
                />
              </Field>
              <Button variant="primary" size="lg" style={{ justifyContent: 'center', width: '100%' }}>
                Entrar <ArrowRight size={15} />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleAlta} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <h2 style={titleSt}>Alta de consultorio</h2>
                <p style={copySt}>Creá el espacio de trabajo con los datos principales del consultorio y del médico responsable.</p>
              </div>

              <div className="auth-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <Field label="Nombre del consultorio" icon={<Building2 size={14} />}>
                  <input value={altaForm.consultorio} onChange={e => setAltaForm(f => ({ ...f, consultorio: e.target.value }))} style={inputSt} required />
                </Field>
                <Field label="Especialidad principal">
                  <input value={altaForm.especialidad} onChange={e => setAltaForm(f => ({ ...f, especialidad: e.target.value }))} style={inputSt} required />
                </Field>
                <Field label="Dirección">
                  <input value={altaForm.direccion} onChange={e => setAltaForm(f => ({ ...f, direccion: e.target.value }))} style={inputSt} required />
                </Field>
                <Field label="Teléfono">
                  <input value={altaForm.telefono} onChange={e => setAltaForm(f => ({ ...f, telefono: e.target.value }))} style={inputSt} required />
                </Field>
                <Field label="Médico responsable" icon={<UserRound size={14} />}>
                  <input value={altaForm.medico} onChange={e => setAltaForm(f => ({ ...f, medico: e.target.value }))} style={inputSt} required />
                </Field>
                <Field label="Matrícula">
                  <input value={altaForm.matricula} onChange={e => setAltaForm(f => ({ ...f, matricula: e.target.value }))} style={inputSt} required />
                </Field>
                <Field label="Email de acceso" icon={<Mail size={14} />}>
                  <input type="email" value={altaForm.email} onChange={e => setAltaForm(f => ({ ...f, email: e.target.value }))} style={inputSt} required />
                </Field>
                <Field label="Contraseña" icon={<LockKeyhole size={14} />}>
                  <input type="password" value={altaForm.password} onChange={e => setAltaForm(f => ({ ...f, password: e.target.value }))} style={inputSt} required />
                </Field>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '16px',
              }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px', lineHeight: 1.5 }}>
                  Los datos quedan simulados en memoria para esta POC.
                </div>
                <Button variant="primary" size="lg">
                  Crear consultorio <ArrowRight size={15} />
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <span style={{ ...labelSt, display: 'flex', alignItems: 'center', gap: '6px' }}>
        {icon && <span style={{ color: 'var(--text-muted)', display: 'flex' }}>{icon}</span>}
        {label}
      </span>
      {children}
    </label>
  );
}

function tabSt(active: boolean): React.CSSProperties {
  return {
    height: 32,
    border: 'none',
    borderRadius: '7px',
    background: active ? 'var(--surface)' : 'transparent',
    color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '12px',
    fontWeight: active ? 600 : 500,
    boxShadow: active ? 'var(--shadow-sm)' : 'none',
  };
}

const titleSt: React.CSSProperties = {
  margin: 0,
  color: 'var(--text-primary)',
  fontSize: '20px',
  fontWeight: 700,
  letterSpacing: '-0.03em',
};

const copySt: React.CSSProperties = {
  margin: '6px 0 0',
  color: 'var(--text-secondary)',
  fontSize: '13px',
  lineHeight: 1.5,
};
