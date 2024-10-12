import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AmbienteService } from '../../../../Services/Parameter/Infraestructura/ambiente.service';
import Swal from 'sweetalert2';
import { HorariosAmbientes } from '../../../../models/M-Operacional/GestionHorario/horarios-ambientes';
import { Ambiente } from '../../../../models/M-Parameter/infraestructura/ambiente';
import { ProgramacionFicha } from '../../../../models/M-Operacional/GestionHorario/programacion-ficha';
import { ProgramacionFichaService } from '../../../../Services/S-Operacional/GestionHorario/ProgramacionFicha.service';
import { HorariosAmbientesService } from '../../../../Services/S-Operacional/GestionHorario/horarios-ambientes.service';

@Component({
  selector: 'app-horarios-ambientes',
  templateUrl: './horarios-ambientes.component.html',
  styleUrls: ['./horarios-ambientes.component.css']
})
export class HorariosAmbientesComponent implements OnInit {
  horariosAmbientes: HorariosAmbientes[] = [];
  ambientes: Ambiente[] = [];
  programacionesFicha: ProgramacionFicha[] = [];
  horariosAmbientesForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;

  headers = [
    { title: 'Hora Inicio', field: 'horaInicio' },
    { title: 'Hora Fin', field: 'horaFin' },
    { title: 'Ambiente', field: 'ambienteId.nombre' },
    { title: 'Programación Ficha', field: 'programacionFichaId.codigo' },
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private horariosAmbientesService: HorariosAmbientesService,
    private ambienteService: AmbienteService,
    private programacionFichaService: ProgramacionFichaService
  ) {}

  ngOnInit(): void {
    this.getHorariosAmbientes();
    this.getAmbientes();
    this.getProgramacionesFicha();
    this.initializeForm();
  }

  initializeForm(): void {
    this.horariosAmbientesForm = this.fb.group({
      id: [0],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      ambienteId: this.fb.group({
        id: [null, Validators.required]
      }),
      programacionFichaId: this.fb.group({
        id: [null, Validators.required]
      }),
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getHorariosAmbientes(): void {
    this.horariosAmbientesService.getHorariosAmbientesSinEliminar().subscribe(
      data => {
        this.horariosAmbientes = data;
      },
      error => {
        console.error('Error al obtener los horarios de ambientes:', error);
      }
    );
  }

  getAmbientes(): void {
    this.ambienteService.getAmbientes().subscribe(
      data => {
        this.ambientes = data;
      },
      error => {
        console.error('Error al obtener los ambientes:', error);
      }
    );
  }

  getProgramacionesFicha(): void {
    this.programacionFichaService.getProgramacionesFicha().subscribe(
      data => {
        this.programacionesFicha = data;
      },
      error => {
        console.error('Error al obtener las programaciones de ficha:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.horariosAmbientesForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const horariosAmbientes: HorariosAmbientes = this.horariosAmbientesForm.value;

    if (this.isEditing) {
      this.updateHorariosAmbientes(horariosAmbientes);
    } else {
      this.createHorariosAmbientes(horariosAmbientes);
    }
  }

  createHorariosAmbientes(horariosAmbientes: HorariosAmbientes): void {
    horariosAmbientes.createdAt = new Date().toISOString();
    horariosAmbientes.updatedAt = new Date().toISOString();

    this.horariosAmbientesService.createHorariosAmbientes(horariosAmbientes).subscribe(
      response => {
        Swal.fire('Éxito', 'Horario de ambiente creado con éxito.', 'success');
        this.getHorariosAmbientes();
        this.resetForm();
      },
      error => {
        console.error('Error al crear el horario de ambiente:', error);
        Swal.fire('Error', 'Error al crear el horario de ambiente.', 'error');
      }
    );
  }

  updateHorariosAmbientes(horariosAmbientes: HorariosAmbientes): void {
    const updatedHorariosAmbientes: HorariosAmbientes = {
      ...horariosAmbientes,
      updatedAt: new Date().toISOString()
    };

    this.horariosAmbientesService.updateHorariosAmbientes(updatedHorariosAmbientes).subscribe(
      response => {
        Swal.fire('Éxito', 'Horario de ambiente actualizado con éxito.', 'success');
        this.getHorariosAmbientes();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar el horario de ambiente:', error);
        Swal.fire('Error', 'Error al actualizar el horario de ambiente.', 'error');
      }
    );
  }

  resetForm(): void {
    this.horariosAmbientesForm.reset({
      id: 0,
      horaInicio: '',
      horaFin: '',
      ambienteId: { id: null },
      programacionFichaId: { id: null },
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: HorariosAmbientes): void {
    this.isEditing = true;
    this.horariosAmbientesForm.patchValue({
      id: item.id,
      horaInicio: item.horaInicio,
      horaFin: item.horaFin,
      ambienteId: item.ambienteId,
      programacionFichaId: item.programacionFichaId,
      state: item.state,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  onDelete(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.horariosAmbientesService.deleteHorariosAmbientes(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'El horario de ambiente ha sido eliminado.', 'success');
            this.getHorariosAmbientes();
          },
          error => {
            console.error('Error al eliminar el horario de ambiente:', error);
            Swal.fire('Error', 'Error al eliminar el horario de ambiente.', 'error');
          }
        );
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadExcel(): void {
    if (!this.selectedFile) {
      Swal.fire('Error', 'Por favor seleccione un archivo Excel.', 'error');
      return;
    }

    this.horariosAmbientesService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getHorariosAmbientes();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
