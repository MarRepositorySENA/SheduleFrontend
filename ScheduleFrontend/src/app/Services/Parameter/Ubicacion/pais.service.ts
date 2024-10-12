import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pais } from '../../../models/M-Parameter/Ubicacion/pais';

@Injectable({
  providedIn: 'root'
})
export class PaisService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/parameter/ubicacion/pais';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/ubicacion/carga_masiva/paises';

  constructor(private http: HttpClient) {}

  getPaises(): Observable<Pais[]> {
    return this.http.get<Pais[]>(this.apiUrl);
  }

  getPaisesSinEliminar(): Observable<Pais[]> {
    return this.http.get<Pais[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createPais(pais: Pais): Observable<Pais> {
    return this.http.post<Pais>(this.apiUrl, pais);
  }

  updatePais(pais: Pais): Observable<Pais> {
    return this.http.put<Pais>(`${this.apiUrl}/${pais.id}`, pais);
  }

  deletePais(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
