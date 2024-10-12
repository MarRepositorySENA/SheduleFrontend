export interface TipoContrato {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  codigo: string;
  nombre: string;
  cantidadHora: number;
}
