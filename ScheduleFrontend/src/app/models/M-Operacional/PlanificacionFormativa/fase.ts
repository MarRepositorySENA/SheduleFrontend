export interface Fase {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  codigo: string;
  nombre: string;
  descripcion: string;
  proyectoFormativoId: {               // Relación con Proyecto Formativo
    id: number;
    titulo: string;
  };
}
