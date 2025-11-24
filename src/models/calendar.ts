export interface Appointment {
  expedienteId: number;
  fechaCita?: string;
  fechaCitaFin: string;
  domicilioCliente: string;
  localidadCliente: string;
  citaId: number;
  isDone?: boolean;
}

export interface Contact {
  contactoId: number;
  nombre: string;
  piso: string;
  telefono: string;
  info: string | null;
  contactoRol: string;
}

export interface AppointmentDetail {
  citaId: number;
  expedienteId: number;
  domicilioCliente: string;
  localidadCliente: string;
  info: string;
  fechaCita: string;
  fechaCitaFin: string;
  contactos: Contact[];
  tieneFotos?: boolean;
  tieneFirmas?: boolean;
  tienePresupuesto?: boolean;
  tieneComentarios?: boolean;
  isDone?: boolean;
}
