package com.persona.Backend.Service.Operational.GestionHorario;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.persona.Backend.Entity.Operational.GestionHorario.HorariosAmbientes;
import com.persona.Backend.Entity.Operational.GestionPersonal.HorariosEmpleados;
import com.persona.Backend.IRepository.Operational.GestionHorario.IHorariosAmbientesRepository;
import com.persona.Backend.IRepository.Operational.GestionPersonal.IHorariosEmpleadosRepository;
import com.persona.Backend.IService.Operational.GestionHorario.IHorariosAmbientesService;
import com.persona.Backend.Service.BaseService;

@Service
public class HorariosAmbientesService extends BaseService<HorariosAmbientes> implements IHorariosAmbientesService{

	  @Autowired
	    private IHorariosAmbientesRepository repository;

	    @Override
	    public boolean verificarConflictoAmbiente(Long ambienteId, LocalDateTime horaInicio, LocalDateTime horaFin) {
	        Long conflictos = repository.countConflictingAmbientes(ambienteId, horaInicio, horaFin);
	        return conflictos > 0;
	    }

	    @Override
	    public HorariosAmbientes save(HorariosAmbientes horariosAmbientes) throws Exception {
	        // Verificar si hay conflicto de horario antes de guardar
	        boolean conflicto = verificarConflictoAmbiente(horariosAmbientes.getAmbienteId().getId(),
	                                                      horariosAmbientes.getHoraInicio(),
	                                                      horariosAmbientes.getHoraFin());

	        if (conflicto) {
	            throw new Exception("Conflicto de horario detectado. No se puede guardar el registro.");
	        }

	        return repository.save(horariosAmbientes);  // Solo guarda si no hay conflicto
	    }
}
