import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Piso } from '../../../models/M-Parameter/infraestructura/piso';

@Injectable({
  providedIn: 'root'
})
export class PisoService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/parameter/infraestructura/piso';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/infraestructura/carga_masiva/pisos'; 

  constructor(private http: HttpClient) {}

  getPisos(): Observable<Piso[]> {
    return this.http.get<Piso[]>(this.apiUrl);
  }

  getPisosSinEliminar(): Observable<Piso[]> {
    return this.http.get<Piso[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createPiso(piso: Piso): Observable<Piso> {
    return this.http.post<Piso>(this.apiUrl, piso);
  }

  updatePiso(piso: Piso): Observable<Piso> {
    return this.http.put<Piso>(`${this.apiUrl}/${piso.id}`, piso);
  }

  deletePiso(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
