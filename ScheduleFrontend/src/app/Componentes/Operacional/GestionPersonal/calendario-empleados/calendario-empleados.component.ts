import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { HorariosEmpleadosService } from '../../../../Services/S-Operacional/GestionPersonal/HorariosEmpleados.service';
import { HorariosEmpleados } from '../../../../models/M-Operacional/GestionPersonal/horarios-empleados';

@Component({
  selector: 'app-calendario-empleados',
  templateUrl: './calendario-empleados.component.html',
  styleUrls: ['./calendario-empleados.component.css']
})
export class CalendarioEmpleadosComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  calendarOptions: any;
  events: any[] = [];

  constructor(private horariosEmpleadosService: HorariosEmpleadosService) {}

  ngOnInit() {
    this.loadHorarios();
    this.initializeCalendar();
  }

  initializeCalendar() {
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'timeGridWeek',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      events: this.events
    };
  }

  loadHorarios() {
    this.horariosEmpleadosService.getHorariosEmpleadosSinEliminar().subscribe((data: HorariosEmpleados[]) => {
      this.events = data.map(horario => ({
        title: `${horario.empleadoId.personaId.primerNombre} ${horario.empleadoId.personaId.primerApellido}`,
        start: horario.horaInicio,
        end: horario.horaFin
      }));
    });
  }
}
