package com.persona.Backend.Service.Operational.GestionPersonal;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.persona.Backend.Entity.Operational.GestionPersonal.HorariosEmpleados;
import com.persona.Backend.IRepository.Operational.GestionPersonal.IHorariosEmpleadosRepository;
import com.persona.Backend.IService.Operational.GestionPersonal.IHorariosEmpleadosService;
import com.persona.Backend.Service.BaseService;

@Service
public class HorariosEmpleadosService extends BaseService<HorariosEmpleados> implements IHorariosEmpleadosService{
	 
	 @Autowired
	    private IHorariosEmpleadosRepository repository;

	    @Override
	    public boolean verificarConflictoEmpleado(Long empleadoId, LocalDateTime horaInicio, LocalDateTime horaFin) {
	        Long conflictos = repository.countConflictingEmpleados(empleadoId, horaInicio, horaFin);
	        return conflictos > 0;
	    }

}
