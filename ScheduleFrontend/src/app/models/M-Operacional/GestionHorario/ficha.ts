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

  };

  convocatoriaId: {
    id: number;
  };

  programaFormacionId: {
    id: number;

    modalidadId: {
      id: number;
    };

    nivelFormacionId: {
      id: number;
    };

    tipoFormacionId: {
      id: number;
    };
  };
}
