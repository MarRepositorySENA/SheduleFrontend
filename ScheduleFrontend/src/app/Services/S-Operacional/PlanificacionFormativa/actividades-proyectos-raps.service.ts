import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActividadesProyectosRaps } from '../../../models/M-Operacional/PlanificacionFormativa/actividades-proyectos-raps';


@Injectable({
  providedIn: 'root'
})
export class ActividadesProyectosRapsService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/operational/planificacion_formativa/actividades_proyectos_raps';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/planificacion_formativa/carga_masiva/actividades_proyectos_raps';

  constructor(private http: HttpClient) {}

  getActividadesProyectosRaps(): Observable<ActividadesProyectosRaps[]> {
    return this.http.get<ActividadesProyectosRaps[]>(this.apiUrl);
  }

  getActividadesProyectosRapsSinEliminar(): Observable<ActividadesProyectosRaps[]> {
    return this.http.get<ActividadesProyectosRaps[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createActividadesProyectosRaps(actividadProyectoRap: ActividadesProyectosRaps): Observable<ActividadesProyectosRaps> {
    return this.http.post<ActividadesProyectosRaps>(this.apiUrl, actividadProyectoRap);
  }

  updateActividadesProyectosRaps(actividadProyectoRap: ActividadesProyectosRaps): Observable<ActividadesProyectosRaps> {
    return this.http.put<ActividadesProyectosRaps>(`${this.apiUrl}/${actividadProyectoRap.id}`, actividadProyectoRap);
  }

  deleteActividadesProyectosRaps(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
