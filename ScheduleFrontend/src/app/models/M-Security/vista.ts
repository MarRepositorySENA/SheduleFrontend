export interface Vista {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  nombre: string;
  descripcion: string;
  ruta: string;
  moduloId: {                                  // Relación con Modulo
    id: number;
    nombre: string;
  };
}
