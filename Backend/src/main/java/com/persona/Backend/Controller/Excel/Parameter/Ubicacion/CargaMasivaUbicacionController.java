package com.persona.Backend.Controller.Excel.Parameter.Ubicacion;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.persona.Backend.IService.EXCEL.Parameter.Ubicacion.ICargaMasivaContinenteService;
import com.persona.Backend.IService.EXCEL.Parameter.Ubicacion.ICargaMasivaDepartamentoService;
import com.persona.Backend.IService.EXCEL.Parameter.Ubicacion.ICargaMasivaPaisService;


@CrossOrigin("*")
@RestController
@RequestMapping("/api/carga_masiva")
public class CargaMasivaUbicacionController {

	    @Autowired
	    private ICargaMasivaContinenteService cargaMasivaContinenteService;
	    
	    @Autowired
	    private ICargaMasivaPaisService cargaMasivaPaisService;
	    
	    @Autowired
	    private ICargaMasivaDepartamentoService cargaMasivaDepartamentoService;

	    // Endpoint para la carga masiva de continentes
	    @PostMapping("/continentes")
	    public ResponseEntity<String> cargarContinentes(@RequestParam("file") MultipartFile file) {
	        try {
	            cargaMasivaContinenteService.procesarExcelContinente(file);
	            return ResponseEntity.ok("{\"message\": \"Carga masiva de continentes completada exitosamente.\"}");
	        } catch (Exception e) {
	            String errorMessage = String.format("{\"error\": \"Error durante la carga masiva de continentes: %s\"}", e.getMessage());
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
	        }
	    }

	    // Endpoint para la carga masiva de países
	    @PostMapping("/paises")
	    public ResponseEntity<String> cargarPaises(@RequestParam("file") MultipartFile file) {
	        try {
	            cargaMasivaPaisService.procesarExcelPais(file);
	            return ResponseEntity.ok("{\"message\": \"Carga masiva de países completada exitosamente.\"}");
	        } catch (Exception e) {
	            String errorMessage = String.format("{\"error\": \"Error durante la carga masiva de países: %s\"}", e.getMessage());
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
	        }
	    }
	    
	 // Endpoint para la carga masiva de departamentos
	    @PostMapping("/departamentos")
	    public ResponseEntity<String> cargarDepartamentos(@RequestParam("file") MultipartFile file) {
	        try {
	            cargaMasivaDepartamentoService.procesarExcelDepartamento(file);
	            return ResponseEntity.ok("{\"message\": \"Carga masiva de departamentos completada exitosamente.\"}");
	        } catch (Exception e) {
	            String errorMessage = String.format("{\"error\": \"Error durante la carga masiva de departamentos: %s\"}", e.getMessage());
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
	        }
	    }
}
