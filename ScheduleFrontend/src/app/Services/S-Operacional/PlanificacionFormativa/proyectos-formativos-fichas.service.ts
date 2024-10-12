import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProyectosFormativosFichas } from '../../../models/M-Operacional/PlanificacionFormativa/proyectos-formativos-fichas'; // Asegúrate de que la ruta sea correcta

@Injectable({
  providedIn: 'root'
})
export class ProyectosFormativosFichasService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/operational/planificacion_formativa/proyectos_formativos_fichas';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/planificacion_formativa/carga_masiva/proyectos_formativos_fichas';

  constructor(private http: HttpClient) {}

  getProyectosFormativosFichas(): Observable<ProyectosFormativosFichas[]> {
    return this.http.get<ProyectosFormativosFichas[]>(this.apiUrl);
  }

  getProyectosFormativosFichasSinEliminar(): Observable<ProyectosFormativosFichas[]> {
    return this.http.get<ProyectosFormativosFichas[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createProyectoFormativoFicha(proyectoFormativoFicha: ProyectosFormativosFichas): Observable<ProyectosFormativosFichas> {
    return this.http.post<ProyectosFormativosFichas>(this.apiUrl, proyectoFormativoFicha);
  }

  updateProyectoFormativoFicha(proyectoFormativoFicha: ProyectosFormativosFichas): Observable<ProyectosFormativosFichas> {
    return this.http.put<ProyectosFormativosFichas>(`${this.apiUrl}/${proyectoFormativoFicha.id}`, proyectoFormativoFicha);
  }

  deleteProyectoFormativoFicha(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
