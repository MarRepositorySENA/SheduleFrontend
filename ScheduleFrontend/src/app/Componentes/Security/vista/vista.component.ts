import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Vista } from '../../../models/M-Security/vista';
import { Modulo } from '../../../models/M-Security/modulo'; // Modelo de Modulo
import { ModuloService } from '../../../Services/S-Security/modulo.service';
import { VistaService } from '../../../Services/S-Security/vista.service';

@Component({
  selector: 'app-vista',
  templateUrl: './vista.component.html',
  styleUrls: ['./vista.component.css']
})
export class VistaComponent implements OnInit {
  vistas: Vista[] = [];
  vistaForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;
  modulos: Modulo[] = []; // Relación con Modulo
  headers = [
    { title: 'Nombre', field: 'nombre' },
    { title: 'Descripción', field: 'descripcion' },
    { title: 'Ruta', field: 'ruta' },
    { title: 'Módulo', field: 'moduloId.nombre' }, // Mostrar el nombre del módulo
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private vistaService: VistaService,
    private moduloService: ModuloService
  ) {}

  ngOnInit(): void {
    this.getVistas();
    this.getModulos();
    this.initializeForm();
  }

  initializeForm(): void {
    this.vistaForm = this.fb.group({
      id: [0],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', Validators.required],
      ruta: ['', Validators.required],
      moduloId: [null, Validators.required], // Llave foránea con Modulo
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getVistas(): void {
    this.vistaService.getVistasSinEliminar().subscribe(
      data => {
        this.vistas = data;
      },
      error => {
        console.error('Error al obtener las vistas:', error);
      }
    );
  }

  getModulos(): void {
    this.moduloService.getModulosSinEliminar().subscribe(
      data => {
        this.modulos = data;
      },
      error => {
        console.error('Error al obtener los módulos:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.vistaForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const vista: Vista = this.vistaForm.value;

    if (this.isEditing) {
      this.updateVista(vista);
    } else {
      this.createVista(vista);
    }
  }

  createVista(vista: Vista): void {
    vista.createdAt = new Date().toISOString();
    vista.updatedAt = new Date().toISOString();

    this.vistaService.createVista(vista).subscribe(
      response => {
        Swal.fire('Éxito', 'Vista creada con éxito.', 'success');
        this.getVistas();
        this.resetForm();
      },
      error => {
        console.error('Error al crear la vista:', error);
        Swal.fire('Error', 'Error al crear la vista.', 'error');
      }
    );
  }

  updateVista(vista: Vista): void {
    const updatedVista: Vista = {
      ...vista,
      updatedAt: new Date().toISOString()
    };

    this.vistaService.updateVista(updatedVista).subscribe(
      response => {
        Swal.fire('Éxito', 'Vista actualizada con éxito.', 'success');
        this.getVistas();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar la vista:', error);
        Swal.fire('Error', 'Error al actualizar la vista.', 'error');
      }
    );
  }

  resetForm(): void {
    this.vistaForm.reset({
      id: 0,
      nombre: '',
      descripcion: '',
      ruta: '',
      moduloId: null,
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: Vista): void {
    this.isEditing = true;
    this.vistaForm.patchValue({
      id: item.id,
      nombre: item.nombre,
      descripcion: item.descripcion,
      ruta: item.ruta,
      moduloId: item.moduloId.id, // Relación con módulo por ID
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
        this.vistaService.deleteVista(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'La vista ha sido eliminada.', 'success');
            this.getVistas();
          },
          error => {
            console.error('Error al eliminar la vista:', error);
            Swal.fire('Error', 'Error al eliminar la vista.', 'error');
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

    this.vistaService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getVistas();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
