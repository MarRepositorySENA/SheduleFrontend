package com.persona.Backend.Controller.Operational.GestionHorario;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.persona.Backend.Controller.BaseController;
import com.persona.Backend.Entity.Operational.GestionHorario.Jornada;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/base/operational/gestion_horario/jornada")
public class JornadaController extends BaseController<Jornada>{

}