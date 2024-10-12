import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProgramacionFicha } from '../../../models/M-Operacional/GestionHorario/programacion-ficha';


@Injectable({
  providedIn: 'root'
})
export class ProgramacionFichaService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/operational/gestion_horario/programacion_ficha';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/gestion_horario/carga_masiva/programacion_fichas'; 

  constructor(private http: HttpClient) {}

  getProgramacionesFicha(): Observable<ProgramacionFicha[]> {
    return this.http.get<ProgramacionFicha[]>(this.apiUrl);
  }

  getProgramacionesFichaSinEliminar(): Observable<ProgramacionFicha[]> {
    return this.http.get<ProgramacionFicha[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createProgramacionFicha(programacionFicha: ProgramacionFicha): Observable<ProgramacionFicha> {
    return this.http.post<ProgramacionFicha>(this.apiUrl, programacionFicha);
  }

  updateProgramacionFicha(programacionFicha: ProgramacionFicha): Observable<ProgramacionFicha> {
    return this.http.put<ProgramacionFicha>(`${this.apiUrl}/${programacionFicha.id}`, programacionFicha);
  }

  deleteProgramacionFicha(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
