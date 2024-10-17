import { Component } from '@angular/core';
import { AuthService } from '../../../Services/Jwt/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private authService: AuthService, private router: Router) {}

  cerrarSesion() {
    this.authService.logout(); // Llama al método de logout del servicio
    this.router.navigate(['/auth']); // Redirige al login después de cerrar sesión
  }
}
