import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ProgramacionFicha } from '../../../../models/M-Operacional/GestionHorario/programacion-ficha';
import { ProgramacionFichaService } from '../../../../Services/S-Operacional/GestionHorario/ProgramacionFicha.service';

@Component({
  selector: 'app-programacion-ficha',
  templateUrl: './programacion-ficha.component.html',
  styleUrls: ['./programacion-ficha.component.css']
})
export class ProgramacionFichaComponent implements OnInit {
  programacionesFicha: ProgramacionFicha[] = [];
  programacionFichaForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;

  headers = [
    { title: 'Código', field: 'codigo' },
    { title: 'Fecha Inicio', field: 'fechaInicio' },
    { title: 'Fecha Fin', field: 'fechaFin' },
    { title: 'Trimestre', field: 'trimestre' },
    { title: 'Cantidad Hora', field: 'cantidadHora' },
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private programacionFichaService: ProgramacionFichaService
  ) {}

  ngOnInit(): void {
    this.getProgramacionesFicha();
    this.initializeForm();
  }

  initializeForm(): void {
    this.programacionFichaForm = this.fb.group({
      id: [0],
      codigo: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      trimestre: ['', Validators.required],
      cantidadHora: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getProgramacionesFicha(): void {
    this.programacionFichaService.getProgramacionesFichaSinEliminar().subscribe(
      data => {
        this.programacionesFicha = data;
      },
      error => {
        console.error('Error al obtener las programaciones de ficha:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.programacionFichaForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const programacionFicha: ProgramacionFicha = this.programacionFichaForm.value;

    if (this.isEditing) {
      this.updateProgramacionFicha(programacionFicha);
    } else {
      this.createProgramacionFicha(programacionFicha);
    }
  }

  createProgramacionFicha(programacionFicha: ProgramacionFicha): void {
    programacionFicha.createdAt = new Date().toISOString();
    programacionFicha.updatedAt = new Date().toISOString();

    this.programacionFichaService.createProgramacionFicha(programacionFicha).subscribe(
      response => {
        Swal.fire('Éxito', 'Programación de ficha creada con éxito.', 'success');
        this.getProgramacionesFicha();
        this.resetForm();
      },
      error => {
        console.error('Error al crear la programación de ficha:', error);
        Swal.fire('Error', 'Error al crear la programación de ficha.', 'error');
      }
    );
  }

  updateProgramacionFicha(programacionFicha: ProgramacionFicha): void {
    const updatedProgramacionFicha: ProgramacionFicha = {
      ...programacionFicha,
      updatedAt: new Date().toISOString()
    };

    this.programacionFichaService.updateProgramacionFicha(updatedProgramacionFicha).subscribe(
      response => {
        Swal.fire('Éxito', 'Programación de ficha actualizada con éxito.', 'success');
        this.getProgramacionesFicha();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar la programación de ficha:', error);
        Swal.fire('Error', 'Error al actualizar la programación de ficha.', 'error');
      }
    );
  }

  resetForm(): void {
    this.programacionFichaForm.reset({
      id: 0,
      codigo: '',
      fechaInicio: '',
      fechaFin: '',
      trimestre: '',
      cantidadHora: '',
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: ProgramacionFicha): void {
    this.isEditing = true;
    this.programacionFichaForm.patchValue({
      id: item.id,
      codigo: item.codigo,
      fechaInicio: item.fechaInicio,
      fechaFin: item.fechaFin,
      trimestre: item.trimestre,
      cantidadHora: item.cantidadHora,
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
        this.programacionFichaService.deleteProgramacionFicha(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'La programación de ficha ha sido eliminada.', 'success');
            this.getProgramacionesFicha();
          },
          error => {
            console.error('Error al eliminar la programación de ficha:', error);
            Swal.fire('Error', 'Error al eliminar la programación de ficha.', 'error');
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

    this.programacionFichaService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getProgramacionesFicha();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
