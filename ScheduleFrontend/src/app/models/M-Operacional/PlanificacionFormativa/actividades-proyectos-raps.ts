export interface ActividadesProyectosRaps {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  actividadProyectoId: {                // Relación con ActividadProyecto
    id: number;
    codigo: string;
    nombre: string;
  };
  rapId: {                              // Relación con RAP
    id: number;
    descripcion: string;
    duraccion: number;
  };
}
