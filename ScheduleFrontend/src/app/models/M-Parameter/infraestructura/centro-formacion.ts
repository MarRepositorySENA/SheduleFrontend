export interface CentroFormacion {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  nombre: string;
  direccion: string;
  telefono: string;
  regionalId: {                          // Relación con Regional
    id: number;
    nombre?: string;
  };
  ciudadId: {                            // Relación con Ciudad
    id: number;
    nombre?: string;
  };
}
