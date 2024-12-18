package com.persona.Backend.Dto.Excel.Parameter.Ubicacion;

public class PaisExcelDTO {

	private String nombre;
    private String codigo;
    private Long continenteId; // Esto se utilizará para enlazar el país con un continente.
    private Boolean state; 

    // Getters y Setters
    
    public String getNombre() {
        return nombre;
    }

    public Boolean getState() {
		return state;
	}

	public void setState(Boolean state) {
		this.state = state;
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

    public Long getContinenteId() {
        return continenteId;
    }

    public void setContinenteId(Long continenteId) {
        this.continenteId = continenteId;
    }
}
