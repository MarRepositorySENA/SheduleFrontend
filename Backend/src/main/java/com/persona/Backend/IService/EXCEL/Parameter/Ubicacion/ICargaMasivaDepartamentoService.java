package com.persona.Backend.IService.EXCEL.Parameter.Ubicacion;

import org.springframework.web.multipart.MultipartFile;

public interface ICargaMasivaDepartamentoService {

	void procesarExcelDepartamento(MultipartFile file) throws Exception;
}
