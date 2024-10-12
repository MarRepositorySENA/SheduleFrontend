import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanificacionFormativaRoutingModule } from './planificacion-formativa-routing.module';
import { ActividadProyectoComponent } from '../../../Componentes/Operacional/PlanificacionFormativa/actividad-proyecto/actividad-proyecto.component';
import { ActividadesProyectosRapsComponent } from '../../../Componentes/Operacional/PlanificacionFormativa/actividades-proyectos-raps/actividades-proyectos-raps.component';
import { FaseComponent } from '../../../Componentes/Operacional/PlanificacionFormativa/fase/fase.component';
import { ProyectoFormativoComponent } from '../../../Componentes/Operacional/PlanificacionFormativa/proyecto-formativo/proyecto-formativo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableComponent } from '../../../Componentes/Pages/table/table.component';
import { ProyectosFormativosFichasComponent } from '../../../Componentes/Operacional/PlanificacionFormativa/proyectos-formativos-fichas/proyectos-formativos-fichas.component';



@NgModule({
  declarations: [
    ActividadProyectoComponent,
    ActividadesProyectosRapsComponent,
    FaseComponent,
    ProyectoFormativoComponent,
    ProyectosFormativosFichasComponent,

  ],
  imports: [
    CommonModule,
    PlanificacionFormativaRoutingModule,
    ReactiveFormsModule, NgSelectModule, TableComponent, FormsModule
  ]
})
export class PlanificacionFormativaModule { }
