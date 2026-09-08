import React, { createContext, useContext, useMemo } from 'react';
import type { Cobro, Consulta, Paciente, Receta, Turno } from '../types';
import type { AuthSession } from '../modules/Auth';
import {
  cobros as demoCobros,
  consultas as demoConsultas,
  medicoInfo as demoMedicoInfo,
  pacientes as demoPacientes,
  recetas as demoRecetas,
  turnos as demoTurnos,
} from '../data/mockData';

export interface MedicoInfo {
  nombre: string;
  especialidad: string;
  matriculaNacional: string;
  matriculaProvincial: string;
  consultorio: string;
  direccion: string;
  telefono: string;
  iniciales: string;
}

interface ClinicData {
  dataProfile: AuthSession['dataProfile'];
  pacientes: Paciente[];
  turnos: Turno[];
  consultas: Consulta[];
  recetas: Receta[];
  cobros: Cobro[];
  medicoInfo: MedicoInfo;
}

const ClinicDataContext = createContext<ClinicData | null>(null);

function medicoInfoFromSession(session: AuthSession): MedicoInfo {
  return {
    nombre: session.medico,
    especialidad: session.especialidad,
    matriculaNacional: session.matriculaNacional,
    matriculaProvincial: session.matriculaProvincial,
    consultorio: session.consultorio,
    direccion: session.direccion,
    telefono: session.telefono,
    iniciales: session.iniciales,
  };
}

export function ClinicDataProvider({ session, children }: { session: AuthSession; children: React.ReactNode }) {
  const value = useMemo<ClinicData>(() => {
    if (session.dataProfile === 'demo') {
      return {
        dataProfile: session.dataProfile,
        pacientes: demoPacientes,
        turnos: demoTurnos,
        consultas: demoConsultas,
        recetas: demoRecetas,
        cobros: demoCobros,
        medicoInfo: demoMedicoInfo,
      };
    }

    return {
      dataProfile: session.dataProfile,
      pacientes: [],
      turnos: [],
      consultas: [],
      recetas: [],
      cobros: [],
      medicoInfo: medicoInfoFromSession(session),
    };
  }, [session]);

  return (
    <ClinicDataContext.Provider value={value}>
      {children}
    </ClinicDataContext.Provider>
  );
}

export function useClinicData() {
  const context = useContext(ClinicDataContext);
  if (!context) {
    throw new Error('useClinicData must be used inside ClinicDataProvider');
  }
  return context;
}
