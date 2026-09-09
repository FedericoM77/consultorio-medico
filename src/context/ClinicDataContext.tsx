import React, { createContext, useContext, useMemo, useState } from 'react';
import type { Cobro, Consulta, HorarioAtencion, Medico, Paciente, Receta, Turno } from '../types';
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
  medicos: Medico[];
  addMedico: (medico: Omit<Medico, 'id'>) => void;
  updateMedicoHorarios: (medicoId: string, horarios: HorarioAtencion[]) => void;
}

const ClinicDataContext = createContext<ClinicData | null>(null);

export const DIAS_ATENCION = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function createDefaultHorarios(): HorarioAtencion[] {
  return DIAS_ATENCION.map((dia) => ({
    dia,
    desde: dia === 'Sáb' ? '09:00' : '08:00',
    hasta: dia === 'Sáb' ? '13:00' : '17:00',
    activo: dia !== 'Sáb',
  }));
}

function createMedicoId(nombre: string) {
  const slug = nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `med-${slug || 'nuevo'}-${Date.now()}`;
}

const demoMedicos: Medico[] = [
  {
    id: 'med-maria-garcia',
    nombre: demoMedicoInfo.nombre,
    especialidad: demoMedicoInfo.especialidad,
    matricula: `MN ${demoMedicoInfo.matriculaNacional}`,
    email: 'mgarcia@centromedicobelgrano.com',
    telefono: demoMedicoInfo.telefono,
    color: 'var(--blue)',
    horarios: createDefaultHorarios(),
  },
  {
    id: 'med-santiago-ruiz',
    nombre: 'Dr. Santiago Ruiz',
    especialidad: 'Cardiología',
    matricula: 'MN 76.224',
    email: 'sruiz@centromedicobelgrano.com',
    telefono: '11-4500-1188',
    color: 'var(--green)',
    horarios: createDefaultHorarios(),
  },
  {
    id: 'med-lucia-medina',
    nombre: 'Dra. Lucía Medina',
    especialidad: 'Pediatría',
    matricula: 'MN 88.410',
    email: 'lmedina@centromedicobelgrano.com',
    telefono: '11-4500-1199',
    color: 'var(--purple)',
    horarios: createDefaultHorarios().map(horario => (
      horario.dia === 'Vie'
        ? { ...horario, hasta: '14:00' }
        : horario
    )),
  },
];

function assignMedicosToTurnos(turnos: Turno[], medicos: Medico[]) {
  if (medicos.length === 0) return turnos;
  return turnos.map((turno, index) => ({
    ...turno,
    medicoId: turno.medicoId || medicos[index % medicos.length].id,
  }));
}

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
  const initialData = useMemo(() => {
    if (session.dataProfile === 'demo') {
      return {
        dataProfile: session.dataProfile,
        pacientes: demoPacientes,
        turnos: assignMedicosToTurnos(demoTurnos, demoMedicos),
        consultas: demoConsultas,
        recetas: demoRecetas,
        cobros: demoCobros,
        medicoInfo: demoMedicoInfo,
        medicos: demoMedicos,
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
      medicos: [],
    };
  }, [session]);

  const [medicos, setMedicos] = useState<Medico[]>(initialData.medicos);

  const value = useMemo<ClinicData>(() => ({
    ...initialData,
    medicos,
    addMedico: (medico) => {
      setMedicos(prev => [...prev, { ...medico, id: createMedicoId(medico.nombre) }]);
    },
    updateMedicoHorarios: (medicoId, horarios) => {
      setMedicos(prev => prev.map(medico => (
        medico.id === medicoId ? { ...medico, horarios } : medico
      )));
    },
  }), [initialData, medicos]);

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
