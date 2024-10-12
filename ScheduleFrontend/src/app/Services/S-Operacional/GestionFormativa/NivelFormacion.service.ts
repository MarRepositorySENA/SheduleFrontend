import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NivelFormacion } from '../../../models/M-Operacional/GestionFormativa/nivel-formacion';


@Injectable({
  providedIn: 'root'
})
export class NivelFormacionService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/operational/gestion_formativa/nivel_formacion';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/gestion_formativa/carga_masiva/niveles_formacion'; 

  constructor(private http: HttpClient) {}

  getNivelesFormacion(): Observable<NivelFormacion[]> {
    return this.http.get<NivelFormacion[]>(this.apiUrl);
  }

  getNivelesFormacionSinEliminar(): Observable<NivelFormacion[]> {
    return this.http.get<NivelFormacion[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createNivelFormacion(nivelFormacion: NivelFormacion): Observable<NivelFormacion> {
    return this.http.post<NivelFormacion>(this.apiUrl, nivelFormacion);
  }

  updateNivelFormacion(nivelFormacion: NivelFormacion): Observable<NivelFormacion> {
    return this.http.put<NivelFormacion>(`${this.apiUrl}/${nivelFormacion.id}`, nivelFormacion);
  }

  deleteNivelFormacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
