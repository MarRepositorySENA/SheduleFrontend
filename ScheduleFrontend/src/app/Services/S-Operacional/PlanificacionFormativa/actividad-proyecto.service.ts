import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActividadProyecto } from '../../../models/M-Operacional/PlanificacionFormativa/actividad-proyecto';


@Injectable({
  providedIn: 'root'
})
export class ActividadProyectoService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/operational/planificacion_formativa/actividad_proyecto';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/planificacion_formativa/carga_masiva/actividades_proyectos'; 

  constructor(private http: HttpClient) {}

  getActividadesProyecto(): Observable<ActividadProyecto[]> {
    return this.http.get<ActividadProyecto[]>(this.apiUrl);
  }

  getActividadesProyectoSinEliminar(): Observable<ActividadProyecto[]> {
    return this.http.get<ActividadProyecto[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createActividadProyecto(actividadProyecto: ActividadProyecto): Observable<ActividadProyecto> {
    return this.http.post<ActividadProyecto>(this.apiUrl, actividadProyecto);
  }

  updateActividadProyecto(actividadProyecto: ActividadProyecto): Observable<ActividadProyecto> {
    return this.http.put<ActividadProyecto>(`${this.apiUrl}/${actividadProyecto.id}`, actividadProyecto);
  }

  deleteActividadProyecto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
