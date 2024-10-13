package com.persona.Backend.IService.Operational.GestionHorario;

import java.time.LocalDateTime;
import java.util.List;

import com.persona.Backend.Entity.Operational.GestionHorario.HorariosAmbientes;
import com.persona.Backend.Entity.Operational.GestionPersonal.HorariosEmpleados;
import com.persona.Backend.IService.IBaseService;

public interface IHorariosAmbientesService extends IBaseService<HorariosAmbientes> {

	boolean verificarConflictoAmbiente(Long ambienteId, LocalDateTime horaInicio, LocalDateTime horaFin);

}
