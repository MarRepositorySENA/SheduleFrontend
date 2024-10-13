package com.persona.Backend.IRepository.Operational.GestionPersonal;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.persona.Backend.Entity.Operational.GestionPersonal.HorariosEmpleados;
import com.persona.Backend.IRepository.IBaseRepository;

@Repository
public interface IHorariosEmpleadosRepository  extends IBaseRepository<HorariosEmpleados, Long>{


    @Query("SELECT COUNT(he) FROM HorariosEmpleados he WHERE he.empleadoId.id = :empleadoId AND " +
           "(he.horaInicio BETWEEN :horaInicio AND :horaFin OR he.horaFin BETWEEN :horaInicio AND :horaFin)")
    Long countConflictingEmpleados(@Param("empleadoId") Long empleadoId, 
                                   @Param("horaInicio") LocalDateTime horaInicio, 
                                   @Param("horaFin") LocalDateTime horaFin);
}
