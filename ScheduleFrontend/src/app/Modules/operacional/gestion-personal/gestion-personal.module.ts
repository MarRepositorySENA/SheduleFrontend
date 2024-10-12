import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionPersonalRoutingModule } from './gestion-personal-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableComponent } from '../../../Componentes/Pages/table/table.component';
import { CargoComponent } from '../../../Componentes/Operacional/GestionPersonal/cargo/cargo.component';
import { EmpleadoComponent } from '../../../Componentes/Operacional/GestionPersonal/empleado/empleado.component';
import { FichasEmpleadosComponent } from '../../../Componentes/Operacional/GestionPersonal/fichas-empleados/fichas-empleados.component';
import { FuncionesComponent } from '../../../Componentes/Operacional/GestionPersonal/funciones/funciones.component';
import { HorariosEmpleadosComponent } from '../../../Componentes/Operacional/GestionPersonal/horarios-empleados/horarios-empleados.component';
import { TipoContratoComponent } from '../../../Componentes/Operacional/GestionPersonal/tipo-contrato/tipo-contrato.component';



@NgModule({
  declarations: [
    CargoComponent,
    EmpleadoComponent,
    FichasEmpleadosComponent,
    FuncionesComponent,
    HorariosEmpleadosComponent,
    TipoContratoComponent


  ],
  imports: [
    CommonModule,
    GestionPersonalRoutingModule,
    ReactiveFormsModule, NgSelectModule, TableComponent, FormsModule
  ]
})
export class GestionPersonalModule { }
