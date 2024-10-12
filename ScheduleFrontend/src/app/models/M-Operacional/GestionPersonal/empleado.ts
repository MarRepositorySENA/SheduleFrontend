export interface Empleado {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  identificador: string;
  fechaInicio: string;
  fechaFin: string;
  cargoId: {                                 // Relación con Cargo
    id: number;
    nombre: string;
  };
  tipoContratoId: {                          // Relación con TipoContrato
    id: number;
    nombre: string;
  };
  personaId: {                               // Relación con Persona
    id: number;
    primerNombre: string;
  };
}
