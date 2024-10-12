export interface ActividadProyecto {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  codigo: string;
  nombre: string;
  descripcion: string;
  faseId: {                             // Relación con Fase
    id: number;
    nombre: string;
  };
}
