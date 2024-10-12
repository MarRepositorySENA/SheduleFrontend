import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CentroFormacionService } from '../../../../Services/Parameter/Infraestructura/centro-formacion.service';
import { RegionalService } from '../../../../Services/Parameter/Infraestructura/regional.service'; // Servicio de Regional
import { CiudadService } from '../../../../Services/Parameter/Ubicacion/ciudad.service'; // Servicio de Ciudad
import Swal from 'sweetalert2';

import { Ciudad } from '../../../../models/M-Parameter/Ubicacion/ciudad'; // Modelo de Ciudad
import { Regional } from '../../../../models/M-Parameter/infraestructura/regional';
import { CentroFormacion } from '../../../../models/M-Parameter/infraestructura/centro-formacion';

@Component({
  selector: 'app-centro-formacion',
  templateUrl: './centro-formacion.component.html',
  styleUrls: ['./centro-formacion.component.css']
})
export class CentroFormacionComponent implements OnInit {
  centrosFormacion: CentroFormacion[] = [];
  regionales: Regional[] = []; // Relación foránea con Regional
  ciudades: Ciudad[] = []; // Relación foránea con Ciudad
  centroFormacionForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;
  headers = [
    { title: 'Nombre', field: 'nombre' },
    { title: 'Dirección', field: 'direccion' },
    { title: 'Teléfono', field: 'telefono' },
    { title: 'Regional', field: 'regionalId.nombre' }, // Mostrar el nombre de la regional
    { title: 'Ciudad', field: 'ciudadId.nombre' }, // Mostrar el nombre de la ciudad
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private centroFormacionService: CentroFormacionService,
    private regionalService: RegionalService,
    private ciudadService: CiudadService
  ) {}

  ngOnInit(): void {
    this.getCentrosFormacion();
    this.getRegionales(); // Cargar los regionales
    this.getCiudades(); // Cargar las ciudades
    this.initializeForm();
  }

  initializeForm(): void {
    this.centroFormacionForm = this.fb.group({
      id: [0],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      direccion: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{7,10}$')]],
      regionalId: [null, Validators.required], // Llave foránea con Regional
      ciudadId: [null, Validators.required], // Llave foránea con Ciudad
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getCentrosFormacion(): void {
    this.centroFormacionService.getCentrosFormacionSinEliminar().subscribe(
      data => {
        this.centrosFormacion = data;
      },
      error => {
        console.error('Error al obtener los centros de formación:', error);
      }
    );
  }

  getRegionales(): void {
    this.regionalService.getRegionalesSinEliminar().subscribe(
      data => {
        this.regionales = data;
      },
      error => {
        console.error('Error al obtener los regionales:', error);
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
    if (this.centroFormacionForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const centroFormacion: CentroFormacion = this.centroFormacionForm.value;

    if (this.isEditing) {
      this.updateCentroFormacion(centroFormacion);
    } else {
      this.createCentroFormacion(centroFormacion);
    }
  }

  createCentroFormacion(centroFormacion: CentroFormacion): void {
    centroFormacion.createdAt = new Date().toISOString();
    centroFormacion.updatedAt = new Date().toISOString();

    this.centroFormacionService.createCentroFormacion(centroFormacion).subscribe(
      response => {
        Swal.fire('Éxito', 'Centro de formación creado con éxito.', 'success');
        this.getCentrosFormacion();
        this.resetForm();
      },
      error => {
        console.error('Error al crear el centro de formación:', error);
        Swal.fire('Error', 'Error al crear el centro de formación.', 'error');
      }
    );
  }

  updateCentroFormacion(centroFormacion: CentroFormacion): void {
    const updatedCentroFormacion: CentroFormacion = {
      ...centroFormacion,
      updatedAt: new Date().toISOString()
    };

    this.centroFormacionService.updateCentroFormacion(updatedCentroFormacion).subscribe(
      response => {
        Swal.fire('Éxito', 'Centro de formación actualizado con éxito.', 'success');
        this.getCentrosFormacion();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar el centro de formación:', error);
        Swal.fire('Error', 'Error al actualizar el centro de formación.', 'error');
      }
    );
  }

  resetForm(): void {
    this.centroFormacionForm.reset({
      id: 0,
      nombre: '',
      direccion: '',
      telefono: '',
      regionalId: null,
      ciudadId: null,
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: CentroFormacion): void {
    this.isEditing = true;
    this.centroFormacionForm.patchValue({
      id: item.id,
      nombre: item.nombre,
      direccion: item.direccion,
      telefono: item.telefono,
      regionalId: item.regionalId.id, // Relación con regional por ID
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
        this.centroFormacionService.deleteCentroFormacion(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'El centro de formación ha sido eliminado.', 'success');
            this.getCentrosFormacion();
          },
          error => {
            console.error('Error al eliminar el centro de formación:', error);
            Swal.fire('Error', 'Error al eliminar el centro de formación.', 'error');
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

    this.centroFormacionService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getCentrosFormacion();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
