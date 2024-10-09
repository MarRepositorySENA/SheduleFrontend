package com.persona.Backend.Service.Parameter.Ubicacion;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.persona.Backend.Entity.Parameter.Ubicacion.Continente;
import com.persona.Backend.IRepository.Parameter.Ubicacion.IContinenteRepository;
import com.persona.Backend.IService.Parameter.Ubicacion.IContinenteService;
import com.persona.Backend.Service.BaseService;
import java.util.List;

@Service
public class ContinenteService extends BaseService<Continente> implements IContinenteService {

	@Autowired
	private IContinenteRepository continenteRepository;

	@Override
	public Continente findByNombre(String nombre) {
		return continenteRepository.findByNombre(nombre).orElse(null);
	}
}
