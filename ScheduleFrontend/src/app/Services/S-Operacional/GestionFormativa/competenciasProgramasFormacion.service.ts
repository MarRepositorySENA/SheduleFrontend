import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompetenciasProgramasFormacion } from '../../../models/M-Operacional/GestionFormativa/competencias-programas-formacion';


@Injectable({
  providedIn: 'root'
})
export class CompetenciasProgramasFormacionService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/operational/gestion_formativa/competencias_programas_formacion';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/gestion_formativa/carga_masiva/competencias_programas_formacion'; 

  constructor(private http: HttpClient) {}

  getCompetenciasProgramasFormacion(): Observable<CompetenciasProgramasFormacion[]> {
    return this.http.get<CompetenciasProgramasFormacion[]>(this.apiUrl);
  }

  getCompetenciasProgramasFormacionSinEliminar(): Observable<CompetenciasProgramasFormacion[]> {
    return this.http.get<CompetenciasProgramasFormacion[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createCompetenciasProgramasFormacion(competenciasProgramasFormacion: CompetenciasProgramasFormacion): Observable<CompetenciasProgramasFormacion> {
    return this.http.post<CompetenciasProgramasFormacion>(this.apiUrl, competenciasProgramasFormacion);
  }

  updateCompetenciasProgramasFormacion(competenciasProgramasFormacion: CompetenciasProgramasFormacion): Observable<CompetenciasProgramasFormacion> {
    return this.http.put<CompetenciasProgramasFormacion>(`${this.apiUrl}/${competenciasProgramasFormacion.id}`, competenciasProgramasFormacion);
  }

  deleteCompetenciasProgramasFormacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
