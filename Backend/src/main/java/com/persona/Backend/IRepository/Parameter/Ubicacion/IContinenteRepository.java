package com.persona.Backend.IRepository.Parameter.Ubicacion;

import java.util.Optional;

import org.springframework.stereotype.Repository;
import com.persona.Backend.Entity.Parameter.Ubicacion.Continente;
import com.persona.Backend.IRepository.IBaseRepository;

@Repository
public interface IContinenteRepository extends IBaseRepository<Continente, Long> {

	Optional<Continente> findByNombre(String nombre);
}
