import { Component } from '@angular/core';
import { UsuarioService } from '../../../../Services/S-Security/usuario.service';

@Component({
  selector: 'recuperar-contrasenia',
  templateUrl: './recuperar-contrasenia.component.html',
  styleUrls: ['./recuperar-contrasenia.component.css']
})
export class RecuperarContraseniaComponent {
  email: string = '';
  isEmailSent = false;

  constructor(private usuarioService: UsuarioService) {}

  sendResetLink() {
    if (this.email) {
      this.usuarioService.recuperarContrasenia(this.email).subscribe(() => {
        this.isEmailSent = true;
      }, error => {
        console.error('Error al enviar el enlace de recuperación', error);
      });

    }
  }

}

