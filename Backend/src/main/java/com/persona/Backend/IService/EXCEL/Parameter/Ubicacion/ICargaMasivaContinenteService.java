package com.persona.Backend.IService.EXCEL.Parameter.Ubicacion;

import org.springframework.web.multipart.MultipartFile;

public interface ICargaMasivaContinenteService {

	void procesarExcelContinente(MultipartFile file) throws Exception;
}
