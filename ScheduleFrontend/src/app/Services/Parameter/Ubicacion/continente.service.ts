import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Continente } from '../../../models/M-Parameter/Ubicacion/continente';

@Injectable({
  providedIn: 'root'
})
export class ContinenteService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/parameter/ubicacion/continente';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/carga_masiva/continentes'; // Endpoint de carga masiva

  constructor(private http: HttpClient) {}

  // Obtener continentes
  getContinentes(): Observable<Continente[]> {
    return this.http.get<Continente[]>(this.apiUrl);
  }

  // Obtener continentes activos sin eliminar
  getContinentesSinEliminarActivos(): Observable<Continente[]> {
    return this.http.get<Continente[]>(this.apiUrl + '/consultarRegistrosSinEliminarActivos');
  }

  // Obtener continentes sin eliminar
  getContinentesSinEliminar(): Observable<Continente[]> {
    return this.http.get<Continente[]>(this.apiUrl + '/consultarRegistrosSinEliminar');
  }

  // Crear un continente
  createContinente(continente: Continente): Observable<Continente> {
    return this.http.post<Continente>(this.apiUrl, continente);
  }

  // Actualizar un continente
  updateContinente(continente: Continente): Observable<Continente> {
    return this.http.put<Continente>(`${this.apiUrl}/${continente.id}`, continente);
  }

  // Eliminar un continente
  deleteContinente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Cargar continentes desde un archivo Excel (Carga masiva)
  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); // Añadir el archivo al FormData

    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
