export interface Regional {
  id: number;
  state: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  nit: string;
  nombre: string;
  acronimo: string;
  direccion: string;
  telefono: string; // Teléfono debe ser validado para cumplir con el formato específico.
  departamentoId: {
    id: number;
    state: boolean;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
    nombre: string;
    codigo: string;
    paisId: {
      id: number;
      state: boolean;
      createdAt?: string;
      updatedAt?: string;
      deletedAt?: string | null;
      nombre: string;
      codigo: string;
      continenteId: {
        id: number;
        state: boolean;
        createdAt?: string;
        updatedAt?: string;
        deletedAt?: string | null;
        nombre: string;
        codigo: string;
      };
    };
  };
}
