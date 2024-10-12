export interface Localidad {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  nombre: string;
  codigoPostal: number;
  ciudadId: {                            // Relación con Ciudad
    id: number;
    nombre?: string;
  };
}
