export interface Modulo {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  nombre: string;
  ruta: string;
  icono: string;
}
