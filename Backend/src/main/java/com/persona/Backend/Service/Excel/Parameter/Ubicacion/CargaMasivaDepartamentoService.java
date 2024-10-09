package com.persona.Backend.Service.Excel.Parameter.Ubicacion;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;
import com.alibaba.excel.EasyExcel;
import com.persona.Backend.Dto.Excel.Parameter.Ubicacion.DepartamentoExcelDTO;
import com.persona.Backend.Entity.Parameter.Ubicacion.Departamento;
import com.persona.Backend.IService.EXCEL.Parameter.Ubicacion.ICargaMasivaDepartamentoService;
import com.persona.Backend.IService.Parameter.Ubicacion.IDepartamentoService;
import com.persona.Backend.IService.Parameter.Ubicacion.IPaisService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.transaction.Transactional;

@Service
public class CargaMasivaDepartamentoService implements ICargaMasivaDepartamentoService{
	
	 

	 @Autowired
	    private IDepartamentoService departamentoService;

	    @Autowired
	    private IPaisService paisService;


	    private static final String NOMBRE_VALIDO_REGEX = "^[\\p{L}0-9\\s\\.]+$"; // Permitir letras, números, espacios, y punto

	    @Override
	    @Transactional
	    public void procesarExcelDepartamento(MultipartFile file) throws Exception {
	        List<String> errores = new ArrayList<>();

	        try {
	            List<DepartamentoExcelDTO> departamentosList = EasyExcel.read(file.getInputStream())
	                    .head(DepartamentoExcelDTO.class)
	                    .sheet()
	                    .doReadSync();

	            for (DepartamentoExcelDTO excelDTO : departamentosList) {

	                // Validación del nombre
	                if (!Pattern.matches(NOMBRE_VALIDO_REGEX, excelDTO.getNombre())) {
	                    errores.add("El nombre del departamento " + excelDTO.getNombre() + " contiene caracteres especiales.");
	                    continue;
	                }

	                // Verificación de si el departamento ya existe
	                Departamento departamentoExistente = departamentoService.findByNombre(excelDTO.getNombre());
	                
	                if (departamentoExistente != null) {
	                    // Si el departamento ya existe pero ha sido eliminado lógicamente
	                    if (departamentoExistente.getDeletedAt() != null) {
	                        departamentoExistente.setDeletedAt(null); // Reactivar el registro
	                        departamentoExistente.setNombre(excelDTO.getNombre());
	                        departamentoExistente.setCodigo(excelDTO.getCodigo());
	                        departamentoExistente.setPaisId(paisService.findById(excelDTO.getPaisId()).orElse(null));

	                        departamentoService.save(departamentoExistente); // Actualizar el registro
	                    } else {
	                        // Si el registro no está eliminado lógicamente, generar error
	                        errores.add("El departamento " + excelDTO.getNombre() + " ya existe en la base de datos.");
	                    }
	                    continue; // Pasar al siguiente registro
	                }

	                // Crear y guardar un nuevo departamento si no existe
	                Departamento departamento = new Departamento();
	                departamento.setNombre(excelDTO.getNombre());
	                departamento.setCodigo(excelDTO.getCodigo());
	                departamento.setPaisId(paisService.findById(excelDTO.getPaisId()).orElse(null));

	                departamentoService.save(departamento);
	            }

	            if (!errores.isEmpty()) {
	                throw new Exception(String.join(", ", errores));
	            }

	        } catch (Exception e) {
	            throw new RuntimeException("Error al procesar el archivo Excel: " + e.getMessage());
	        }
	    }
}
