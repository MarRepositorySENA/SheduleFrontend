export interface CompetenciasProgramasFormacion {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  programaFormacionId: {                           // Relación con ProgramaFormacion
    id: number;
    nombre: string;
  };
  competenciaId: {                                 // Relación con Competencia
    id: number;
    nombre: string;
  };
}
