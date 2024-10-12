import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CentroFormacion } from '../../../models/M-Parameter/infraestructura/centro-formacion';


@Injectable({
  providedIn: 'root'
})
export class CentroFormacionService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/parameter/infraestructura/centro_formacion';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/infraestructura/carga_masiva/centros_formacion'; 

  constructor(private http: HttpClient) {}

  getCentrosFormacion(): Observable<CentroFormacion[]> {
    return this.http.get<CentroFormacion[]>(this.apiUrl);
  }

  getCentrosFormacionSinEliminar(): Observable<CentroFormacion[]> {
    return this.http.get<CentroFormacion[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createCentroFormacion(centroFormacion: CentroFormacion): Observable<CentroFormacion> {
    return this.http.post<CentroFormacion>(this.apiUrl, centroFormacion);
  }

  updateCentroFormacion(centroFormacion: CentroFormacion): Observable<CentroFormacion> {
    return this.http.put<CentroFormacion>(`${this.apiUrl}/${centroFormacion.id}`, centroFormacion);
  }

  deleteCentroFormacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
