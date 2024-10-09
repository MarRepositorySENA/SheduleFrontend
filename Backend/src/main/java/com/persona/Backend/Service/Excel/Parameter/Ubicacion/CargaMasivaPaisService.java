package com.persona.Backend.Service.Excel.Parameter.Ubicacion;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;
import com.alibaba.excel.EasyExcel;
import com.persona.Backend.Dto.Excel.Parameter.Ubicacion.PaisExcelDTO;
import com.persona.Backend.Entity.Parameter.Ubicacion.Pais;
import com.persona.Backend.IService.EXCEL.Parameter.Ubicacion.ICargaMasivaPaisService;
import com.persona.Backend.IService.Parameter.Ubicacion.IContinenteService;
import com.persona.Backend.IService.Parameter.Ubicacion.IPaisService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.transaction.Transactional;

@Service
public class CargaMasivaPaisService implements ICargaMasivaPaisService {


	 @Autowired
	    private IPaisService paisService;

	    @Autowired
	    private IContinenteService continenteService;

	    // Expresión regular para permitir letras, números, espacios, y puntos
	    private static final String NOMBRE_VALIDO_REGEX = "^[\\p{L}0-9\\s\\.]+$"; 

	    @Override
	    @Transactional
	    public void procesarExcelPais(MultipartFile file) throws Exception {
	        List<String> errores = new ArrayList<>();

	        try {
	            // Leer el archivo Excel
	            List<PaisExcelDTO> paisesList = EasyExcel.read(file.getInputStream())
	                    .head(PaisExcelDTO.class)
	                    .sheet()
	                    .doReadSync();

	            for (PaisExcelDTO excelDTO : paisesList) {

	                // Validación del nombre
	                if (!Pattern.matches(NOMBRE_VALIDO_REGEX, excelDTO.getNombre())) {
	                    errores.add("El nombre del país " + excelDTO.getNombre() + " contiene caracteres especiales.");
	                    continue;
	                }

	                // Verificación de si el país ya existe
	                Pais paisExistente = paisService.findByNombre(excelDTO.getNombre());

	                if (paisExistente != null) {
	                    // Si el país ya existe pero ha sido eliminado lógicamente
	                    if (paisExistente.getDeletedAt() != null) {
	                        paisExistente.setDeletedAt(null); // Reactivar el registro
	                        paisExistente.setNombre(excelDTO.getNombre());
	                        paisExistente.setCodigo(excelDTO.getCodigo());
	                        paisExistente.setContinenteId(continenteService.findById(excelDTO.getContinenteId()).orElse(null));

	                        paisService.save(paisExistente);
	                    } else {
	                        errores.add("El país " + excelDTO.getNombre() + " ya existe en la base de datos.");
	                    }
	                    continue;
	                }

	                // Crear y guardar un nuevo país si no existe
	                Pais pais = new Pais();
	                pais.setNombre(excelDTO.getNombre());
	                pais.setCodigo(excelDTO.getCodigo());
	                pais.setContinenteId(continenteService.findById(excelDTO.getContinenteId()).orElse(null));

	                paisService.save(pais);
	            }

	            if (!errores.isEmpty()) {
	                throw new Exception(String.join(", ", errores));
	            }

	        } catch (Exception e) {
	            throw new RuntimeException("Error al procesar el archivo Excel: " + e.getMessage());
	        }
	    }
}
