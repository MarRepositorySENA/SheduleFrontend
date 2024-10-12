package com.persona.Backend.IRepository.Operational.GestionHorario;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.persona.Backend.Entity.Operational.GestionHorario.HorariosAmbientes;
import com.persona.Backend.IRepository.IBaseRepository;

@Repository
public interface IHorariosAmbientesRepository extends IBaseRepository<HorariosAmbientes, Long> {

	@Query("SELECT h FROM HorariosAmbientes h WHERE h.ambienteId = :ambienteId AND ((h.horaInicio <= :horaFin AND h.horaFin >= :horaInicio) AND h.state = true)")
	List<HorariosAmbientes> findConflictingAmbienteSchedules(@Param("ambienteId") Long ambienteId, @Param("horaInicio") LocalDateTime horaInicio, @Param("horaFin") LocalDateTime horaFin);

}
