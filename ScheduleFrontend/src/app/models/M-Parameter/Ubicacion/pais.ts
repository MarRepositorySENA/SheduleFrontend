export interface Pais {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  nombre: string;
  codigo?: string;
  continenteId: {                        // Relación con Continente
    id: number;
    nombre?: string;
  };
}
