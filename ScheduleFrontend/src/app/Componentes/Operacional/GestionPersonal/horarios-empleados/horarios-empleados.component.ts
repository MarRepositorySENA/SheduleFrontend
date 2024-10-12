import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HorariosEmpleados } from '../../../../models/M-Operacional/GestionPersonal/horarios-empleados';
import { Empleado } from '../../../../models/M-Operacional/GestionPersonal/empleado';
import { ProgramacionFicha } from '../../../../models/M-Operacional/GestionHorario/programacion-ficha';
import { HorariosEmpleadosService } from '../../../../Services/S-Operacional/GestionPersonal/HorariosEmpleados.service';
import { EmpleadoService } from '../../../../Services/S-Operacional/GestionPersonal/empleado.service';
import { ProgramacionFichaService } from '../../../../Services/S-Operacional/GestionHorario/ProgramacionFicha.service';

@Component({
  selector: 'app-horarios-empleados',
  templateUrl: './horarios-empleados.component.html',
  styleUrls: ['./horarios-empleados.component.css']
})
export class HorariosEmpleadosComponent implements OnInit {
  horariosEmpleados: HorariosEmpleados[] = [];
  empleados: Empleado[] = [];
  programacionesFicha: ProgramacionFicha[] = [];
  horariosEmpleadosForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;

  headers = [
    { title: 'Empleado', field: 'empleadoId.identificador' },
    { title: 'Hora Inicio', field: 'horaInicio' },
    { title: 'Hora Fin', field: 'horaFin' },
    { title: 'Programación Ficha', field: 'programacionFichaId.codigo' },
    { title: 'Cargo', field: 'empleadoId.cargoId.nombre' },
    { title: 'Tipo Contrato', field: 'empleadoId.tipoContratoId.nombre' },
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private horariosEmpleadosService: HorariosEmpleadosService,
    private empleadoService: EmpleadoService,
    private programacionFichaService: ProgramacionFichaService
  ) {}

  ngOnInit(): void {
    this.getHorariosEmpleados();
    this.getEmpleados();
    this.getProgramacionesFicha();
    this.initializeForm();
  }

  initializeForm(): void {
    this.horariosEmpleadosForm = this.fb.group({
      id: [0],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      empleadoId: this.fb.group({
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

  getHorariosEmpleados(): void {
    this.horariosEmpleadosService.getHorariosEmpleadosSinEliminar().subscribe(
      data => {
        this.horariosEmpleados = data;
      },
      error => {
        console.error('Error al obtener los horarios de empleados:', error);
      }
    );
  }

  getEmpleados(): void {
    this.empleadoService.getEmpleados().subscribe(
      data => {
        this.empleados = data;
      },
      error => {
        console.error('Error al obtener los empleados:', error);
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
    if (this.horariosEmpleadosForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const horariosEmpleados: HorariosEmpleados = this.horariosEmpleadosForm.value;

    if (this.isEditing) {
      this.updateHorariosEmpleados(horariosEmpleados);
    } else {
      this.createHorariosEmpleados(horariosEmpleados);
    }
  }

  createHorariosEmpleados(horariosEmpleados: HorariosEmpleados): void {
    horariosEmpleados.createdAt = new Date().toISOString();
    horariosEmpleados.updatedAt = new Date().toISOString();

    this.horariosEmpleadosService.createHorariosEmpleados(horariosEmpleados).subscribe(
      response => {
        Swal.fire('Éxito', 'Horario de empleado creado con éxito.', 'success');
        this.getHorariosEmpleados();
        this.resetForm();
      },
      error => {
        console.error('Error al crear el horario de empleado:', error);
        Swal.fire('Error', 'Error al crear el horario de empleado.', 'error');
      }
    );
  }

  updateHorariosEmpleados(horariosEmpleados: HorariosEmpleados): void {
    const updatedHorariosEmpleados: HorariosEmpleados = {
      ...horariosEmpleados,
      updatedAt: new Date().toISOString()
    };

    this.horariosEmpleadosService.updateHorariosEmpleados(updatedHorariosEmpleados).subscribe(
      response => {
        Swal.fire('Éxito', 'Horario de empleado actualizado con éxito.', 'success');
        this.getHorariosEmpleados();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar el horario de empleado:', error);
        Swal.fire('Error', 'Error al actualizar el horario de empleado.', 'error');
      }
    );
  }

  resetForm(): void {
    this.horariosEmpleadosForm.reset({
      id: 0,
      horaInicio: '',
      horaFin: '',
      empleadoId: { id: null },
      programacionFichaId: { id: null },
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: HorariosEmpleados): void {
    this.isEditing = true;
    this.horariosEmpleadosForm.patchValue({
      id: item.id,
      horaInicio: item.horaInicio,
      horaFin: item.horaFin,
      empleadoId: item.empleadoId,
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
        this.horariosEmpleadosService.deleteHorariosEmpleados(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'El horario de empleado ha sido eliminado.', 'success');
            this.getHorariosEmpleados();
          },
          error => {
            console.error('Error al eliminar el horario de empleado:', error);
            Swal.fire('Error', 'Error al eliminar el horario de empleado.', 'error');
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

    this.horariosEmpleadosService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getHorariosEmpleados();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
