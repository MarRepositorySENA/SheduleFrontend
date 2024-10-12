import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { TipoFormacion } from '../../../../models/M-Operacional/GestionFormativa/tipo-formacion';
import { TipoFormacionService } from '../../../../Services/S-Operacional/GestionFormativa/TipoFormacion.service';

@Component({
  selector: 'app-tipo-formacion',
  templateUrl: './tipo-formacion.component.html',
  styleUrls: ['./tipo-formacion.component.css']
})
export class TipoFormacionComponent implements OnInit {
  tiposFormacion: TipoFormacion[] = [];
  tipoFormacionForm!: FormGroup;
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
    private tipoFormacionService: TipoFormacionService
  ) {}

  ngOnInit(): void {
    this.getTiposFormacion();
    this.initializeForm();
  }

  initializeForm(): void {
    this.tipoFormacionForm = this.fb.group({
      id: [0],
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getTiposFormacion(): void {
    this.tipoFormacionService.getTiposFormacionSinEliminar().subscribe(
      data => {
        this.tiposFormacion = data;
      },
      error => {
        console.error('Error al obtener los tipos de formación:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.tipoFormacionForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const tipoFormacion: TipoFormacion = this.tipoFormacionForm.value;

    if (this.isEditing) {
      this.updateTipoFormacion(tipoFormacion);
    } else {
      this.createTipoFormacion(tipoFormacion);
    }
  }

  createTipoFormacion(tipoFormacion: TipoFormacion): void {
    tipoFormacion.createdAt = new Date().toISOString();
    tipoFormacion.updatedAt = new Date().toISOString();

    this.tipoFormacionService.createTipoFormacion(tipoFormacion).subscribe(
      response => {
        Swal.fire('Éxito', 'Tipo de formación creado con éxito.', 'success');
        this.getTiposFormacion();
        this.resetForm();
      },
      error => {
        console.error('Error al crear el tipo de formación:', error);
        Swal.fire('Error', 'Error al crear el tipo de formación.', 'error');
      }
    );
  }

  updateTipoFormacion(tipoFormacion: TipoFormacion): void {
    const updatedTipoFormacion: TipoFormacion = {
      ...tipoFormacion,
      updatedAt: new Date().toISOString()
    };

    this.tipoFormacionService.updateTipoFormacion(updatedTipoFormacion).subscribe(
      response => {
        Swal.fire('Éxito', 'Tipo de formación actualizado con éxito.', 'success');
        this.getTiposFormacion();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar el tipo de formación:', error);
        Swal.fire('Error', 'Error al actualizar el tipo de formación.', 'error');
      }
    );
  }

  resetForm(): void {
    this.tipoFormacionForm.reset({
      id: 0,
      codigo: '',
      nombre: '',
      descripcion: '',
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: TipoFormacion): void {
    this.isEditing = true;
    this.tipoFormacionForm.patchValue({
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
        this.tipoFormacionService.deleteTipoFormacion(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'El tipo de formación ha sido eliminado.', 'success');
            this.getTiposFormacion();
          },
          error => {
            console.error('Error al eliminar el tipo de formación:', error);
            Swal.fire('Error', 'Error al eliminar el tipo de formación.', 'error');
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

    this.tipoFormacionService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getTiposFormacion();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
