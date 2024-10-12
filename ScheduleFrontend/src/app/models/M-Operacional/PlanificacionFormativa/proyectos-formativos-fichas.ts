export interface ProyectosFormativosFichas {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  proyectoFormativoId: {                 // Relación con ProyectoFormativo
    id: number;
    titulo?: string;                     // Solo campos necesarios
    codigo?: string;
  };
  fichaId: {                             // Relación con Ficha
    id: number;
    codigo?: string;
    fechaInicio?: string;
    fechaFin?: string;
  };
}
