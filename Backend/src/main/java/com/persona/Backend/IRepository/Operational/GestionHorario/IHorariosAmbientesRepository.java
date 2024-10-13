package com.persona.Backend.IRepository.Operational.GestionHorario;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.persona.Backend.Entity.Operational.GestionHorario.HorariosAmbientes;
import com.persona.Backend.Entity.Operational.GestionPersonal.HorariosEmpleados;
import com.persona.Backend.IRepository.IBaseRepository;

@Repository
public interface IHorariosAmbientesRepository extends IBaseRepository<HorariosAmbientes, Long> {

	  @Query("SELECT COUNT(ha) FROM HorariosAmbientes ha WHERE ha.ambienteId.id = :ambienteId AND " +
	           "(ha.horaInicio BETWEEN :horaInicio AND :horaFin OR ha.horaFin BETWEEN :horaInicio AND :horaFin)")
	    Long countConflictingAmbientes(@Param("ambienteId") Long ambienteId, 
	                                   @Param("horaInicio") LocalDateTime horaInicio, 
	                                   @Param("horaFin") LocalDateTime horaFin);

}
