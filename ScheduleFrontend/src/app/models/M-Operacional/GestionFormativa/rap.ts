export interface Rap {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  descripcion: string;
  duraccion: number;
  nivel: string;
}
