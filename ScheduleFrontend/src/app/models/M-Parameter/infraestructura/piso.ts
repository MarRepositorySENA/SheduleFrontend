export interface Piso {
    id: number;
    state?: boolean;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
    codigo: string;
    nombre: string;
    sedeId: {                               // Relación con Sede
      id: number;
      nombre?: string;
    };
  }
  