import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NivelFormacion } from '../../../../models/M-Operacional/GestionFormativa/nivel-formacion';
import { NivelFormacionService } from '../../../../Services/S-Operacional/GestionFormativa/NivelFormacion.service';

@Component({
  selector: 'app-nivel-formacion',
  templateUrl: './nivel-formacion.component.html',
  styleUrls: ['./nivel-formacion.component.css']
})
export class NivelFormacionComponent implements OnInit {
  nivelesFormacion: NivelFormacion[] = [];
  nivelFormacionForm!: FormGroup;
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
    private nivelFormacionService: NivelFormacionService
  ) {}

  ngOnInit(): void {
    this.getNivelesFormacion();
    this.initializeForm();
  }

  initializeForm(): void {
    this.nivelFormacionForm = this.fb.group({
      id: [0],
      codigo: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getNivelesFormacion(): void {
    this.nivelFormacionService.getNivelesFormacionSinEliminar().subscribe(
      data => {
        this.nivelesFormacion = data;
      },
      error => {
        console.error('Error al obtener los niveles de formación:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.nivelFormacionForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const nivelFormacion: NivelFormacion = this.nivelFormacionForm.value;

    if (this.isEditing) {
      this.updateNivelFormacion(nivelFormacion);
    } else {
      this.createNivelFormacion(nivelFormacion);
    }
  }

  createNivelFormacion(nivelFormacion: NivelFormacion): void {
    nivelFormacion.createdAt = new Date().toISOString();
    nivelFormacion.updatedAt = new Date().toISOString();

    this.nivelFormacionService.createNivelFormacion(nivelFormacion).subscribe(
      response => {
        Swal.fire('Éxito', 'Nivel de formación creado con éxito.', 'success');
        this.getNivelesFormacion();
        this.resetForm();
      },
      error => {
        console.error('Error al crear el nivel de formación:', error);
        Swal.fire('Error', 'Error al crear el nivel de formación.', 'error');
      }
    );
  }

  updateNivelFormacion(nivelFormacion: NivelFormacion): void {
    const updatedNivelFormacion: NivelFormacion = {
      ...nivelFormacion,
      updatedAt: new Date().toISOString()
    };

    this.nivelFormacionService.updateNivelFormacion(updatedNivelFormacion).subscribe(
      response => {
        Swal.fire('Éxito', 'Nivel de formación actualizado con éxito.', 'success');
        this.getNivelesFormacion();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar el nivel de formación:', error);
        Swal.fire('Error', 'Error al actualizar el nivel de formación.', 'error');
      }
    );
  }

  resetForm(): void {
    this.nivelFormacionForm.reset({
      id: 0,
      codigo: '',
      nombre: '',
      descripcion: '',
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: NivelFormacion): void {
    this.isEditing = true;
    this.nivelFormacionForm.patchValue({
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
        this.nivelFormacionService.deleteNivelFormacion(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'El nivel de formación ha sido eliminado.', 'success');
            this.getNivelesFormacion();
          },
          error => {
            console.error('Error al eliminar el nivel de formación:', error);
            Swal.fire('Error', 'Error al eliminar el nivel de formación.', 'error');
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

    this.nivelFormacionService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getNivelesFormacion();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
