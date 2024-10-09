package com.persona.Backend.IRepository.Parameter.Ubicacion;

import java.util.Optional;
import com.persona.Backend.Entity.Parameter.Ubicacion.Departamento;
import com.persona.Backend.IRepository.IBaseRepository;

public interface IDepartamentoRepository extends IBaseRepository<Departamento, Long>{

	Optional<Departamento> findByNombre(String nombre);
}
