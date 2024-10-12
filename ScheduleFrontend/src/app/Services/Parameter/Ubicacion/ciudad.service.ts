import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ciudad } from '../../../models/M-Parameter/Ubicacion/ciudad';

@Injectable({
  providedIn: 'root'
})
export class CiudadService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/parameter/ubicacion/ciudad';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/ubicacion/carga_masiva/ciudades'; 

  constructor(private http: HttpClient) {}

  getCiudades(): Observable<Ciudad[]> {
    return this.http.get<Ciudad[]>(this.apiUrl);
  }

  getCiudadesSinEliminar(): Observable<Ciudad[]> {
    return this.http.get<Ciudad[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createCiudad(ciudad: Ciudad): Observable<Ciudad> {
    return this.http.post<Ciudad>(this.apiUrl, ciudad);
  }

  updateCiudad(ciudad: Ciudad): Observable<Ciudad> {
    return this.http.put<Ciudad>(`${this.apiUrl}/${ciudad.id}`, ciudad);
  }

  deleteCiudad(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
