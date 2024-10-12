import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Regional } from '../../../models/M-Parameter/infraestructura/regional';


@Injectable({
  providedIn: 'root'
})
export class RegionalService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/parameter/infraestructura/regional';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/infraestructura/carga_masiva/regionales'; 

  constructor(private http: HttpClient) {}

  getRegionales(): Observable<Regional[]> {
    return this.http.get<Regional[]>(this.apiUrl);
  }

  getRegionalesSinEliminar(): Observable<Regional[]> {
    return this.http.get<Regional[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createRegional(regional: Regional): Observable<Regional> {
    return this.http.post<Regional>(this.apiUrl, regional);
  }

  updateRegional(regional: Regional): Observable<Regional> {
    return this.http.put<Regional>(`${this.apiUrl}/${regional.id}`, regional);
  }

  deleteRegional(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
