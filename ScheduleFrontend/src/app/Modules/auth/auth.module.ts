import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from '../../Componentes/Pages/Auth/login/login.component';
import { RecuperarContraseniaComponent } from '../../Componentes/Pages/Auth/recuperar-contrasenia/recuperar-contrasenia.component';
import{ActualizarContraseniaComponent} from "../../Componentes/Pages/Auth/actualizar-contrasenia/actualizar-contrasenia.component";



@NgModule({
  declarations: [

    LoginComponent,
    ActualizarContraseniaComponent,
    RecuperarContraseniaComponent, // Componente para recuperar la contraseña
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,    // Módulo de enrutamiento para la autenticación
    FormsModule,          // Módulo de formularios para formularios template-driven
    ReactiveFormsModule   // Módulo para formularios reactivos
  ]
})
export class AuthModule { }
