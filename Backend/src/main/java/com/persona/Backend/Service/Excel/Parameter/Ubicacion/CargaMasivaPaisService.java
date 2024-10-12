package com.persona.Backend.Service.Excel.Parameter.Ubicacion;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

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

    // Logger para agregar logs
    private static final Logger logger = Logger.getLogger(CargaMasivaPaisService.class.getName());

    @Autowired
    private IPaisService paisService;

    @Autowired
    private IContinenteService continenteService;

    @Override
    @Transactional
    public void procesarExcelPais(MultipartFile file) throws Exception {
        List<String> errores = new ArrayList<>();

        try {
            logger.info("Iniciando la lectura del archivo Excel");

            // Leer el archivo Excel
            List<PaisExcelDTO> paisesList = EasyExcel.read(file.getInputStream())
                    .head(PaisExcelDTO.class).sheet().doReadSync();

            logger.info("Archivo Excel leído correctamente, procesando los países...");

            for (PaisExcelDTO excelDTO : paisesList) {
                logger.info("Procesando país: " + excelDTO.getNombre());

                // Verificación de si el país ya existe
                Pais paisExistente = paisService.findByNombre(excelDTO.getNombre());

                if (paisExistente != null) {
                    // Si el país ya existe, actualizamos los campos
                    try {
                        logger.info("Actualizando país existente: " + paisExistente.getNombre());
                        updatePais(paisExistente, excelDTO);
                    } catch (Exception e) {
                        String errorMsg = "Error al actualizar el país: " + paisExistente.getNombre() + ". " + e.getMessage();
                        logger.severe(errorMsg);
                        errores.add(errorMsg);
                    }
                } else {
                    // Si no existe, crear un nuevo registro
                    try {
                        logger.info("Creando nuevo país: " + excelDTO.getNombre());
                        createPais(excelDTO);
                    } catch (Exception e) {
                        String errorMsg = "Error al crear el país: " + excelDTO.getNombre() + ". " + e.getMessage();
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

    // Método para crear un nuevo país
    private void createPais(PaisExcelDTO excelDTO) throws Exception {
        Pais nuevoPais = new Pais();
        nuevoPais.setNombre(excelDTO.getNombre());
        nuevoPais.setCodigo(excelDTO.getCodigo());
        nuevoPais.setState(excelDTO.getState() != null ? excelDTO.getState() : true); // Estado por defecto activo
        nuevoPais.setContinenteId(continenteService.findById(excelDTO.getContinenteId()).orElse(null)); // Asignar el continente

        paisService.save(nuevoPais); // Guardamos el nuevo país
        logger.info("Nuevo país creado: " + nuevoPais.getNombre());
    }

    // Método para actualizar un país existente
    private void updatePais(Pais paisExistente, PaisExcelDTO excelDTO) throws Exception {
        paisExistente.setCodigo(excelDTO.getCodigo());

        // Actualizamos el estado solo si viene en el archivo Excel
        if (excelDTO.getState() != null) {
            paisExistente.setState(excelDTO.getState());
        }

        // Reactivamos el país si estaba eliminado
        paisExistente.setDeletedAt(null);

        // Asignar el continente
        paisExistente.setContinenteId(continenteService.findById(excelDTO.getContinenteId()).orElse(null));

        // Guardamos la actualización utilizando el servicio base
        paisService.save(paisExistente);
        logger.info("País actualizado: " + paisExistente.getNombre());
    }
}
