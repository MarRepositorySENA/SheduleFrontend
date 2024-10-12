export interface Ambiente {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  codigo: string;
  nombre: string;
  cupo: number;
  especialidadId: {                      // Relación con Especialidad
    id: number;
    nombre?: string;
  };
}
