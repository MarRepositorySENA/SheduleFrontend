import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../../Componentes/Pages/home/home.component';
import {RecuperarContraseniaComponent} from "../../Componentes/Pages/Auth/recuperar-contrasenia/recuperar-contrasenia.component";
import {ActualizarContraseniaComponent} from "../../Componentes/Pages/Auth/actualizar-contrasenia/actualizar-contrasenia.component";


const routes: Routes = [
  { path: '', redirectTo: 'registro_home', pathMatch: 'full' },
  { path: 'registro_home', component: HomeComponent },
  {path: '',redirectTo:'recuperar-contrasenia', pathMatch:'full'},  // Mover fuera del AuthGuard

  {
    path: 'actualizar-contrasenia',  // Mover fuera del AuthGuard
    component: ActualizarContraseniaComponent // Ruta directa para actualizar contraseña
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
