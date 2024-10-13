package com.persona.Backend.IService.Operational.GestionPersonal;

import java.time.LocalDateTime;

import com.persona.Backend.Entity.Operational.GestionPersonal.HorariosEmpleados;
import com.persona.Backend.IService.IBaseService;

public interface IHorariosEmpleadosService extends IBaseService<HorariosEmpleados> {

	 boolean verificarConflictoEmpleado(Long empleadoId, LocalDateTime horaInicio, LocalDateTime horaFin);
}
