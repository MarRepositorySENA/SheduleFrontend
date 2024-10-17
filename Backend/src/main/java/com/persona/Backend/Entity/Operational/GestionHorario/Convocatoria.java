package com.persona.Backend.Entity.Operational.GestionHorario;

import java.time.Year;

import com.persona.Backend.Entity.BaseEntity;
import com.persona.Backend.Entity.Enum.NumeroTrimestre;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name="convocatoria")
public class Convocatoria extends BaseEntity {

	@Column(name = "codigo", length = 40, nullable = false)
	private String codigo;

	@Column(name = "anio",  nullable = false)
	private int anio;
	
	@Column(name = "trimestre",  nullable = false)
	private String trimestre;

	public String getCodigo() {
		return codigo;
	}

	public void setCodigo(String codigo) {
		this.codigo = codigo;
	}

	public int getAnio() {
		return anio;
	}

	public void setAnio(int anio) {
		this.anio = anio;
	}

	public String getTrimestre() {
		return trimestre;
	}

	public void setTrimestre(String trimestre) {
		this.trimestre = trimestre;
	}
}
