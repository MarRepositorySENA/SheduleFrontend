import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Funciones } from '../../../models/M-Operacional/GestionPersonal/funciones';


@Injectable({
  providedIn: 'root'
})
export class FuncionesService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/operational/gestion_personal/funciones';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/gestion_personal/carga_masiva/funciones'; 

  constructor(private http: HttpClient) {}

  getFunciones(): Observable<Funciones[]> {
    return this.http.get<Funciones[]>(this.apiUrl);
  }

  getFuncionesSinEliminar(): Observable<Funciones[]> {
    return this.http.get<Funciones[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createFunciones(funciones: Funciones): Observable<Funciones> {
    return this.http.post<Funciones>(this.apiUrl, funciones);
  }

  updateFunciones(funciones: Funciones): Observable<Funciones> {
    return this.http.put<Funciones>(`${this.apiUrl}/${funciones.id}`, funciones);
  }

  deleteFunciones(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
