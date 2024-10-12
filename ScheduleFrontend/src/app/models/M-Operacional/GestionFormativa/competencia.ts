export interface Competencia {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  codigo: string;
  nombre: string;
  descripcion: string;
  duraccion: number;
}
