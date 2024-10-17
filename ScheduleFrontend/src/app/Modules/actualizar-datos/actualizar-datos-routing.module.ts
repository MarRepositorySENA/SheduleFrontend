import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActualizarDatosComponent } from '../../Componentes/Pages/Auth/actualizar-datos/actualizar-datos.component';


const routes: Routes = [
  { path: '', component: ActualizarDatosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActualizarDatosRoutingModule {}
