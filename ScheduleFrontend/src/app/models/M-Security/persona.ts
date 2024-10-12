export interface Persona {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  tipoDocumento: string;
  numeroDocumento: string;
  email: string;
  genero: string;
  direccion: string;
  telefono: string;
  fechaNacimiento: string;
}
