import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Convocatoria } from '../../../models/M-Operacional/GestionHorario/convocatoria';


@Injectable({
  providedIn: 'root'
})
export class ConvocatoriaService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/operational/gestion_horario/convocatoria';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/gestion_horario/carga_masiva/convocatorias'; 

  constructor(private http: HttpClient) {}

  getConvocatorias(): Observable<Convocatoria[]> {
    return this.http.get<Convocatoria[]>(this.apiUrl);
  }

  getConvocatoriasSinEliminar(): Observable<Convocatoria[]> {
    return this.http.get<Convocatoria[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createConvocatoria(convocatoria: Convocatoria): Observable<Convocatoria> {
    return this.http.post<Convocatoria>(this.apiUrl, convocatoria);
  }

  updateConvocatoria(convocatoria: Convocatoria): Observable<Convocatoria> {
    return this.http.put<Convocatoria>(`${this.apiUrl}/${convocatoria.id}`, convocatoria);
  }

  deleteConvocatoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
