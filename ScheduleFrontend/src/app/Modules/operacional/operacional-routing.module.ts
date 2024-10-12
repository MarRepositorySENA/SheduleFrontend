import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'gestion_formativa',
    loadChildren: () => import('./gestion-formativa/gestion-formativa.module').then(m => m.GestionFormativaModule)
  },
  {
    path: 'gestion_horario',
    loadChildren: () => import('./gestion-horario/gestion-horario.module').then(m => m.GestionHorarioModule)
  },
  {
    path: 'gestion_personal',
    loadChildren: () => import('./gestion-personal/gestion-personal.module').then(m => m.GestionPersonalModule)
  },
  {
    path: 'planificacion_formativa',
    loadChildren: () => import('./planificacion-formativa/planificacion-formativa.module').then(m => m.PlanificacionFormativaModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperacionalRoutingModule { }
