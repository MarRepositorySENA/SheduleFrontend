export interface ProgramaFormacion {
    id: number;
    state?: boolean;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
    nombre: string;
    descripcion: string;
    duraccion: number;
    modalidadId: {                                // Relación con Modalidad
      id: number;
      nombre: string;
    };
    nivelFormacionId: {                           // Relación con NivelFormacion
      id: number;
      nombre: string;
    };
    tipoFormacionId: {                            // Relación con TipoFormacion
      id: number;
      nombre: string;
    };
  }
  