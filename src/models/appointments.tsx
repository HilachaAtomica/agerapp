export type Contact = {
  id: number;
  name: string; // Nombre del contacto
  phone: string; // Teléfono del contacto
  email?: string; // Correo electrónico del contacto
  address?: string; // Dirección del contacto
  additionalInfo?: string; // Información adicional del contacto
  role?: string; // Rol del contacto
};
