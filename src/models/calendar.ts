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

export interface ArchivoVisible {
  name: string;
  url: string;
  contentType: string;
  size: number;
}

export interface AppointmentDetail {
  citaId: number;
  expedienteId: number;
  domicilioCliente: string;
  localidadCliente: string;
  info: string;
  tipoCita?: string;
  fechaCita: string;
  fechaCitaFin: string;
  contactos: Contact[];
  tieneFotos?: boolean;
  tieneFirmas?: boolean;
  tienePresupuesto?: boolean;
  tieneComentarios?: boolean;
  isDone?: boolean;
  archivosVisibles?: ArchivoVisible[];
  archivosPresupuestos?: ArchivoVisible[];
  archivosFotos?: ArchivoVisible[];
  pathPresupuestos?: string;
  pathFotos?: string;
  pathFirmas?: string;
}
