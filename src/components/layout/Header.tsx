import React, { useMemo, useState } from 'react';
import { AlertCircle, Bell, CalendarClock, ChevronDown, CreditCard, FileText, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useClinicData } from '../../context/ClinicDataContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { AuthSession } from '../../modules/Auth';

interface HeaderProps {
  session: AuthSession;
  onLogout: () => void;
}

export function Header({ session, onLogout }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { logoUrl, pacientes, turnos, cobros, recetas } = useClinicData();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const today = format(new Date(), "d MMM yyyy", { locale: es });
  const operationalDate = '2026-06-11';

  const notifications = useMemo(() => {
    const todayTurnos = turnos.filter(turno => turno.fecha === operationalDate);
    const pendingTurnos = todayTurnos.filter(turno => turno.estado === 'pendiente');
    const canceledTurnos = todayTurnos.filter(turno => turno.estado === 'cancelado');
    const pendingCharges = cobros.filter(cobro => (
      cobro.fecha === operationalDate && (cobro.estado === 'pendiente' || cobro.estado === 'a-facturar')
    ));
    const expiredChronicRecipes = recetas.filter(receta => receta.esCronica && receta.estado === 'vencida');

    const getPatientName = (patientId: string) => {
      const paciente = pacientes.find(item => item.id === patientId);
      return paciente ? `${paciente.nombre} ${paciente.apellido}` : 'Paciente sin asignar';
    };

    return [
      pendingTurnos.length > 0 && {
        id: 'turnos-pendientes',
        icon: <CalendarClock size={14} />,
        color: 'var(--amber)',
        bg: 'var(--amber-bg)',
        title: `${pendingTurnos.length} turno${pendingTurnos.length === 1 ? '' : 's'} pendiente${pendingTurnos.length === 1 ? '' : 's'}`,
        detail: pendingTurnos.slice(0, 2).map(turno => `${turno.hora} · ${getPatientName(turno.pacienteId)}`).join(' / '),
      },
      canceledTurnos.length > 0 && {
        id: 'turnos-cancelados',
        icon: <AlertCircle size={14} />,
        color: 'var(--red)',
        bg: 'var(--red-bg)',
        title: `${canceledTurnos.length} cancelación${canceledTurnos.length === 1 ? '' : 'es'} hoy`,
        detail: canceledTurnos.slice(0, 2).map(turno => getPatientName(turno.pacienteId)).join(' / '),
      },
      pendingCharges.length > 0 && {
        id: 'cobros-pendientes',
        icon: <CreditCard size={14} />,
        color: 'var(--purple)',
        bg: 'var(--purple-bg)',
        title: `${pendingCharges.length} cobro${pendingCharges.length === 1 ? '' : 's'} por resolver`,
        detail: pendingCharges.slice(0, 2).map(cobro => getPatientName(cobro.pacienteId)).join(' / '),
      },
      expiredChronicRecipes.length > 0 && {
        id: 'recetas-vencidas',
        icon: <FileText size={14} />,
        color: 'var(--blue)',
        bg: 'var(--blue-bg)',
        title: `${expiredChronicRecipes.length} receta${expiredChronicRecipes.length === 1 ? '' : 's'} crónica${expiredChronicRecipes.length === 1 ? '' : 's'} vencida${expiredChronicRecipes.length === 1 ? '' : 's'}`,
        detail: expiredChronicRecipes.slice(0, 2).map(receta => getPatientName(receta.pacienteId)).join(' / '),
      },
    ].filter(Boolean) as {
      id: string;
      icon: React.ReactNode;
      color: string;
      bg: string;
      title: string;
      detail: string;
    }[];
  }, [cobros, pacientes, recetas, turnos]);

  return (
    <header className="app-header" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60,
      height: 48,
      background: theme === 'dark' ? 'rgba(8,12,20,0.85)' : 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px',
    }}>
      {/* Brand */}
      <div className="header-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: 28, height: 28, borderRadius: '8px',
          background: logoUrl ? 'var(--surface-raised)' : 'var(--blue)',
          border: logoUrl ? '1px solid var(--border)' : 'none',
          padding: logoUrl ? 2 : 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          overflow: 'hidden',
        }}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`Logo ${session.consultorio}`}
              style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '6px' }}
            />
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2.5C5 2.5 3 5 3 7.5c0 3 2.5 5 5 5s5-2 5-5C13 5 11 2.5 8 2.5z" fill="white" opacity="0.9"/>
              <rect x="7" y="5" width="2" height="5" rx="1" fill="white"/>
              <rect x="5.5" y="9" width="5" height="2" rx="1" fill="white"/>
            </svg>
          )}
        </div>
        <div style={{ minWidth: 0 }}>
          <span className="header-brand-name" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {session.consultorio}
          </span>
        </div>
      </div>

      {/* Right controls */}
      <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span className="header-date" style={{ fontSize: '12px', color: 'var(--text-muted)', marginRight: '8px', textTransform: 'capitalize' }}>
          {today}
        </span>

        <IconBtn onClick={toggleTheme} title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}>
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </IconBtn>

        <div className="notification-wrap" style={{ position: 'relative' }}>
        <IconBtn
          onClick={() => setNotificationsOpen(open => !open)}
          style={{ position: 'relative' }}
          title="Notificaciones"
          aria-label="Abrir notificaciones"
        >
          <Bell size={15} />
          {notifications.length > 0 && (
            <span style={{
              position: 'absolute', top: 7, right: 7,
              width: 5, height: 5, borderRadius: '50%',
              background: 'var(--red)',
              border: '1.5px solid var(--surface)',
            }} />
          )}
        </IconBtn>
        {notificationsOpen && (
          <div className="notification-panel" style={{
            position: 'absolute',
            top: 40,
            right: 0,
            width: 320,
            maxWidth: 'calc(100vw - 24px)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-lg)',
            padding: '10px',
            zIndex: 90,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 4px 10px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Notificaciones</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Actividad pendiente del consultorio</div>
              </div>
              <span style={{
                minWidth: 22,
                height: 22,
                borderRadius: '999px',
                background: notifications.length ? 'var(--blue-bg)' : 'var(--surface-raised)',
                border: `1px solid ${notifications.length ? 'var(--blue-border)' : 'var(--border)'}`,
                color: notifications.length ? 'var(--blue)' : 'var(--text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700,
              }}>
                {notifications.length}
              </span>
            </div>

            {notifications.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {notifications.map(notification => (
                  <div key={notification.id} style={{
                    display: 'flex',
                    gap: '10px',
                    padding: '10px',
                    borderRadius: '8px',
                    background: 'var(--surface-raised)',
                    border: '1px solid var(--border-subtle)',
                  }}>
                    <span style={{
                      width: 28,
                      height: 28,
                      borderRadius: '7px',
                      background: notification.bg,
                      color: notification.color,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {notification.icon}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: 650, color: 'var(--text-primary)' }}>{notification.title}</div>
                      <div style={{
                        fontSize: '11px',
                        color: 'var(--text-muted)',
                        marginTop: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {notification.detail}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                padding: '18px 12px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '12px',
                borderRadius: '8px',
                background: 'var(--surface-raised)',
                border: '1px dashed var(--border)',
              }}>
                Sin notificaciones por ahora.
              </div>
            )}
          </div>
        )}
        </div>

        <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 4px' }} />

        {/* User */}
        <button className="header-user" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          padding: '4px 8px', borderRadius: '7px', fontFamily: 'inherit',
          transition: 'background 150ms ease',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-raised)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <div style={{
            width: 26, height: 26, borderRadius: '6px',
            background: 'var(--blue-bg)',
            border: '1px solid var(--blue-border)',
            color: 'var(--blue)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.02em',
          }}>
            {session.iniciales}
          </div>
          <div className="header-user-text" style={{ textAlign: 'left', minWidth: 0 }}>
            <div className="header-user-name" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{session.medico}</div>
            <div className="header-user-meta" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{session.especialidad}</div>
          </div>
          <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
        </button>

        <IconBtn onClick={onLogout} title="Cerrar sesión">
          <LogOut size={15} />
        </IconBtn>
      </div>
    </header>
  );
}

function IconBtn({ children, style, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      style={{
        background: 'transparent',
        border: '1px solid var(--border)',
        borderRadius: '7px',
        width: 32, height: 32,
        cursor: 'pointer',
        color: 'var(--text-secondary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 150ms ease',
        flexShrink: 0,
        position: 'relative',
        ...style,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--surface-raised)';
        e.currentTarget.style.borderColor = 'var(--text-muted)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
      {...props}
    >
      {children}
    </button>
  );
}
