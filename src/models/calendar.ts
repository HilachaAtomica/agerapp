export interface Appointment {
  expedienteId: number;
  fechaCita: string;
  fechaCitaFin: string;
  domicilioCliente: string;
  localidadCliente: string;
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
  expedienteId: number;
  domicilioCliente: string;
  localidadCliente: string;
  info: string;
  fechaCita: string;
  fechaCitaFin: string;
  contactos: Contact[];
}
