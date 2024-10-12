export interface Ficha {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  codigo: string;
  fechaInicio: string;
  fechaFin: string;
  cupo: number;
  etapa: string;

  jornadaId: {
    id: number;
    codigo: string;
    nombre: string;
  };

  convocatoriaId: {
    id: number;
    codigo: string;
    anio: number;
    trimestre: string;
  };

  programaFormacionId: {
    id: number;
    nombre: string;
    descripcion: string;
    duracion: number;

    modalidadId: {
      id: number;
      nombre: string;
      requierePresencialidad: boolean;
    };

    nivelFormacionId: {
      id: number;
      nombre: string;
    };

    tipoFormacionId: {
      id: number;
      nombre: string;
    };
  };
}
