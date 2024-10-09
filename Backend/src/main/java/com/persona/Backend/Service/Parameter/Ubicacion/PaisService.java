package com.persona.Backend.Service.Parameter.Ubicacion;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.neovisionaries.i18n.CountryCode;
import com.persona.Backend.Entity.Parameter.Ubicacion.Pais;
import com.persona.Backend.IRepository.Parameter.Ubicacion.IPaisRepository;
import com.persona.Backend.IService.Parameter.Ubicacion.IDepartamentoService;
import com.persona.Backend.IService.Parameter.Ubicacion.IPaisService;
import com.persona.Backend.Service.BaseService;

@Service
public class PaisService extends BaseService<Pais> implements IPaisService {

	@Autowired
	private IPaisRepository paisRepository;

	@Autowired
	private IDepartamentoService departamentoService; // Servicio de Departamentos

	@Override
    public Pais findByNombre(String nombre) {
        return paisRepository.findByNombre(nombre).orElse(null);
        
	}       
        
}
