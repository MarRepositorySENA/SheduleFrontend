import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rap } from '../../../models/M-Operacional/GestionFormativa/rap';

@Injectable({
  providedIn: 'root'
})
export class RapService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/operational/gestion_formativa/rap';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/gestion_formativa/carga_masiva/raps'; 

  constructor(private http: HttpClient) {}

  getRaps(): Observable<Rap[]> {
    return this.http.get<Rap[]>(this.apiUrl);
  }

  getRapsSinEliminar(): Observable<Rap[]> {
    return this.http.get<Rap[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createRap(rap: Rap): Observable<Rap> {
    return this.http.post<Rap>(this.apiUrl, rap);
  }

  updateRap(rap: Rap): Observable<Rap> {
    return this.http.put<Rap>(`${this.apiUrl}/${rap.id}`, rap);
  }

  deleteRap(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
