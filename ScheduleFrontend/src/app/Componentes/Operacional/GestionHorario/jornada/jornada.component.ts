import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Jornada } from '../../../../models/M-Operacional/GestionHorario/jornada';
import { JornadaService } from '../../../../Services/S-Operacional/GestionHorario/jornada.service';

@Component({
  selector: 'app-jornada',
  templateUrl: './jornada.component.html',
  styleUrls: ['./jornada.component.css']
})
export class JornadaComponent implements OnInit {
  jornadas: Jornada[] = [];
  jornadaForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;

  headers = [
    { title: 'Código', field: 'codigo' },
    { title: 'Nombre', field: 'nombre' },
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private jornadaService: JornadaService
  ) {}

  ngOnInit(): void {
    this.getJornadas();
    this.initializeForm();
  }

  initializeForm(): void {
    this.jornadaForm = this.fb.group({
      id: [0],
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getJornadas(): void {
    this.jornadaService.getJornadasSinEliminar().subscribe(
      data => {
        this.jornadas = data;
      },
      error => {
        console.error('Error al obtener las jornadas:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.jornadaForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const jornada: Jornada = this.jornadaForm.value;

    if (this.isEditing) {
      this.updateJornada(jornada);
    } else {
      this.createJornada(jornada);
    }
  }

  createJornada(jornada: Jornada): void {
    jornada.createdAt = new Date().toISOString();
    jornada.updatedAt = new Date().toISOString();

    this.jornadaService.createJornada(jornada).subscribe(
      response => {
        Swal.fire('Éxito', 'Jornada creada con éxito.', 'success');
        this.getJornadas();
        this.resetForm();
      },
      error => {
        console.error('Error al crear la jornada:', error);
        Swal.fire('Error', 'Error al crear la jornada.', 'error');
      }
    );
  }

  updateJornada(jornada: Jornada): void {
    const updatedJornada: Jornada = {
      ...jornada,
      updatedAt: new Date().toISOString()
    };

    this.jornadaService.updateJornada(updatedJornada).subscribe(
      response => {
        Swal.fire('Éxito', 'Jornada actualizada con éxito.', 'success');
        this.getJornadas();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar la jornada:', error);
        Swal.fire('Error', 'Error al actualizar la jornada.', 'error');
      }
    );
  }

  resetForm(): void {
    this.jornadaForm.reset({
      id: 0,
      codigo: '',
      nombre: '',
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: Jornada): void {
    this.isEditing = true;
    this.jornadaForm.patchValue({
      id: item.id,
      codigo: item.codigo,
      nombre: item.nombre,
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
        this.jornadaService.deleteJornada(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'La jornada ha sido eliminada.', 'success');
            this.getJornadas();
          },
          error => {
            console.error('Error al eliminar la jornada:', error);
            Swal.fire('Error', 'Error al eliminar la jornada.', 'error');
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

    this.jornadaService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getJornadas();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
