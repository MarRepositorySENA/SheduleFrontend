package com.persona.Backend.Service.Parameter.Ubicacion;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.persona.Backend.Entity.Parameter.Ubicacion.Departamento;
import com.persona.Backend.IRepository.Parameter.Ubicacion.IDepartamentoRepository;
import com.persona.Backend.IService.Parameter.Ubicacion.IDepartamentoService;
import com.persona.Backend.Service.BaseService;

@Service
public class DepartamentoService extends BaseService<Departamento> implements IDepartamentoService {


    @Autowired
    private IDepartamentoRepository departamentoRepository;

    @Override
    public Departamento findByNombre(String nombre) {
        return departamentoRepository.findByNombre(nombre).orElse(null);
    }
}
