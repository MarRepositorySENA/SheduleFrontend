export interface RapsCompetencias {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  rapId: {                               // Relación con Rap
    id: number;
    descripcion: string;
  };
  competenciaId: {                       // Relación con Competencia
    id: number;
    nombre: string;
  };
}
