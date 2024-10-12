import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Matricula } from '../../../models/M-Operacional/GestionHorario/matricula';


@Injectable({
  providedIn: 'root'
})
export class MatriculaService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/operational/gestion_horario/matricula';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/gestion_horario/carga_masiva/matriculas'; 

  constructor(private http: HttpClient) {}

  getMatriculas(): Observable<Matricula[]> {
    return this.http.get<Matricula[]>(this.apiUrl);
  }

  getMatriculasSinEliminar(): Observable<Matricula[]> {
    return this.http.get<Matricula[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createMatricula(matricula: Matricula): Observable<Matricula> {
    return this.http.post<Matricula>(this.apiUrl, matricula);
  }

  updateMatricula(matricula: Matricula): Observable<Matricula> {
    return this.http.put<Matricula>(`${this.apiUrl}/${matricula.id}`, matricula);
  }

  deleteMatricula(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
