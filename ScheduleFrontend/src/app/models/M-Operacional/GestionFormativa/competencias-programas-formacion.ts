export interface CompetenciasProgramasFormacion {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  programaFormacionId: {                                // Relación con Modalidad
    id: number;
  };
  competenciaId:  {                                // Relación con Modalidad
    id: number;
  };
}
