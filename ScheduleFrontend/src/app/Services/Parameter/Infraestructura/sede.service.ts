import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sede } from '../../../models/M-Parameter/infraestructura/sede';


@Injectable({
  providedIn: 'root'
})
export class SedeService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/parameter/infraestructura/sede';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/infraestructura/carga_masiva/sedes'; 

  constructor(private http: HttpClient) {}

  getSedes(): Observable<Sede[]> {
    return this.http.get<Sede[]>(this.apiUrl);
  }

  getSedesSinEliminar(): Observable<Sede[]> {
    return this.http.get<Sede[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createSede(sede: Sede): Observable<Sede> {
    return this.http.post<Sede>(this.apiUrl, sede);
  }

  updateSede(sede: Sede): Observable<Sede> {
    return this.http.put<Sede>(`${this.apiUrl}/${sede.id}`, sede);
  }

  deleteSede(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
