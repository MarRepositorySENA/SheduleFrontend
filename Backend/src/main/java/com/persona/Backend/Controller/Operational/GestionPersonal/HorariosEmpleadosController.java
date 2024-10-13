package com.persona.Backend.Controller.Operational.GestionPersonal;

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
import com.persona.Backend.Entity.Operational.GestionPersonal.HorariosEmpleados;
import com.persona.Backend.IService.Operational.GestionPersonal.IHorariosEmpleadosService;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/base/operational/gestion_personal/horarios_empleados")
public class HorariosEmpleadosController extends BaseController<HorariosEmpleados>{

	  @Autowired
	    private IHorariosEmpleadosService horariosEmpleadosService;

	    @GetMapping("/verificar-conflicto")
	    public ResponseEntity<String> verificarConflictoEmpleado(
	            @RequestParam Long empleadoId,
	            @RequestParam LocalDateTime horaInicio,
	            @RequestParam LocalDateTime horaFin) {

	        boolean conflicto = horariosEmpleadosService.verificarConflictoEmpleado(empleadoId, horaInicio, horaFin);

	        if (conflicto) {
	            return ResponseEntity.status(HttpStatus.CONFLICT).body("Conflicto de horario con el instructor.");
	        }

	        return ResponseEntity.ok("No hay conflictos con el instructor.");
	    }
}
