export interface Convocatoria {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  codigo: string;
  anio: {                                 // Objeto para el año
    value: number;
    leap: boolean;
  };
  trimestre: string;
}
