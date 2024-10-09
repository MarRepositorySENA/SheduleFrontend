export interface Departamento {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  nombre: string;
  codigo?: string;
  paisId: {
    id: number;
    nombre: string;
    codigo: string;
  };
}
