export interface Pais {
    id: number;
    state?: boolean;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
    nombre: string;
    codigo?: string;
    continenteId: {
      id: number;
      nombre: string;
      codigo: string;
    };
  }
  