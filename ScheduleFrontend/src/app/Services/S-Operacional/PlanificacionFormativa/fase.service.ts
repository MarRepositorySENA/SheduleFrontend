import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fase } from '../../../models/M-Operacional/PlanificacionFormativa/fase';

@Injectable({
  providedIn: 'root'
})
export class FaseService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/operational/planificacion_formativa/fase';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/planificacion_formativa/carga_masiva/fases';

  constructor(private http: HttpClient) {}

  getFases(): Observable<Fase[]> {
    return this.http.get<Fase[]>(this.apiUrl);
  }

  getFasesSinEliminar(): Observable<Fase[]> {
    return this.http.get<Fase[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createFase(fase: Fase): Observable<Fase> {
    return this.http.post<Fase>(this.apiUrl, fase);
  }

  updateFase(fase: Fase): Observable<Fase> {
    return this.http.put<Fase>(`${this.apiUrl}/${fase.id}`, fase);
  }

  deleteFase(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
