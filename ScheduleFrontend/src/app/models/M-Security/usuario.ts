export interface Usuario {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  contrasenia: string;
  personaId: {                                  // Relación con Persona
    id: number;
    primerNombre?: string;
    primerApellido?: string;
  };
  usuarioName: string;
}
