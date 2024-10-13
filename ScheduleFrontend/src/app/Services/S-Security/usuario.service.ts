import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../../models/M-Security/usuario';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:9000/base/api/v1/base/security/usuario';
  private encodedEmail: any;


  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getUsuariosSinEliminar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/consultarRegistrosSinEliminar`);
  }

  createUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  updateUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${usuario.id}`, usuario);
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  recuperarContrasenia(email: string): Observable<void> {
    const encodedEmail = encodeURIComponent(email); // Codifica el email
    return this.http.post<void>(`${this.apiUrl}/send-password-reset/${encodedEmail}`, null);
  }

  actualizarContrasenia(email: string | null, nuevaContrasenia: string): Observable<void> {
    const body = { email, nuevaContrasenia };
    return this.http.put<void>(`${this.apiUrl}/actualizar-contrasenia/${(this.encodedEmail)}`, body);
  }




}
