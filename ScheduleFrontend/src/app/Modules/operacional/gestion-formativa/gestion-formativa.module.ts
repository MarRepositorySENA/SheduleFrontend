import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionFormativaRoutingModule } from './gestion-formativa-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableComponent } from '../../../Componentes/Pages/table/table.component';
import { CompetenciaComponent } from '../../../Componentes/Operacional/GestionFormativa/competencia/competencia.component';
import { ModalidadComponent } from '../../../Componentes/Operacional/GestionFormativa/modalidad/modalidad.component';
import { NivelFormacionComponent } from '../../../Componentes/Operacional/GestionFormativa/nivel-formacion/nivel-formacion.component';
import { ProgramaFormacionComponent } from '../../../Componentes/Operacional/GestionFormativa/programa-formacion/programa-formacion.component';
import { RapComponent } from '../../../Componentes/Operacional/GestionFormativa/rap/rap.component';
import { RapsCompetenciasComponent } from '../../../Componentes/Operacional/GestionFormativa/raps-competencias/raps-competencias.component';
import { TipoFormacionComponent } from '../../../Componentes/Operacional/GestionFormativa/tipo-formacion/tipo-formacion.component';
import { CompetenciasProgramasFormacionComponent } from '../../../Componentes/Operacional/GestionFormativa/competencias-programas-formacion/competencias-programas-formacion.component';

@NgModule({
  declarations: [
    CompetenciaComponent, 
    CompetenciasProgramasFormacionComponent,
    ModalidadComponent,
    NivelFormacionComponent,
    ProgramaFormacionComponent,
    RapComponent,
    RapsCompetenciasComponent,
    TipoFormacionComponent
  ],
  imports: [
    CommonModule,
    GestionFormativaRoutingModule,
    ReactiveFormsModule, NgSelectModule, TableComponent, FormsModule
  ]
})
export class GestionFormativaModule { }
