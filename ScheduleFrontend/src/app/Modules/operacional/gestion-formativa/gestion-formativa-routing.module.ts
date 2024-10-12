import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompetenciaComponent } from '../../../Componentes/Operacional/GestionFormativa/competencia/competencia.component';
import { ModalidadComponent } from '../../../Componentes/Operacional/GestionFormativa/modalidad/modalidad.component';
import { NivelFormacionComponent } from '../../../Componentes/Operacional/GestionFormativa/nivel-formacion/nivel-formacion.component';
import { ProgramaFormacionComponent } from '../../../Componentes/Operacional/GestionFormativa/programa-formacion/programa-formacion.component';
import { RapComponent } from '../../../Componentes/Operacional/GestionFormativa/rap/rap.component';
import { RapsCompetenciasComponent } from '../../../Componentes/Operacional/GestionFormativa/raps-competencias/raps-competencias.component';
import { TipoFormacionComponent } from '../../../Componentes/Operacional/GestionFormativa/tipo-formacion/tipo-formacion.component';
import { CompetenciasProgramasFormacionComponent } from '../../../Componentes/Operacional/GestionFormativa/competencias-programas-formacion/competencias-programas-formacion.component';

const routes: Routes = [
  { path: 'registro_competencia', component: CompetenciaComponent },
  { path: 'registro_competencias_programa_formacion', component: CompetenciasProgramasFormacionComponent },
  { path: 'registro_modalidad', component: ModalidadComponent },
  { path: 'registro_nivel_formacion', component: NivelFormacionComponent },
  { path: 'registro_programa_formacion', component: ProgramaFormacionComponent },
  { path: 'registro_rap', component: RapComponent },
  { path: 'registro_raps_competencias', component: RapsCompetenciasComponent },
  { path: 'registro_tipo_formacion', component: TipoFormacionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionFormativaRoutingModule { }
