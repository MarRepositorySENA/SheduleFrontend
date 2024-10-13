package com.persona.Backend.Controller.Operational.GestionHorario;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;


import com.persona.Backend.Controller.BaseController;
import com.persona.Backend.Entity.Operational.GestionHorario.HorariosAmbientes;
import com.persona.Backend.IService.Operational.GestionHorario.IHorariosAmbientesService;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/base/operational/gestion_horario/horarios_ambientes")
public class HorariosAmbientesController extends BaseController<HorariosAmbientes> {

	  @Autowired
	    private IHorariosAmbientesService horariosAmbientesService;

	    @GetMapping("/verificar-conflicto")
	    public ResponseEntity<String> verificarConflictoAmbiente(
	            @RequestParam Long ambienteId,
	            @RequestParam LocalDateTime horaInicio,
	            @RequestParam LocalDateTime horaFin) {

	        boolean conflicto = horariosAmbientesService.verificarConflictoAmbiente(ambienteId, horaInicio, horaFin);

	        if (conflicto) {
	            return ResponseEntity.status(HttpStatus.CONFLICT).body("Conflicto de horario en el ambiente.");
	        }

	        return ResponseEntity.ok("No hay conflictos en el ambiente.");
	    }
	
}
