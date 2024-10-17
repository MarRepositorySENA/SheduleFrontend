import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Competencia } from '../../../models/M-Operacional/GestionFormativa/competencia';


@Injectable({
  providedIn: 'root'
})
export class CompetenciaService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/operational/gestion_formativa/competencia';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/gestion_formativa/carga_masiva/competencias';

  constructor(private http: HttpClient) {}

  getCompetencias(): Observable<Competencia[]> {
    return this.http.get<Competencia[]>(this.apiUrl);
  }

  getCompetenciasSinEliminar(): Observable<Competencia[]> {
    return this.http.get<Competencia[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createCompetencia(competencia: Competencia): Observable<Competencia> {
    return this.http.post<Competencia>(this.apiUrl, competencia);
  }

  updateCompetencia(competencia: Competencia): Observable<Competencia> {
    return this.http.put<Competencia>(`${this.apiUrl}/${competencia.id}`, competencia);
  }

  deleteCompetencia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
