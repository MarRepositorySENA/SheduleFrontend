import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cargo } from '../../../models/M-Operacional/GestionPersonal/cargo';

@Injectable({
  providedIn: 'root'
})
export class CargoService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/operational/gestion_personal/cargo';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/gestion_personal/carga_masiva/cargos'; 

  constructor(private http: HttpClient) {}

  getCargos(): Observable<Cargo[]> {
    return this.http.get<Cargo[]>(this.apiUrl);
  }

  getCargosSinEliminar(): Observable<Cargo[]> {
    return this.http.get<Cargo[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createCargo(cargo: Cargo): Observable<Cargo> {
    return this.http.post<Cargo>(this.apiUrl, cargo);
  }

  updateCargo(cargo: Cargo): Observable<Cargo> {
    return this.http.put<Cargo>(`${this.apiUrl}/${cargo.id}`, cargo);
  }

  deleteCargo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
