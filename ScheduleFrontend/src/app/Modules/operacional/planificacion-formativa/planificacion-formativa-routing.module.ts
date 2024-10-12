import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActividadProyectoComponent } from '../../../Componentes/Operacional/PlanificacionFormativa/actividad-proyecto/actividad-proyecto.component';
import { ActividadesProyectosRapsComponent } from '../../../Componentes/Operacional/PlanificacionFormativa/actividades-proyectos-raps/actividades-proyectos-raps.component';
import { FaseComponent } from '../../../Componentes/Operacional/PlanificacionFormativa/fase/fase.component';
import { ProyectoFormativoComponent } from '../../../Componentes/Operacional/PlanificacionFormativa/proyecto-formativo/proyecto-formativo.component';
import { ProyectosFormativosFichasComponent } from '../../../Componentes/Operacional/PlanificacionFormativa/proyectos-formativos-fichas/proyectos-formativos-fichas.component';

const routes: Routes = [
  { path: 'registro_actividad_proyecto', component: ActividadProyectoComponent },
  { path: 'registro_actividades_proyectos_raps', component: ActividadesProyectosRapsComponent },
  { path: 'registro_fase', component: FaseComponent },
  { path: 'registro_proyecto_formativo', component: ProyectoFormativoComponent },
  { path: 'registro_proyectos_formativos_fichas', component: ProyectosFormativosFichasComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanificacionFormativaRoutingModule { }
