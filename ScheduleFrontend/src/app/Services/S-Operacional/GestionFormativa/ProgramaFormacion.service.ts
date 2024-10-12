import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProgramaFormacion } from '../../../models/M-Operacional/GestionFormativa/programa-formacion';


@Injectable({
  providedIn: 'root'
})
export class ProgramaFormacionService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/operational/gestion_formativa/programa_formacion';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/gestion_formativa/carga_masiva/programas_formacion'; 

  constructor(private http: HttpClient) {}

  getProgramasFormacion(): Observable<ProgramaFormacion[]> {
    return this.http.get<ProgramaFormacion[]>(this.apiUrl);
  }

  getProgramasFormacionSinEliminar(): Observable<ProgramaFormacion[]> {
    return this.http.get<ProgramaFormacion[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createProgramaFormacion(programaFormacion: ProgramaFormacion): Observable<ProgramaFormacion> {
    return this.http.post<ProgramaFormacion>(this.apiUrl, programaFormacion);
  }

  updateProgramaFormacion(programaFormacion: ProgramaFormacion): Observable<ProgramaFormacion> {
    return this.http.put<ProgramaFormacion>(`${this.apiUrl}/${programaFormacion.id}`, programaFormacion);
  }

  deleteProgramaFormacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
