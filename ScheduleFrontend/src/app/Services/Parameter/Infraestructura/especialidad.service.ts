import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Especialidad } from '../../../models/M-Parameter/infraestructura/especialidad';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/parameter/infraestructura/Especialidad';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/infraestructura/carga_masiva/especialidades';

  constructor(private http: HttpClient) {}

  // Obtener todas las especialidades
  getEspecialidades(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(this.apiUrl);
  }

  // Obtener las especialidades sin eliminar
  getEspecialidadesSinEliminar(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  // Crear una nueva especialidad
  createEspecialidad(especialidad: Especialidad): Observable<Especialidad> {
    return this.http.post<Especialidad>(this.apiUrl, especialidad);
  }

  // Actualizar una especialidad
  updateEspecialidad(especialidad: Especialidad): Observable<Especialidad> {
    return this.http.put<Especialidad>(`${this.apiUrl}/${especialidad.id}`, especialidad);
  }

  // Eliminar una especialidad por su ID
  deleteEspecialidad(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Carga masiva de especialidades desde un archivo
  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
