import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegionalService } from '../../../../Services/Parameter/Infraestructura/regional.service';
import { DepartamentoService } from '../../../../Services/Parameter/Ubicacion/departamento.service'; // Servicio de Departamento
import Swal from 'sweetalert2';

import { Departamento } from '../../../../models/M-Parameter/Ubicacion/departamento'; // Modelo de Departamento
import { Regional } from '../../../../models/M-Parameter/infraestructura/regional';

@Component({
  selector: 'app-regional',
  templateUrl: './regional.component.html',
  styleUrls: ['./regional.component.css']
})
export class RegionalComponent implements OnInit {
  regionales: Regional[] = [];
  departamentos: Departamento[] = []; // Relación foránea con Departamento
  regionalForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;
  headers = [
    { title: 'NIT', field: 'nit' },
    { title: 'Nombre', field: 'nombre' },
    { title: 'Acrónimo', field: 'acronimo' },
    { title: 'Dirección', field: 'direccion' },
    { title: 'Teléfono', field: 'telefono' },
    { title: 'Departamento', field: 'departamentoId.nombre' }, // Mostrar el nombre del departamento
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private regionalService: RegionalService,
    private departamentoService: DepartamentoService
  ) {}

  ngOnInit(): void {
    this.getRegionales();
    this.getDepartamentos(); // Cargar los departamentos
    this.initializeForm();
  }

  initializeForm(): void {
    this.regionalForm = this.fb.group({
      id: [0],
      nit: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Validación para NIT solo números
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      acronimo: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{7,10}$')]], // Validación para teléfono
      departamentoId: [null, Validators.required], // Llave foránea con Departamento
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
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
    if (this.regionalForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const regional: Regional = this.regionalForm.value;

    if (this.isEditing) {
      this.updateRegional(regional);
    } else {
      this.createRegional(regional);
    }
  }

  createRegional(regional: Regional): void {
    regional.createdAt = new Date().toISOString();
    regional.updatedAt = new Date().toISOString();

    this.regionalService.createRegional(regional).subscribe(
      response => {
        Swal.fire('Éxito', 'Regional creada con éxito.', 'success');
        this.getRegionales();
        this.resetForm();
      },
      error => {
        console.error('Error al crear la regional:', error);
        Swal.fire('Error', 'Error al crear la regional.', 'error');
      }
    );
  }

  updateRegional(regional: Regional): void {
    const updatedRegional: Regional = {
      ...regional,
      updatedAt: new Date().toISOString()
    };

    this.regionalService.updateRegional(updatedRegional).subscribe(
      response => {
        Swal.fire('Éxito', 'Regional actualizada con éxito.', 'success');
        this.getRegionales();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar la regional:', error);
        Swal.fire('Error', 'Error al actualizar la regional.', 'error');
      }
    );
  }

  resetForm(): void {
    this.regionalForm.reset({
      id: 0,
      nit: '',
      nombre: '',
      acronimo: '',
      direccion: '',
      telefono: '',
      departamentoId: null,
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: Regional): void {
    this.isEditing = true;
    this.regionalForm.patchValue({
      id: item.id,
      nit: item.nit,
      nombre: item.nombre,
      acronimo: item.acronimo,
      direccion: item.direccion,
      telefono: item.telefono,
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
        this.regionalService.deleteRegional(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'La regional ha sido eliminada.', 'success');
            this.getRegionales();
          },
          error => {
            console.error('Error al eliminar la regional:', error);
            Swal.fire('Error', 'Error al eliminar la regional.', 'error');
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

    this.regionalService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getRegionales();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
