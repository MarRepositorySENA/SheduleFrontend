import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalidadService } from '../../../../Services/Parameter/Ubicacion/localidad.service';
import { CiudadService } from '../../../../Services/Parameter/Ubicacion/ciudad.service'; // Servicio de Ciudad
import Swal from 'sweetalert2';
import { Localidad } from '../../../../models/M-Parameter/Ubicacion/localidad';
import { Ciudad } from '../../../../models/M-Parameter/Ubicacion/ciudad'; // Modelo de Ciudad

@Component({
  selector: 'app-localidad',
  templateUrl: './localidad.component.html',
  styleUrls: ['./localidad.component.css']
})
export class LocalidadComponent implements OnInit {
  localidades: Localidad[] = [];
  ciudades: Ciudad[] = []; // Relación foránea con Ciudad
  localidadForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;
  headers = [
    { title: 'Nombre', field: 'nombre' },
    { title: 'Código Postal', field: 'codigoPostal' },
    { title: 'Ciudad', field: 'ciudadId.nombre' }, // Mostrar el nombre de la ciudad
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private localidadService: LocalidadService,
    private ciudadService: CiudadService
  ) {}

  ngOnInit(): void {
    this.getLocalidades();
    this.getCiudades(); // Cargar las ciudades
    this.initializeForm();
  }

  initializeForm(): void {
    this.localidadForm = this.fb.group({
      id: [0],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      codigoPostal: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]], // Código postal con validación
      ciudadId: [null, Validators.required], // Llave foránea con Ciudad
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getLocalidades(): void {
    this.localidadService.getLocalidadesSinEliminar().subscribe(
      data => {
        this.localidades = data;
      },
      error => {
        console.error('Error al obtener las localidades:', error);
      }
    );
  }

  getCiudades(): void {
    this.ciudadService.getCiudadesSinEliminar().subscribe(
      data => {
        this.ciudades = data;
      },
      error => {
        console.error('Error al obtener las ciudades:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.localidadForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const localidad: Localidad = this.localidadForm.value;

    if (this.isEditing) {
      this.updateLocalidad(localidad);
    } else {
      this.createLocalidad(localidad);
    }
  }

  createLocalidad(localidad: Localidad): void {
    localidad.createdAt = new Date().toISOString();
    localidad.updatedAt = new Date().toISOString();

    this.localidadService.createLocalidad(localidad).subscribe(
      response => {
        Swal.fire('Éxito', 'Localidad creada con éxito.', 'success');
        this.getLocalidades();
        this.resetForm();
      },
      error => {
        console.error('Error al crear la localidad:', error);
        Swal.fire('Error', 'Error al crear la localidad.', 'error');
      }
    );
  }

  updateLocalidad(localidad: Localidad): void {
    const updatedLocalidad: Localidad = {
      ...localidad,
      updatedAt: new Date().toISOString()
    };

    this.localidadService.updateLocalidad(updatedLocalidad).subscribe(
      response => {
        Swal.fire('Éxito', 'Localidad actualizada con éxito.', 'success');
        this.getLocalidades();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar la localidad:', error);
        Swal.fire('Error', 'Error al actualizar la localidad.', 'error');
      }
    );
  }

  resetForm(): void {
    this.localidadForm.reset({
      id: 0,
      nombre: '',
      codigoPostal: '',
      ciudadId: null,
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: Localidad): void {
    this.isEditing = true;
    this.localidadForm.patchValue({
      id: item.id,
      nombre: item.nombre,
      codigoPostal: item.codigoPostal,
      ciudadId: item.ciudadId.id, // Relación con ciudad por ID
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
        this.localidadService.deleteLocalidad(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'La localidad ha sido eliminada.', 'success');
            this.getLocalidades();
          },
          error => {
            console.error('Error al eliminar la localidad:', error);
            Swal.fire('Error', 'Error al eliminar la localidad.', 'error');
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

    this.localidadService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getLocalidades();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
