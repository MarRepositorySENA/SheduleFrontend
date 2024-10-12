export interface FichasEmpleados {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;

  empleadoId: {
    id: number;
    identificador: string;
    fechaInicio: string;
    fechaFin: string;

    cargoId: {
      id: number;
      codigo: string;
      nombre: string;
    };

    tipoContratoId: {
      id: number;
      codigo: string;
      nombre: string;
    };

    personaId: {
      id: number;
      primerNombre: string;
      segundoNombre: string;
      primerApellido: string;
      segundoApellido: string;
      tipoDocumento: string;
      numeroDocumento: string;
      email: string;
      genero: string;
      direccion: string;
      telefono: string;
      fechaNacimiento: string;
    };
  };

  fichaId: {
    id: number;
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
      anio: {
        value: number;
        leap: boolean;
      };
      trimestre: string;
    };

    programaFormacionId: {
      id: number;
      nombre: string;
      descripcion: string;
      duraccion: number;

      modalidadId: {
        id: number;
        codigo: string;
        nombre: string;
        requierePresencialidad: boolean;
      };

      nivelFormacionId: {
        id: number;
        codigo: string;
        nombre: string;
      };

      tipoFormacionId: {
        id: number;
        codigo: string;
        nombre: string;
      };
    };
  };
}
