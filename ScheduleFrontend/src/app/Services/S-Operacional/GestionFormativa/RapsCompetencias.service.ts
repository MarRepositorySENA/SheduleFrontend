import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RapsCompetencias } from '../../../models/M-Operacional/GestionFormativa/raps-competencias';


@Injectable({
  providedIn: 'root'
})
export class RapsCompetenciasService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/operational/gestion_formativa/raps_competencias';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/gestion_formativa/carga_masiva/raps_competencias'; 

  constructor(private http: HttpClient) {}

  getRapsCompetencias(): Observable<RapsCompetencias[]> {
    return this.http.get<RapsCompetencias[]>(this.apiUrl);
  }

  getRapsCompetenciasSinEliminar(): Observable<RapsCompetencias[]> {
    return this.http.get<RapsCompetencias[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createRapsCompetencias(rapsCompetencias: RapsCompetencias): Observable<RapsCompetencias> {
    return this.http.post<RapsCompetencias>(this.apiUrl, rapsCompetencias);
  }

  updateRapsCompetencias(rapsCompetencias: RapsCompetencias): Observable<RapsCompetencias> {
    return this.http.put<RapsCompetencias>(`${this.apiUrl}/${rapsCompetencias.id}`, rapsCompetencias);
  }

  deleteRapsCompetencias(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
