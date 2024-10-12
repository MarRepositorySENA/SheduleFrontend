export interface ProyectoFormativo {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  titulo: string;
  codigo: string;
  descripcion: string;
  cantidadRap: number;
  centroFormacionId: {                // Relación con CentroFormacion
    id: number;
    nombre?: string;                  // Solo los campos necesarios para la relación
  };
  ciudadId: {                         // Relación con Ciudad
    id: number;
    nombre?: string;                  // Solo los campos necesarios para la relación
  };
}
