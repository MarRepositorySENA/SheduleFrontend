import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Modalidad } from '../../../models/M-Operacional/GestionFormativa/modalidad';


@Injectable({
  providedIn: 'root'
})
export class ModalidadService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/operational/gestion_formativa/modalidad';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/gestion_formativa/carga_masiva/modalidades'; 

  constructor(private http: HttpClient) {}

  getModalidades(): Observable<Modalidad[]> {
    return this.http.get<Modalidad[]>(this.apiUrl);
  }

  getModalidadesSinEliminar(): Observable<Modalidad[]> {
    return this.http.get<Modalidad[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createModalidad(modalidad: Modalidad): Observable<Modalidad> {
    return this.http.post<Modalidad>(this.apiUrl, modalidad);
  }

  updateModalidad(modalidad: Modalidad): Observable<Modalidad> {
    return this.http.put<Modalidad>(`${this.apiUrl}/${modalidad.id}`, modalidad);
  }

  deleteModalidad(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
