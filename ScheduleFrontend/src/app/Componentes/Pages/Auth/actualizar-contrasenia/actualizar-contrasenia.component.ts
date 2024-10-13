import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from "../../../../Services/S-Security/usuario.service";

@Component({
  selector: 'app-actualizar-contrasenia',
  templateUrl: './actualizar-contrasenia.component.html',
  styleUrls: ['./actualizar-contrasenia.component.css']
})
export class ActualizarContraseniaComponent implements OnInit {
  passwordForm: FormGroup;
  email: string | null = null;  // Asegura que el email sea correctamente capturado

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService
  ) {
    // Definir el formulario con validadores
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],  // Contraseña con un mínimo de 6 caracteres
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatch });
  }

  ngOnInit() {
    // Obtener el email de los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || null;  // Guardar el correo desde la URL
    });
  }

  // Validador personalizado para confirmar que las contraseñas coinciden
  passwordsMatch(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  // Enviar el formulario para actualizar la contraseña
  onSubmit() {
    if (this.passwordForm.valid && this.email) {
      const { newPassword } = this.passwordForm.value;

      // Llamar al servicio para actualizar la contraseña
      this.usuarioService.actualizarContrasenia(this.email, newPassword).subscribe(
        response => {
          // Redirigir al login después de actualizar la contraseña
          this.router.navigate(['/auth/login']);
        },
        error => {
          console.error('Error actualizando la contraseña', error);
        }
      );
    } else {
      console.error('Formulario inválido o email no encontrado');
    }
  }
}
