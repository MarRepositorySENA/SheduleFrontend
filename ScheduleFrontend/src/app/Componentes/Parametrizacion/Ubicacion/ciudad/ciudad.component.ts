import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CiudadService } from '../../../../Services/Parameter/Ubicacion/ciudad.service';
import { DepartamentoService } from '../../../../Services/Parameter/Ubicacion/departamento.service'; // Servicio de Departamento
import Swal from 'sweetalert2';
import { Ciudad } from '../../../../models/M-Parameter/Ubicacion/ciudad';
import { Departamento } from '../../../../models/M-Parameter/Ubicacion/departamento'; // Modelo de Departamento

@Component({
  selector: 'app-ciudad',
  templateUrl: './ciudad.component.html',
  styleUrls: ['./ciudad.component.css']
})
export class CiudadComponent implements OnInit {
  ciudades: Ciudad[] = [];
  departamentos: Departamento[] = []; // Relación foránea con Departamento
  ciudadForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;
  headers = [
    { title: 'Nombre', field: 'nombre' },
    { title: 'Código', field: 'codigo' },
    { title: 'Departamento', field: 'departamentoId.nombre' }, // Mostrar el nombre del departamento
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private ciudadService: CiudadService,
    private departamentoService: DepartamentoService
  ) {}

  ngOnInit(): void {
    this.getCiudades();
    this.getDepartamentos(); // Cargar los departamentos
    this.initializeForm();
  }

  initializeForm(): void {
    this.ciudadForm = this.fb.group({
      id: [0],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      codigo: ['', Validators.required],
      departamentoId: [null, Validators.required], // Llave foránea con Departamento
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
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

  getDepartamentos(): void {
    this.departamentoService.getDepartamentosSinEliminar().subscribe(
      data => {
        this.departamentos = data;
      },
      error => {
        console.error('Error al obtener los departamentos:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.ciudadForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const ciudad: Ciudad = this.ciudadForm.value;

    if (this.isEditing) {
      this.updateCiudad(ciudad);
    } else {
      this.createCiudad(ciudad);
    }
  }

  createCiudad(ciudad: Ciudad): void {
    ciudad.createdAt = new Date().toISOString();
    ciudad.updatedAt = new Date().toISOString();

    this.ciudadService.createCiudad(ciudad).subscribe(
      response => {
        Swal.fire('Éxito', 'Ciudad creada con éxito.', 'success');
        this.getCiudades();
        this.resetForm();
      },
      error => {
        console.error('Error al crear la ciudad:', error);
        Swal.fire('Error', 'Error al crear la ciudad.', 'error');
      }
    );
  }

  updateCiudad(ciudad: Ciudad): void {
    const updatedCiudad: Ciudad = {
      ...ciudad,
      updatedAt: new Date().toISOString()
    };

    this.ciudadService.updateCiudad(updatedCiudad).subscribe(
      response => {
        Swal.fire('Éxito', 'Ciudad actualizada con éxito.', 'success');
        this.getCiudades();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar la ciudad:', error);
        Swal.fire('Error', 'Error al actualizar la ciudad.', 'error');
      }
    );
  }

  resetForm(): void {
    this.ciudadForm.reset({
      id: 0,
      nombre: '',
      codigo: '',
      departamentoId: null,
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: Ciudad): void {
    this.isEditing = true;
    this.ciudadForm.patchValue({
      id: item.id,
      nombre: item.nombre,
      codigo: item.codigo,
      departamentoId: item.departamentoId.id, // Relación con departamento por ID
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
        this.ciudadService.deleteCiudad(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'La ciudad ha sido eliminada.', 'success');
            this.getCiudades();
          },
          error => {
            console.error('Error al eliminar la ciudad:', error);
            Swal.fire('Error', 'Error al eliminar la ciudad.', 'error');
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

    this.ciudadService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getCiudades();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
