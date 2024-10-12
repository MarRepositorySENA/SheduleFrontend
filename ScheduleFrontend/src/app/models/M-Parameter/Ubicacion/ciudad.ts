export interface Ciudad {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  nombre: string;
  codigo: string;
  departamentoId: {                      // Relación con Departamento
    id: number;
    nombre?: string;
  };
}
