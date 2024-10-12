import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Persona } from '../../models/M-Security/persona';
import { Usuario } from '../../models/M-Security/usuario';
import { switchMap } from 'rxjs/operators'; // Importar switchMap

@Injectable({
  providedIn: 'root'
})
export class PersonaUsuarioService {
  private apiPersonaUrl = 'http://localhost:9000/base/api/v1/base/security/persona';
  private apiUsuarioUrl = 'http://localhost:9000/base/api/v1/base/security/usuario/GuardarUsuarioJwt';
  private apiCargaMasivaUrl = 'http://localhost:9000/base/api/seguridad/carga_masiva/personas_usuarios';

  constructor(private http: HttpClient) {}

  // Obtener todas las personas
  getPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(this.apiPersonaUrl);
  }

  // Crear una nueva persona y su usuario
  createPersonaUsuario(persona: Persona, usuario: Usuario): Observable<any> {
    // Primero creamos la persona
    return this.http.post<Persona>(this.apiPersonaUrl, persona).pipe(
      // Luego creamos el usuario relacionado
      switchMap((personaResponse: Persona) => {
        usuario.personaId = { id: personaResponse.id };
        return this.http.post<Usuario>(this.apiUsuarioUrl, usuario);
      })
    );
  }

  // Actualizar Persona y Usuario
  updatePersonaUsuario(persona: Persona, usuario: Usuario): Observable<any> {
    // Primero actualizamos la persona
    return this.http.put(`${this.apiPersonaUrl}/${persona.id}`, persona).pipe(
      // Luego actualizamos el usuario relacionado
      switchMap(() => {
        return this.http.put(`${this.apiUsuarioUrl}/${usuario.id}`, usuario);
      })
    );
  }

  // Eliminar una persona y su usuario
  deletePersonaUsuario(id: number): Observable<void> {
    // Eliminar solo la persona, asumiendo que el backend maneja la relación
    return this.http.delete<void>(`${this.apiPersonaUrl}/${id}`);
  }

  // Carga masiva de personas y usuarios mediante archivo Excel
  cargarMasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiCargaMasivaUrl, formData);
  }
}
