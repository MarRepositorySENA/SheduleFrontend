import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Continente } from '../../../models/M-Parameter/Ubicacion/continente';

@Injectable({
  providedIn: 'root'
})
export class ContinenteService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/parameter/ubicacion/continente';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/ubicacion/carga_masiva/continentes'; 

  constructor(private http: HttpClient) {}

  getContinentes(): Observable<Continente[]> {
    return this.http.get<Continente[]>(this.apiUrl);
  }

  getContinentesSinEliminar(): Observable<Continente[]> {
    return this.http.get<Continente[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createContinente(continente: Continente): Observable<Continente> {
    return this.http.post<Continente>(this.apiUrl, continente);
  }

  updateContinente(continente: Continente): Observable<Continente> {
    return this.http.put<Continente>(`${this.apiUrl}/${continente.id}`, continente);
  }

  deleteContinente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); 
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
