export interface Regional {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  nit: string;
  nombre: string;
  acronimo: string;
  direccion: string;
  telefono: string;
  departamentoId: {                        // Relación con Departamento
    id: number;
    nombre?: string;
  };
}
