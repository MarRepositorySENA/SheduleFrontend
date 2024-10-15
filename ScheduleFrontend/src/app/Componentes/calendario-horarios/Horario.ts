interface Horario {
    horaInicio: string;
    horaFin: string;
    empleadoId?: {
      personaId?: {
        primerNombre: string;
        primerApellido: string;
      };
    };
    ambienteId?: {
      nombre: string;
    };
  }
  