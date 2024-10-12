package com.persona.Backend.Service.Excel.Parameter.Ubicacion;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;
import java.util.logging.Logger;

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

    // Logger para agregar logs
    private static final Logger logger = Logger.getLogger(CargaMasivaContinenteService.class.getName());

    @Autowired
    private IContinenteService continenteService;

    private static final String NOMBRE_VALIDO_REGEX = "^[\\p{L}0-9\\s\\.]+$";

    @Override
    @Transactional
    public void procesarExcelContinente(MultipartFile file) throws Exception {
        List<String> errores = new ArrayList<>();

        try {
            logger.info("Iniciando la lectura del archivo Excel");

            // Leer el archivo Excel
            List<ContinenteExcelDTO> continentesList = EasyExcel.read(file.getInputStream())
                    .head(ContinenteExcelDTO.class).sheet().doReadSync();

            logger.info("Archivo Excel leído correctamente, procesando los continentes...");

            for (ContinenteExcelDTO excelDTO : continentesList) {
                logger.info("Procesando continente: " + excelDTO.getNombre());

                // Validación de nombre
                if (!Pattern.matches(NOMBRE_VALIDO_REGEX, excelDTO.getNombre())) {
                    String errorMsg = "El nombre del continente " + excelDTO.getNombre() + " contiene caracteres especiales.";
                    logger.warning(errorMsg);
                    errores.add(errorMsg);
                    continue;
                }

                // Verificación si el continente ya existe
                Continente continenteExistente = continenteService.findByNombre(excelDTO.getNombre());

                if (continenteExistente != null) {
                    // Si el continente ya existe, actualizamos los campos
                    try {
                        logger.info("Actualizando continente existente: " + continenteExistente.getNombre());
                        updateContinente(continenteExistente, excelDTO);
                    } catch (Exception e) {
                        String errorMsg = "Error al actualizar el continente: " + continenteExistente.getNombre() + ". " + e.getMessage();
                        logger.severe(errorMsg);
                        errores.add(errorMsg);
                    }
                } else {
                    // Si no existe, crear un nuevo registro
                    try {
                        logger.info("Creando nuevo continente: " + excelDTO.getNombre());
                        createContinente(excelDTO);
                    } catch (Exception e) {
                        String errorMsg = "Error al crear el continente: " + excelDTO.getNombre() + ". " + e.getMessage();
                        logger.severe(errorMsg);
                        errores.add(errorMsg);
                    }
                }
            }

            if (!errores.isEmpty()) {
                logger.warning("Errores encontrados: " + String.join(", ", errores));
                throw new Exception(String.join(", ", errores));
            }

        } catch (Exception e) {
            logger.severe("Error al procesar el archivo Excel: " + e.getMessage());
            throw new RuntimeException("Error al procesar el archivo Excel: " + e.getMessage());
        }
    }

    // Método para crear un nuevo continente
    private void createContinente(ContinenteExcelDTO excelDTO) throws Exception {
        Continente nuevoContinente = new Continente();
        nuevoContinente.setNombre(excelDTO.getNombre());
        nuevoContinente.setCodigo(excelDTO.getCodigo());
        nuevoContinente.setState(true); // Estado por defecto activo
        continenteService.save(nuevoContinente); // Guardamos el nuevo continente
        logger.info("Nuevo continente creado: " + nuevoContinente.getNombre());
    }

    // Método para actualizar un continente existente
    private void updateContinente(Continente continenteExistente, ContinenteExcelDTO excelDTO) throws Exception {
        continenteExistente.setCodigo(excelDTO.getCodigo());

        // Actualizamos el estado solo si viene en el archivo Excel
        if (excelDTO.getState() != null) {
            continenteExistente.setState(excelDTO.getState());
        }

        // Reactivamos el continente si estaba eliminado
        continenteExistente.setDeletedAt(null);

        // Guardamos la actualización utilizando el servicio base para manejar auditorías y actualización correcta
        continenteService.save(continenteExistente);
        logger.info("Continente actualizado: " + continenteExistente.getNombre());
    }
}
