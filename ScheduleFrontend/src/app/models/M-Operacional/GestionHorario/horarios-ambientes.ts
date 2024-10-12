export interface HorariosAmbientes {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  horaInicio: string;
  horaFin: string;

  ambienteId: {
    id: number;
    codigo: string;
    nombre: string;
    cupo: number;

    especialidadId: {
      id: number;
      codigo: string;
      nombre: string;
      descripcion: string;
    };
  };

  programacionFichaId: {
    id: number;
    codigo: string;
    fechaInicio: string;
    fechaFin: string;
    trimestre: string;
    cantidadHora: number;
  };
}
