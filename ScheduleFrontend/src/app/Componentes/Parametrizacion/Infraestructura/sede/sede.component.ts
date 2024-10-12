import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SedeService } from '../../../../Services/Parameter/Infraestructura/sede.service';
import { CentroFormacionService } from '../../../../Services/Parameter/Infraestructura/centro-formacion.service'; // Servicio de CentroFormacion
import Swal from 'sweetalert2';
import { Sede } from '../../../../models/M-Parameter/infraestructura/sede';
import { CentroFormacion } from '../../../../models/M-Parameter/infraestructura/centro-formacion';


@Component({
  selector: 'app-sede',
  templateUrl: './sede.component.html',
  styleUrls: ['./sede.component.css']
})
export class SedeComponent implements OnInit {
  sedes: Sede[] = [];
  centrosFormacion: CentroFormacion[] = []; // Relación foránea con CentroFormacion
  sedeForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;
  headers = [
    { title: 'Código', field: 'codigo' },
    { title: 'Nombre', field: 'nombre' },
    { title: 'Dirección', field: 'direccion' },
    { title: 'Centro de Formación', field: 'centroFormacionId.nombre' }, // Mostrar el nombre del centro de formación
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private sedeService: SedeService,
    private centroFormacionService: CentroFormacionService
  ) {}

  ngOnInit(): void {
    this.getSedes();
    this.getCentrosFormacion(); // Cargar los centros de formación
    this.initializeForm();
  }

  initializeForm(): void {
    this.sedeForm = this.fb.group({
      id: [0],
      codigo: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      centroFormacionId: [null, Validators.required], // Llave foránea con CentroFormacion
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getSedes(): void {
    this.sedeService.getSedesSinEliminar().subscribe(
      data => {
        this.sedes = data;
      },
      error => {
        console.error('Error al obtener las sedes:', error);
      }
    );
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

  onSubmit(): void {
    if (this.sedeForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const sede: Sede = this.sedeForm.value;

    if (this.isEditing) {
      this.updateSede(sede);
    } else {
      this.createSede(sede);
    }
  }

  createSede(sede: Sede): void {
    sede.createdAt = new Date().toISOString();
    sede.updatedAt = new Date().toISOString();

    this.sedeService.createSede(sede).subscribe(
      response => {
        Swal.fire('Éxito', 'Sede creada con éxito.', 'success');
        this.getSedes();
        this.resetForm();
      },
      error => {
        console.error('Error al crear la sede:', error);
        Swal.fire('Error', 'Error al crear la sede.', 'error');
      }
    );
  }

  updateSede(sede: Sede): void {
    const updatedSede: Sede = {
      ...sede,
      updatedAt: new Date().toISOString()
    };

    this.sedeService.updateSede(updatedSede).subscribe(
      response => {
        Swal.fire('Éxito', 'Sede actualizada con éxito.', 'success');
        this.getSedes();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar la sede:', error);
        Swal.fire('Error', 'Error al actualizar la sede.', 'error');
      }
    );
  }

  resetForm(): void {
    this.sedeForm.reset({
      id: 0,
      codigo: '',
      nombre: '',
      direccion: '',
      centroFormacionId: null,
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: Sede): void {
    this.isEditing = true;
    this.sedeForm.patchValue({
      id: item.id,
      codigo: item.codigo,
      nombre: item.nombre,
      direccion: item.direccion,
      centroFormacionId: item.centroFormacionId.id, // Relación con centro de formación por ID
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
        this.sedeService.deleteSede(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'La sede ha sido eliminada.', 'success');
            this.getSedes();
          },
          error => {
            console.error('Error al eliminar la sede:', error);
            Swal.fire('Error', 'Error al eliminar la sede.', 'error');
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

    this.sedeService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getSedes();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
