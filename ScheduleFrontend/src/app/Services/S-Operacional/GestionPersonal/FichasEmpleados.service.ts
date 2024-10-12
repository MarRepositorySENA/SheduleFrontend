import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FichasEmpleados } from '../../../models/M-Operacional/GestionPersonal/fichas-empleados';


@Injectable({
  providedIn: 'root'
})
export class FichasEmpleadosService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/operational/gestion_personal/fichas_empleados';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/gestion_personal/carga_masiva/fichas_empleados'; 

  constructor(private http: HttpClient) {}

  getFichasEmpleados(): Observable<FichasEmpleados[]> {
    return this.http.get<FichasEmpleados[]>(this.apiUrl);
  }

  getFichasEmpleadosSinEliminar(): Observable<FichasEmpleados[]> {
    return this.http.get<FichasEmpleados[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createFichasEmpleados(fichasEmpleados: FichasEmpleados): Observable<FichasEmpleados> {
    return this.http.post<FichasEmpleados>(this.apiUrl, fichasEmpleados);
  }

  updateFichasEmpleados(fichasEmpleados: FichasEmpleados): Observable<FichasEmpleados> {
    return this.http.put<FichasEmpleados>(`${this.apiUrl}/${fichasEmpleados.id}`, fichasEmpleados);
  }

  deleteFichasEmpleados(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
