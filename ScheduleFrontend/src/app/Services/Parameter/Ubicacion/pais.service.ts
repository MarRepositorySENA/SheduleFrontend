import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pais } from '../../../models/M-Parameter/Ubicacion/pais';

@Injectable({
  providedIn: 'root'
})
export class PaisService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/parameter/ubicacion/pais';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/carga_masiva/paises'; // Endpoint de carga masiva

  constructor(private http: HttpClient) {}

  // Obtener países
  getPaises(): Observable<Pais[]> {
    return this.http.get<Pais[]>(this.apiUrl);
  }

  // Obtener países sin eliminar
  getPaisesSinEliminar(): Observable<Pais[]> {
    return this.http.get<Pais[]>(this.apiUrl + '/consultarRegistrosSinEliminar');
  }

  // Crear un país
  createPais(pais: Pais): Observable<Pais> {
    return this.http.post<Pais>(this.apiUrl, pais);
  }

  // Actualizar un país
  updatePais(pais: Pais): Observable<Pais> {
    return this.http.put<Pais>(`${this.apiUrl}/${pais.id}`, pais);
  }

  // Eliminar un país
  deletePais(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Cargar países desde un archivo Excel (Carga masiva)
  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); // Añadir el archivo al FormData

    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
