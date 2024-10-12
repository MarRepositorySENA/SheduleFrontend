import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProyectoFormativo } from '../../../models/M-Operacional/PlanificacionFormativa/proyecto-formativo';


@Injectable({
  providedIn: 'root'
})
export class ProyectoFormativoService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/operational/planificacion_formativa/proyecto_formativo';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/planificacion_formativa/carga_masiva/proyectos_formativos'; 

  constructor(private http: HttpClient) {}

  getProyectosFormativos(): Observable<ProyectoFormativo[]> {
    return this.http.get<ProyectoFormativo[]>(this.apiUrl);
  }

  getProyectosFormativosSinEliminar(): Observable<ProyectoFormativo[]> {
    return this.http.get<ProyectoFormativo[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createProyectoFormativo(proyectoFormativo: ProyectoFormativo): Observable<ProyectoFormativo> {
    return this.http.post<ProyectoFormativo>(this.apiUrl, proyectoFormativo);
  }

  updateProyectoFormativo(proyectoFormativo: ProyectoFormativo): Observable<ProyectoFormativo> {
    return this.http.put<ProyectoFormativo>(`${this.apiUrl}/${proyectoFormativo.id}`, proyectoFormativo);
  }

  deleteProyectoFormativo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
