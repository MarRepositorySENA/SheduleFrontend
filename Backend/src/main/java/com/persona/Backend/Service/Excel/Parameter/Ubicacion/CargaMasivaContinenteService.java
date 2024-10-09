package com.persona.Backend.Service.Excel.Parameter.Ubicacion;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import com.alibaba.excel.EasyExcel;
import com.persona.Backend.Dto.Excel.Parameter.Ubicacion.ContinenteExcelDTO;
import com.persona.Backend.Entity.Parameter.Ubicacion.Continente;
import com.persona.Backend.IService.EXCEL.Parameter.Ubicacion.ICargaMasivaContinenteService;
import com.persona.Backend.IService.Parameter.Ubicacion.IContinenteService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.transaction.Transactional;

@Service
public class CargaMasivaContinenteService implements ICargaMasivaContinenteService {

    @Autowired
    private IContinenteService continenteService;

 // Expresión regular para permitir letras, números, espacios, y puntos
    private static final String NOMBRE_VALIDO_REGEX = "^[\\p{L}0-9\\s\\.]+$"; 

    @Override
    @Transactional
    public void procesarExcelContinente(MultipartFile file) throws Exception {
        List<String> errores = new ArrayList<>();

        try {
            // Leer el archivo Excel
            List<ContinenteExcelDTO> continentesList = EasyExcel.read(file.getInputStream())
                    .head(ContinenteExcelDTO.class)
                    .sheet()
                    .doReadSync();

            for (ContinenteExcelDTO excelDTO : continentesList) {

                // Validación de nombre
                if (!Pattern.matches(NOMBRE_VALIDO_REGEX, excelDTO.getNombre())) {
                    errores.add("El nombre del continente " + excelDTO.getNombre() + " contiene caracteres especiales.");
                    continue;
                }

                // Verificación si el continente ya existe
                Continente continenteExistente = continenteService.findByNombre(excelDTO.getNombre());

                if (continenteExistente != null) {
                    // Si existe pero ha sido eliminado lógicamente
                    if (continenteExistente.getDeletedAt() != null) {
                        continenteExistente.setDeletedAt(null); // Reactivar el continente
                        continenteExistente.setCodigo(excelDTO.getCodigo());

                        continenteService.save(continenteExistente);
                    } else {
                        // Si el registro no está eliminado lógicamente, generar error
                        errores.add("El continente " + excelDTO.getNombre() + " ya existe en la base de datos.");
                    }
                    continue;
                }

                // Crear y guardar un nuevo continente
                Continente continente = new Continente();
                continente.setNombre(excelDTO.getNombre());
                continente.setCodigo(excelDTO.getCodigo());

                continenteService.save(continente);
            }

            if (!errores.isEmpty()) {
                throw new Exception(String.join(", ", errores));
            }

        } catch (Exception e) {
            throw new RuntimeException("Error al procesar el archivo Excel: " + e.getMessage());
        }
    }
}
