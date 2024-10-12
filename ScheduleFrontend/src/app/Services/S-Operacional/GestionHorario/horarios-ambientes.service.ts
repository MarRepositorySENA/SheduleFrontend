import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HorariosAmbientes } from '../../../models/M-Operacional/GestionHorario/horarios-ambientes';


@Injectable({
  providedIn: 'root'
})
export class HorariosAmbientesService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/operational/gestion_horario/horarios_ambientes';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/gestion_horario/carga_masiva/horarios_ambientes'; 

  constructor(private http: HttpClient) {}

  getHorariosAmbientes(): Observable<HorariosAmbientes[]> {
    return this.http.get<HorariosAmbientes[]>(this.apiUrl);
  }

  getHorariosAmbientesSinEliminar(): Observable<HorariosAmbientes[]> {
    return this.http.get<HorariosAmbientes[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createHorariosAmbientes(horariosAmbientes: HorariosAmbientes): Observable<HorariosAmbientes> {
    return this.http.post<HorariosAmbientes>(this.apiUrl, horariosAmbientes);
  }

  updateHorariosAmbientes(horariosAmbientes: HorariosAmbientes): Observable<HorariosAmbientes> {
    return this.http.put<HorariosAmbientes>(`${this.apiUrl}/${horariosAmbientes.id}`, horariosAmbientes);
  }

  deleteHorariosAmbientes(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
