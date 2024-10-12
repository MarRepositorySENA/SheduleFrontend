export interface HorariosEmpleados {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  
  horaInicio: string;
  horaFin: string;

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

  programacionFichaId: {
    id: number;
    codigo: string;
    fechaInicio: string;
    fechaFin: string;
    trimestre: string;
    cantidadHora: number;
  };
}
