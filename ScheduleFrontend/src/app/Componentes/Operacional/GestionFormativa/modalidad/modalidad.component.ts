import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Modalidad } from '../../../../models/M-Operacional/GestionFormativa/modalidad';
import { ModalidadService } from '../../../../Services/S-Operacional/GestionFormativa/modalidad.service';

@Component({
  selector: 'app-modalidad',
  templateUrl: './modalidad.component.html',
  styleUrls: ['./modalidad.component.css']
})
export class ModalidadComponent implements OnInit {
  modalidades: Modalidad[] = [];
  modalidadForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;
  headers = [
    { title: 'Código', field: 'codigo' },
    { title: 'Nombre', field: 'nombre' },
    { title: 'Descripción', field: 'descripcion' },
    { title: 'Requiere Presencialidad', field: 'requierePresencialidad' },
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private modalidadService: ModalidadService
  ) {}

  ngOnInit(): void {
    this.getModalidades();
    this.initializeForm();
  }

  initializeForm(): void {
    this.modalidadForm = this.fb.group({
      id: [0],
      codigo: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      requierePresencialidad: [false, Validators.required],
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getModalidades(): void {
    this.modalidadService.getModalidadesSinEliminar().subscribe(
      data => {
        this.modalidades = data;
      },
      error => {
        console.error('Error al obtener las modalidades:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.modalidadForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const modalidad: Modalidad = this.modalidadForm.value;

    if (this.isEditing) {
      this.updateModalidad(modalidad);
    } else {
      this.createModalidad(modalidad);
    }
  }

  createModalidad(modalidad: Modalidad): void {
    modalidad.createdAt = new Date().toISOString();
    modalidad.updatedAt = new Date().toISOString();

    this.modalidadService.createModalidad(modalidad).subscribe(
      response => {
        Swal.fire('Éxito', 'Modalidad creada con éxito.', 'success');
        this.getModalidades();
        this.resetForm();
      },
      error => {
        console.error('Error al crear la modalidad:', error);
        Swal.fire('Error', 'Error al crear la modalidad.', 'error');
      }
    );
  }

  updateModalidad(modalidad: Modalidad): void {
    const updatedModalidad: Modalidad = {
      ...modalidad,
      updatedAt: new Date().toISOString()
    };

    this.modalidadService.updateModalidad(updatedModalidad).subscribe(
      response => {
        Swal.fire('Éxito', 'Modalidad actualizada con éxito.', 'success');
        this.getModalidades();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar la modalidad:', error);
        Swal.fire('Error', 'Error al actualizar la modalidad.', 'error');
      }
    );
  }

  resetForm(): void {
    this.modalidadForm.reset({
      id: 0,
      codigo: '',
      nombre: '',
      descripcion: '',
      requierePresencialidad: false,
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: Modalidad): void {
    this.isEditing = true;
    this.modalidadForm.patchValue({
      id: item.id,
      codigo: item.codigo,
      nombre: item.nombre,
      descripcion: item.descripcion,
      requierePresencialidad: item.requierePresencialidad,
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
      confirmButtonText: 'Sí, eliminarla'
    }).then((result) => {
      if (result.isConfirmed) {
        this.modalidadService.deleteModalidad(id).subscribe(
          response => {
            Swal.fire('Eliminada!', 'La modalidad ha sido eliminada.', 'success');
            this.getModalidades();
          },
          error => {
            console.error('Error al eliminar la modalidad:', error);
            Swal.fire('Error', 'Error al eliminar la modalidad.', 'error');
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

    this.modalidadService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getModalidades();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
