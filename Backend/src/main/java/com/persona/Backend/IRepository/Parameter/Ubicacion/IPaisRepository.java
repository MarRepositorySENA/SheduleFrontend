package com.persona.Backend.IRepository.Parameter.Ubicacion;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.persona.Backend.Entity.Parameter.Ubicacion.Pais;
import com.persona.Backend.IRepository.IBaseRepository;

@Repository
public interface IPaisRepository extends IBaseRepository<Pais, Long>{

	 Optional<Pais> findByNombre(String nombre);
}
