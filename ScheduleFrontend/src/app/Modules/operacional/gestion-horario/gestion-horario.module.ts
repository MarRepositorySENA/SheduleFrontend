import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionHorarioRoutingModule } from './gestion-horario-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableComponent } from '../../../Componentes/Pages/table/table.component';
import { ConvocatoriaComponent } from '../../../Componentes/Operacional/GestionHorario/convocatoria/convocatoria.component';
import { FichaComponent } from '../../../Componentes/Operacional/GestionHorario/ficha/ficha.component';
import { HorariosAmbientesComponent } from '../../../Componentes/Operacional/GestionHorario/horarios-ambientes/horarios-ambientes.component';
import { JornadaComponent } from '../../../Componentes/Operacional/GestionHorario/jornada/jornada.component';
import { MatriculaComponent } from '../../../Componentes/Operacional/GestionHorario/matricula/matricula.component';
import { ProgramacionFichaComponent } from '../../../Componentes/Operacional/GestionHorario/programacion-ficha/programacion-ficha.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarioAmbientesComponent } from '../../../Componentes/Operacional/GestionHorario/calendario-ambientes/calendario-ambientes.component';



@NgModule({
  declarations: [
    ConvocatoriaComponent,
    FichaComponent,
    HorariosAmbientesComponent,
    JornadaComponent,
    MatriculaComponent,
    ProgramacionFichaComponent,
    CalendarioAmbientesComponent

    


  ],
  imports: [
    CommonModule,
    GestionHorarioRoutingModule, 
    ReactiveFormsModule, NgSelectModule, TableComponent, FormsModule, FullCalendarModule,
  ]
})
export class GestionHorarioModule { }
