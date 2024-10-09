package com.persona.Backend.IService.EXCEL.Parameter.Ubicacion;

import org.springframework.web.multipart.MultipartFile;

public interface ICargaMasivaPaisService {

	void procesarExcelPais(MultipartFile file) throws Exception;
}
