export interface Matricula {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  estadoProceso: string;
  personaId: {                                 // Relación con Persona
    id: number;
    primerNombre: string;
    segundoNombre?: string;
    primerApellido: string;
  };
  fichaId: {                                   // Relación con Ficha
    id: number;
    codigo: string;
  };
}
