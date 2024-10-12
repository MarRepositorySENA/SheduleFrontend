import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HorariosEmpleados } from '../../../models/M-Operacional/GestionPersonal/horarios-empleados';


@Injectable({
  providedIn: 'root'
})
export class HorariosEmpleadosService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/operational/gestion_personal/horarios_empleados';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/gestion_personal/carga_masiva/horarios_empleados'; 

  constructor(private http: HttpClient) {}

  getHorariosEmpleados(): Observable<HorariosEmpleados[]> {
    return this.http.get<HorariosEmpleados[]>(this.apiUrl);
  }

  getHorariosEmpleadosSinEliminar(): Observable<HorariosEmpleados[]> {
    return this.http.get<HorariosEmpleados[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createHorariosEmpleados(horariosEmpleados: HorariosEmpleados): Observable<HorariosEmpleados> {
    return this.http.post<HorariosEmpleados>(this.apiUrl, horariosEmpleados);
  }

  updateHorariosEmpleados(horariosEmpleados: HorariosEmpleados): Observable<HorariosEmpleados> {
    return this.http.put<HorariosEmpleados>(`${this.apiUrl}/${horariosEmpleados.id}`, horariosEmpleados);
  }

  deleteHorariosEmpleados(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
