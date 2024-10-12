export interface Departamento {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  nombre: string;
  codigo: string;
  paisId: {                              // Relación con Pais
    id: number;
    nombre?: string;
  };
}
