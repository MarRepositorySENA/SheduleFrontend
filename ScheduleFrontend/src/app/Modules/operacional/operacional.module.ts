import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperacionalRoutingModule } from './operacional-routing.module';
import { CalendarioHorariosComponent } from '../../Componentes/calendario-horarios/calendario-horarios.component';
import { FullCalendarModule } from '@fullcalendar/angular';



@NgModule({
  declarations: [
    CalendarioHorariosComponent
  ],
  imports: [
    CommonModule,
    OperacionalRoutingModule,
    FullCalendarModule,
   
  ]
})
export class OperacionalModule { }
