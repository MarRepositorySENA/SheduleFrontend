import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ModuloService } from '../../../Services/S-Security/modulo.service';
import { Modulo } from '../../../models/M-Security/modulo';


@Component({
  selector: 'app-modulo',
  templateUrl: './modulo.component.html',
  styleUrls: ['./modulo.component.css']
})
export class ModuloComponent implements OnInit {
  modulos: Modulo[] = [];
  moduloForm!: FormGroup;
  isEditing: boolean = false;
  selectedFile!: File; // Archivo seleccionado para la carga masiva

  // Lista de íconos disponibles para seleccionar
  iconos = [
    { id: 1, name: 'Home', class: 'fa fa-home' },
    { id: 2, name: 'Usuario', class: 'fa fa-user' },
    { id: 3, name: 'Configuración', class: 'fa fa-cog' },
    { id: 4, name: 'Gráfico', class: 'fa fa-chart-bar' },
    { id: 5, name: 'Libro', class: 'fa fa-book' },
    { id: 6, name: 'Comentarios', class: 'fa fa-comments' },
    { id: 7, name: 'Correo', class: 'fa fa-envelope' },
    { id: 8, name: 'Notificación', class: 'fa fa-bell' },
    { id: 9, name: 'Seguridad', class: 'fa fa-shield-alt' },
    { id: 10, name: 'Operacional', class: 'fa fa-tachometer-alt' },
    { id: 11, name: 'Parametrización', class: 'fa fa-cogs' },
    { id: 12, name: 'Edificio', class: 'fa fa-building' },
    { id: 13, name: 'Ubicación', class: 'fa fa-map-marker-alt' }
  ];

  headers = [
    { title: 'Nombre', field: 'nombre' },
    { title: 'Ruta', field: 'ruta' },
    { title: 'Icono', field: 'icono' },
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private moduloService: ModuloService
  ) {}

  ngOnInit(): void {
    this.getModulos();
    this.initializeForm();
  }

  initializeForm(): void {
    this.moduloForm = this.fb.group({
      id: [0],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      ruta: ['', Validators.required],
      icono: ['', Validators.required],
      state: [true],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getModulos(): void {
    this.moduloService.getModulosSinEliminar().subscribe(
      (data: Modulo[]) => {
        this.modulos = data;
      },
      (error) => {
        console.error('Error al obtener los módulos:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.moduloForm.invalid) {
      Swal.fire('Error', 'Por favor, complete todos los campos correctamente.', 'error');
      return;
    }

    const modulo: Modulo = this.moduloForm.value;
    if (this.isEditing) {
      this.updateModulo(modulo);
    } else {
      this.createModulo(modulo);
    }
  }

  createModulo(modulo: Modulo): void {
    this.moduloService.createModulo(modulo).subscribe(
      (response) => {
        Swal.fire('Éxito', 'Módulo creado con éxito.', 'success');
        this.getModulos();
        this.resetForm();
      },
      (error) => {
        console.error('Error al crear el módulo:', error);
        Swal.fire('Error', 'Error al crear el módulo.', 'error');
      }
    );
  }

  updateModulo(modulo: Modulo): void {
    this.moduloService.updateModulo(modulo).subscribe(
      (response) => {
        Swal.fire('Éxito', 'Módulo actualizado con éxito.', 'success');
        this.getModulos();
        this.resetForm();
        this.isEditing = false;
      },
      (error) => {
        console.error('Error al actualizar el módulo:', error);
        Swal.fire('Error', 'Error al actualizar el módulo.', 'error');
      }
    );
  }

  resetForm(): void {
    this.moduloForm.reset({
      id: 0,
      nombre: '',
      ruta: '',
      icono: '',
      state: true
    });
    this.isEditing = false;
  }

  onEdit(modulo: Modulo): void {
    this.isEditing = true;
    this.moduloForm.patchValue(modulo);
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
        this.moduloService.deleteModulo(id).subscribe(
          (response) => {
            Swal.fire('Eliminado', 'El módulo ha sido eliminado.', 'success');
            this.getModulos();
          },
          (error) => {
            console.error('Error al eliminar el módulo:', error);
            Swal.fire('Error', 'Error al eliminar el módulo.', 'error');
          }
        );
      }
    });
  }

  // Carga masiva: Al seleccionar el archivo
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  // Carga masiva: Sube el archivo Excel
  uploadExcel(): void {
    if (!this.selectedFile) {
      Swal.fire('Error', 'Por favor seleccione un archivo Excel', 'error');
      return;
    }

    this.moduloService.cargarMasivo(this.selectedFile).subscribe(
      (response) => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito', 'success');
        this.getModulos();  // Refrescar los datos después de la carga
      },
      (error) => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', 'Error durante la carga masiva', 'error');
      }
    );
  }
}
