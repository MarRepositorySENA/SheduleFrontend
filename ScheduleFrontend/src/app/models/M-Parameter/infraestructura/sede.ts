export interface Sede {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  codigo: string;
  nombre: string;
  direccion: string;
  centroFormacionId: {                       // Relación con CentroFormacion
    id: number;
    nombre?: string;
  };
}
