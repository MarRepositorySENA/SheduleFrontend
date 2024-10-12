import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoContrato } from '../../../models/M-Operacional/GestionPersonal/tipo-contrato';


@Injectable({
  providedIn: 'root'
})
export class TipoContratoService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/operational/gestion_personal/tipo_contrato';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/gestion_personal/carga_masiva/tipos_contratos'; 

  constructor(private http: HttpClient) {}

  getTipoContratos(): Observable<TipoContrato[]> {
    return this.http.get<TipoContrato[]>(this.apiUrl);
  }

  getTipoContratosSinEliminar(): Observable<TipoContrato[]> {
    return this.http.get<TipoContrato[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createTipoContrato(tipoContrato: TipoContrato): Observable<TipoContrato> {
    return this.http.post<TipoContrato>(this.apiUrl, tipoContrato);
  }

  updateTipoContrato(tipoContrato: TipoContrato): Observable<TipoContrato> {
    return this.http.put<TipoContrato>(`${this.apiUrl}/${tipoContrato.id}`, tipoContrato);
  }

  deleteTipoContrato(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
