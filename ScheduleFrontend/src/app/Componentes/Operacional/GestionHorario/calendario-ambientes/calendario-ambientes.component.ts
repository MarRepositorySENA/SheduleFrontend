import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { HorariosAmbientesService } from '../../../../Services/S-Operacional/GestionHorario/horarios-ambientes.service';
import { HorariosAmbientes } from '../../../../models/M-Operacional/GestionHorario/horarios-ambientes';

@Component({
  selector: 'app-calendario-ambientes',
  templateUrl: './calendario-ambientes.component.html',
  styleUrls: ['./calendario-ambientes.component.css']
})
export class CalendarioAmbientesComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  calendarOptions: any;
  events: any[] = [];

  constructor(private horariosAmbientesService: HorariosAmbientesService) {}

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
    this.horariosAmbientesService.getHorariosAmbientesSinEliminar().subscribe((data: HorariosAmbientes[]) => {
      this.events = data.map(horario => ({
        title: `Ambiente: ${horario.ambienteId.nombre}`,
        start: horario.horaInicio,
        end: horario.horaFin
      }));

      // Actualizamos los eventos del calendario
      this.calendarOptions.events = this.events;
    });
  }
}
