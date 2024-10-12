import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoFormacion } from '../../../models/M-Operacional/GestionFormativa/tipo-formacion';


@Injectable({
  providedIn: 'root'
})
export class TipoFormacionService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/operational/gestion_formativa/tipo_formacion';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/gestion_formativa/carga_masiva/tipos_formacion'; 

  constructor(private http: HttpClient) {}

  getTiposFormacion(): Observable<TipoFormacion[]> {
    return this.http.get<TipoFormacion[]>(this.apiUrl);
  }

  getTiposFormacionSinEliminar(): Observable<TipoFormacion[]> {
    return this.http.get<TipoFormacion[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createTipoFormacion(tipoFormacion: TipoFormacion): Observable<TipoFormacion> {
    return this.http.post<TipoFormacion>(this.apiUrl, tipoFormacion);
  }

  updateTipoFormacion(tipoFormacion: TipoFormacion): Observable<TipoFormacion> {
    return this.http.put<TipoFormacion>(`${this.apiUrl}/${tipoFormacion.id}`, tipoFormacion);
  }

  deleteTipoFormacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
