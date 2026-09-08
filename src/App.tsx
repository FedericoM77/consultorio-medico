import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './modules/Dashboard';
import { Agenda } from './modules/Agenda';
import { Pacientes } from './modules/Pacientes';
import { Recetas } from './modules/Recetas';
import { Facturacion } from './modules/Facturacion';
import { HistoriaClinica } from './modules/HistoriaClinica';
import { Estadisticas } from './modules/Estadisticas';
import { Configuracion } from './modules/Configuracion';
import { Auth } from './modules/Auth';
import type { AuthSession } from './modules/Auth';
import { ClinicDataProvider } from './context/ClinicDataContext';
import { ModuloActivo } from './types';

const titulos: Record<ModuloActivo, string> = {
  dashboard: 'Dashboard',
  agenda: 'Agenda',
  pacientes: 'Pacientes',
  recetas: 'Recetas',
  facturacion: 'Facturación',
  historia: 'Historia Clínica',
  estadisticas: 'Estadísticas',
  configuracion: 'Configuración',
};

function AppContent() {
  const [modulo, setModulo] = useState<ModuloActivo>('dashboard');
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    document.title = session?.consultorio ?? 'Consultorio Médico';
  }, [session]);

  function handleAuth(nextSession: AuthSession) {
    setModulo('dashboard');
    setSession(nextSession);
  }

  function handleLogout() {
    setModulo('dashboard');
    setSession(null);
  }

  if (!session) {
    return <Auth onAuth={handleAuth} />;
  }

  return (
    <ClinicDataProvider session={session}>
      <div style={{ background: 'var(--canvas)', minHeight: '100vh', color: 'var(--text-primary)' }}>
        <Header session={session} onLogout={handleLogout} />
        <Sidebar activo={modulo} onChange={setModulo} />

        <main style={{
          marginLeft: '52px',
          marginTop: '48px',
          padding: '28px 32px',
          minHeight: 'calc(100vh - 48px)',
          maxWidth: 'calc(100vw - 52px)',
        }}>
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{
              margin: 0, fontSize: '20px', fontWeight: 600,
              color: 'var(--text-primary)', letterSpacing: '-0.03em',
            }}>
              {titulos[modulo]}
            </h1>
          </div>

          <div style={{ animation: 'fadeIn 100ms ease' }}>
            {modulo === 'dashboard' && <Dashboard />}
            {modulo === 'agenda' && <Agenda />}
            {modulo === 'pacientes' && <Pacientes />}
            {modulo === 'recetas' && <Recetas />}
            {modulo === 'facturacion' && <Facturacion />}
            {modulo === 'historia' && <HistoriaClinica />}
            {modulo === 'estadisticas' && <Estadisticas />}
            {modulo === 'configuracion' && <Configuracion />}
          </div>
        </main>

        {/* Mobile bottom nav */}
        <nav style={{
          display: 'none',
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 80,
          background: 'var(--surface)', borderTop: '1px solid var(--border-subtle)',
          padding: '8px 0',
        }}
          className="mobile-nav"
        >
          {/* Mobile nav items would go here */}
        </nav>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @media (max-width: 768px) {
            .mobile-nav { display: flex !important; }
            main { margin-bottom: 60px; padding: 16px; }
          }
        `}</style>
      </div>
    </ClinicDataProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
