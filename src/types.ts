export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  fechaNacimiento: string;
  obraSocial: string;
  nroAfiliado?: string;
  telefono: string;
  email?: string;
  antecedentes: string[];
  alergias: string[];
  medicacionCronica: string[];
}

export interface Turno {
  id: string;
  pacienteId: string;
  fecha: string;
  hora: string;
  duracion: 15 | 30 | 45 | 60;
  motivo: string;
  estado: 'confirmado' | 'pendiente' | 'en-consultorio' | 'cancelado' | 'atendido';
  obraSocial: string;
}

export interface Consulta {
  id: string;
  pacienteId: string;
  fecha: string;
  motivo: string;
  anamnesis?: string;
  examenFisico?: { ta?: string; fc?: number; temp?: number; peso?: number; talla?: number };
  diagnostico: string;
  cie10?: string;
  indicaciones: string;
  proximoControl?: string;
}

export interface Receta {
  id: string;
  pacienteId: string;
  fecha: string;
  medicamentos: {
    nombre: string;
    principioActivo: string;
    dosis: string;
    posologia: string;
    duracion: string;
  }[];
  indicaciones?: string;
  estado: 'vigente' | 'vencida';
  esCronica: boolean;
}

export interface Cobro {
  id: string;
  pacienteId: string;
  turnoId: string;
  fecha: string;
  monto: number;
  obraSocial: string;
  estado: 'cobrado' | 'pendiente' | 'a-facturar';
}

export type ModuloActivo =
  | 'dashboard'
  | 'agenda'
  | 'pacientes'
  | 'recetas'
  | 'facturacion'
  | 'historia'
  | 'estadisticas'
  | 'configuracion';
