import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { HorariosEmpleadosService } from '../../Services/S-Operacional/GestionPersonal/HorariosEmpleados.service';
import { HorariosAmbientesService } from '../../Services/S-Operacional/GestionHorario/horarios-ambientes.service';
import { HorariosEmpleados } from '../../models/M-Operacional/GestionPersonal/horarios-empleados';
import { HorariosAmbientes } from '../../models/M-Operacional/GestionHorario/horarios-ambientes';
import { EventClickArg } from '@fullcalendar/core';

@Component({
  selector: 'app-calendario-horarios',
  templateUrl: './calendario-horarios.component.html',
  styleUrls: ['./calendario-horarios.component.css']
})
export class CalendarioHorariosComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  calendarOptions: any = {
    plugins: [timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    selectable: true,
    editable: false,
    events: [],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay'
    },
    eventClick: this.handleEventClick.bind(this)
  };

  constructor(
    private horariosEmpleadosService: HorariosEmpleadosService,
    private horariosAmbientesService: HorariosAmbientesService
  ) {}

  ngOnInit() {
    this.loadHorarios();
  }

  loadHorarios() {
    // Cargar horarios de empleados
    this.horariosEmpleadosService.getHorariosEmpleados().subscribe((data: HorariosEmpleados[]) => {
      const empleadosEvents = data.map((horario: HorariosEmpleados) => ({
        title: `Empleado: ${horario.empleadoId.personaId.primerNombre} ${horario.empleadoId.personaId.primerApellido}`,
        start: horario.horaInicio,
        end: horario.horaFin,
        color: '#4CAF50'
      }));
      this.calendarOptions.events = [...this.calendarOptions.events, ...empleadosEvents];
    });

    // Cargar horarios de ambientes
    this.horariosAmbientesService.getHorariosAmbientes().subscribe((data: HorariosAmbientes[]) => {
      const ambientesEvents = data.map((horario: HorariosAmbientes) => ({
        title: `Ambiente: ${horario.ambienteId.nombre}`,
        start: horario.horaInicio,
        end: horario.horaFin,
        color: '#FF9800'
      }));
      this.calendarOptions.events = [...this.calendarOptions.events, ...ambientesEvents];
    });
  }

  handleEventClick(arg: EventClickArg) {
    alert('Evento seleccionado: ' + arg.event.title);
  }
}
