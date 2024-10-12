import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CargoComponent } from '../../../Componentes/Operacional/GestionPersonal/cargo/cargo.component';
import { EmpleadoComponent } from '../../../Componentes/Operacional/GestionPersonal/empleado/empleado.component';
import { FichasEmpleadosComponent } from '../../../Componentes/Operacional/GestionPersonal/fichas-empleados/fichas-empleados.component';
import { FuncionesComponent } from '../../../Componentes/Operacional/GestionPersonal/funciones/funciones.component';
import { TipoContratoComponent } from '../../../Componentes/Operacional/GestionPersonal/tipo-contrato/tipo-contrato.component';

const routes: Routes = [
  { path: 'registro_cargo', component: CargoComponent },
  { path: 'registro_empleado', component: EmpleadoComponent },
  { path: 'registro_fichas_empleados', component: FichasEmpleadosComponent },
  { path: 'registro_funciones', component: FuncionesComponent },
  { path: 'registro_horarios_empleados', component: CargoComponent },
  { path: 'registro_tipo_contrato', component: TipoContratoComponent },





];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionPersonalRoutingModule { }
