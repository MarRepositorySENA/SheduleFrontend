package com.persona.Backend.Dto.Excel.Parameter.Ubicacion;

public class DepartamentoExcelDTO {

	private String nombre;
    private String codigo;
    private Long paisId;  // Relación con el país

    // Getters y Setters
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public Long getPaisId() {
        return paisId;
    }

    public void setPaisId(Long paisId) {
        this.paisId = paisId;
    }
}
