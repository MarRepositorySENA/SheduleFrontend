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

	private static final String NOMBRE_VALIDO_REGEX = "^[\\p{L}0-9\\s\\.]+$";

	@Override
	@Transactional
	public void procesarExcelContinente(MultipartFile file) throws Exception {
		List<String> errores = new ArrayList<>();

		try {
			// Leer el archivo Excel
			List<ContinenteExcelDTO> continentesList = EasyExcel.read(file.getInputStream())
					.head(ContinenteExcelDTO.class).sheet().doReadSync();

			for (ContinenteExcelDTO excelDTO : continentesList) {

				// Validación de nombre
				if (!Pattern.matches(NOMBRE_VALIDO_REGEX, excelDTO.getNombre())) {
					errores.add(
							"El nombre del continente " + excelDTO.getNombre() + " contiene caracteres especiales.");
					continue;
				}

				// Verificación si el continente ya existe
				Continente continenteExistente = continenteService.findByNombre(excelDTO.getNombre());

				if (continenteExistente != null) {
					// Si el continente ya existe, actualizamos los campos
					continenteExistente.setCodigo(excelDTO.getCodigo());
					continenteExistente.setDeletedAt(null); // Reactivar si estaba eliminado
					continenteExistente.setState(true); // Asegurar que el estado es activo
					continenteService.save(continenteExistente); // Aquí se actualiza correctamente
				} else {
					// Si no existe, crear un nuevo registro
					Continente nuevoContinente = new Continente();
					nuevoContinente.setNombre(excelDTO.getNombre());
					nuevoContinente.setCodigo(excelDTO.getCodigo());
					nuevoContinente.setState(true); // Estado por defecto activo
					continenteService.save(nuevoContinente);
				}
			}

			if (!errores.isEmpty()) {
				throw new Exception(String.join(", ", errores));
			}

		} catch (Exception e) {
			throw new RuntimeException("Error al procesar el archivo Excel: " + e.getMessage());
		}
	}
}
