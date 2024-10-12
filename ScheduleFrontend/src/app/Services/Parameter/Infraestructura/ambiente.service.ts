import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ambiente } from '../../../models/M-Parameter/infraestructura/ambiente';


@Injectable({
  providedIn: 'root'
})
export class AmbienteService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/parameter/infraestructura/ambiente';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/infraestructura/carga_masiva/ambientes';

  constructor(private http: HttpClient) {}

  getAmbientes(): Observable<Ambiente[]> {
    return this.http.get<Ambiente[]>(this.apiUrl);
  }

  getAmbientesSinEliminar(): Observable<Ambiente[]> {
    return this.http.get<Ambiente[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createAmbiente(ambiente: Ambiente): Observable<Ambiente> {
    return this.http.post<Ambiente>(this.apiUrl, ambiente);
  }

  updateAmbiente(ambiente: Ambiente): Observable<Ambiente> {
    return this.http.put<Ambiente>(`${this.apiUrl}/${ambiente.id}`, ambiente);
  }

  deleteAmbiente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
