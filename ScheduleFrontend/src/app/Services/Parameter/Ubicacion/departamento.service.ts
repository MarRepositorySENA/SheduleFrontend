import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Departamento } from '../../../models/M-Parameter/Ubicacion/departamento';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/parameter/ubicacion/departamento';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/ubicacion/carga_masiva/departamentos'; // Endpoint de carga masiva

  constructor(private http: HttpClient) {}

  // Obtener departamentos
  getDepartamentos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(this.apiUrl);
  }

  // Obtener departamentos sin eliminar
  getDepartamentosSinEliminar(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(this.apiUrl + '/consultarRegistrosSinEliminar');
  }

  // Crear un departamento
  createDepartamento(departamento: Departamento): Observable<Departamento> {
    return this.http.post<Departamento>(this.apiUrl, departamento);
  }

  // Actualizar un departamento
  updateDepartamento(departamento: Departamento): Observable<Departamento> {
    return this.http.put<Departamento>(`${this.apiUrl}/${departamento.id}`, departamento);
  }

  // Eliminar un departamento
  deleteDepartamento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Cargar departamentos desde un archivo Excel (Carga masiva)
  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); // Añadir el archivo al FormData

    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
