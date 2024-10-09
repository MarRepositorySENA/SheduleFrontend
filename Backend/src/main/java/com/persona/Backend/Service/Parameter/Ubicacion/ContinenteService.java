package com.persona.Backend.Service.Parameter.Ubicacion;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.persona.Backend.Entity.Parameter.Ubicacion.Continente;
import com.persona.Backend.IRepository.Parameter.Ubicacion.IContinenteRepository;
import com.persona.Backend.IService.Parameter.Ubicacion.IContinenteService;
import com.persona.Backend.Service.BaseService;
import java.util.List;

@Service
public class ContinenteService extends BaseService<Continente> implements IContinenteService{
	
	  @Autowired
	    private IContinenteRepository continenteRepository;

	    // Lista fija de continentes válidos
	    private static final List<String> CONTINENTES_VALIDOS = List.of(
	        "Africa", "Antarctica", "Asia", "Europe", "North America", "Oceania", "South America"
	    );

	    @Override
	    public Continente save(Continente continente) throws Exception {
	        // Validación para asegurarse de que el nombre del continente sea válido
	        if (!CONTINENTES_VALIDOS.contains(continente.getNombre())) {
	            throw new Exception("El nombre del continente " + continente.getNombre() + " no es un continente válido.");
	        }
	        
	        // Llamar al método save del servicio base si la validación pasa
	        return super.save(continente);
	    }

	    @Override
	    public Continente findByNombre(String nombre) {
	        return continenteRepository.findByNombre(nombre).orElse(null);
	    }

}
