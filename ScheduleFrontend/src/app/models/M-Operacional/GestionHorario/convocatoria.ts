export interface Convocatoria {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  codigo: string;
  anio : number;
  trimestre: string;
}
