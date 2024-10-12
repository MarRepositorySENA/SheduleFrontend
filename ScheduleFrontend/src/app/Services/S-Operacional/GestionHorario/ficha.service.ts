import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ficha } from '../../../models/M-Operacional/GestionHorario/ficha';

@Injectable({
  providedIn: 'root'
})
export class FichaService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/operational/gestion_horario/ficha';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/gestion_horario/carga_masiva/Fichas';

  constructor(private http: HttpClient) {}

  // Obtener todas las fichas
  getFichas(): Observable<Ficha[]> {
    return this.http.get<Ficha[]>(this.apiUrl);
  }

  // Obtener las fichas sin eliminar
  getFichasSinEliminar(): Observable<Ficha[]> {
    return this.http.get<Ficha[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  // Crear una nueva ficha
  createFicha(ficha: Ficha): Observable<Ficha> {
    return this.http.post<Ficha>(this.apiUrl, ficha);
  }

  // Actualizar una ficha
  updateFicha(ficha: Ficha): Observable<Ficha> {
    return this.http.put<Ficha>(`${this.apiUrl}/${ficha.id}`, ficha);
  }

  // Eliminar una ficha por su ID
  deleteFicha(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Carga masiva de fichas desde un archivo
  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
