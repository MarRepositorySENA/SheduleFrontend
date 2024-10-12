import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EspecialidadService } from '../../../../Services/Parameter/Infraestructura/especialidad.service';
import Swal from 'sweetalert2';
import { Especialidad } from '../../../../models/M-Parameter/infraestructura/especialidad';


@Component({
  selector: 'app-especialidad',
  templateUrl: './especialidad.component.html',
  styleUrls: ['./especialidad.component.css']
})
export class EspecialidadComponent implements OnInit {
  especialidades: Especialidad[] = [];
  especialidadForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;
  headers = [
    { title: 'Código', field: 'codigo' },
    { title: 'Nombre', field: 'nombre' },
    { title: 'Descripción', field: 'descripcion' },
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private especialidadService: EspecialidadService
  ) {}

  ngOnInit(): void {
    this.getEspecialidades();
    this.initializeForm();
  }

  initializeForm(): void {
    this.especialidadForm = this.fb.group({
      id: [0],
      codigo: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(5)]],
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getEspecialidades(): void {
    this.especialidadService.getEspecialidadesSinEliminar().subscribe(
      data => {
        this.especialidades = data;
      },
      error => {
        console.error('Error al obtener las especialidades:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.especialidadForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const especialidad: Especialidad = this.especialidadForm.value;

    if (this.isEditing) {
      this.updateEspecialidad(especialidad);
    } else {
      this.createEspecialidad(especialidad);
    }
  }

  createEspecialidad(especialidad: Especialidad): void {
    especialidad.createdAt = new Date().toISOString();
    especialidad.updatedAt = new Date().toISOString();

    this.especialidadService.createEspecialidad(especialidad).subscribe(
      response => {
        Swal.fire('Éxito', 'Especialidad creada con éxito.', 'success');
        this.getEspecialidades();
        this.resetForm();
      },
      error => {
        console.error('Error al crear la especialidad:', error);
        Swal.fire('Error', 'Error al crear la especialidad.', 'error');
      }
    );
  }

  updateEspecialidad(especialidad: Especialidad): void {
    const updatedEspecialidad: Especialidad = {
      ...especialidad,
      updatedAt: new Date().toISOString()
    };

    this.especialidadService.updateEspecialidad(updatedEspecialidad).subscribe(
      response => {
        Swal.fire('Éxito', 'Especialidad actualizada con éxito.', 'success');
        this.getEspecialidades();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar la especialidad:', error);
        Swal.fire('Error', 'Error al actualizar la especialidad.', 'error');
      }
    );
  }

  resetForm(): void {
    this.especialidadForm.reset({
      id: 0,
      codigo: '',
      nombre: '',
      descripcion: '',
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: Especialidad): void {
    this.isEditing = true;
    this.especialidadForm.patchValue({
      id: item.id,
      codigo: item.codigo,
      nombre: item.nombre,
      descripcion: item.descripcion,
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
        this.especialidadService.deleteEspecialidad(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'La especialidad ha sido eliminada.', 'success');
            this.getEspecialidades();
          },
          error => {
            console.error('Error al eliminar la especialidad:', error);
            Swal.fire('Error', 'Error al eliminar la especialidad.', 'error');
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

    this.especialidadService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getEspecialidades();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
