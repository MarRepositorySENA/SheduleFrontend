import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../../Componentes/Pages/Auth/login/login.component';
import { RecuperarContraseniaComponent } from '../../Componentes/Pages/Auth/recuperar-contrasenia/recuperar-contrasenia.component';
import { ActualizarContraseniaComponent } from '../../Componentes/Pages/Auth/actualizar-contrasenia/actualizar-contrasenia.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'recuperar-contrasenia', component: RecuperarContraseniaComponent },
  { path: 'actualizar-contrasenia', component: ActualizarContraseniaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
