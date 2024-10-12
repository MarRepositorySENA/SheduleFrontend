export interface Funciones {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  codigo: string;
  nombre: string;
  descripcion: string;
  proyectoFormativoId: {                        // Relación con ProyectoFormativo
    id: number;
    titulo: string;
    centroFormacionId: {
      id: number;
      nombre: string;
    };
  };
}
