import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AmbienteService } from '../../../../Services/Parameter/Infraestructura/ambiente.service';

import Swal from 'sweetalert2';

import { Especialidad } from '../../../../models/M-Parameter/infraestructura/especialidad';
import { Ambiente } from '../../../../models/M-Parameter/infraestructura/ambiente';
import { EspecialidadService } from '../../../../Services/Parameter/Infraestructura/especialidad.service';


@Component({
  selector: 'app-ambiente',
  templateUrl: './ambiente.component.html',
  styleUrls: ['./ambiente.component.css']
})
export class AmbienteComponent implements OnInit {
  ambientes: Ambiente[] = [];
  especialidades: Especialidad[] = []; // Relación foránea con Especialidad
  ambienteForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;
  headers = [
    { title: 'Código', field: 'codigo' },
    { title: 'Nombre', field: 'nombre' },
    { title: 'Cupo', field: 'cupo' },
    { title: 'Especialidad', field: 'especialidadId.nombre' }, // Mostrar el nombre de la especialidad
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private ambienteService: AmbienteService,
    private especialidadService: EspecialidadService
  ) {}

  ngOnInit(): void {
    this.getAmbientes();
    this.getEspecialidades(); // Cargar las especialidades
    this.initializeForm();
  }

  initializeForm(): void {
    this.ambienteForm = this.fb.group({
      id: [0],
      codigo: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', Validators.required],
      cupo: [0, [Validators.required, Validators.min(1)]], // Cupo con validación mínima de 1
      especialidadId: this.fb.group({   // Cambiado a FormGroup
        id: [0, Validators.required] // Agregado id a tipoFormacionId
      }), // Llave foránea con Especialidad
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getAmbientes(): void {
    this.ambienteService.getAmbientesSinEliminar().subscribe(
      data => {
        this.ambientes = data;
      },
      error => {
        console.error('Error al obtener los ambientes:', error);
      }
    );
  }

  getEspecialidades(): void {
    this.especialidadService.getEspecialidadesSinEliminar().subscribe(
      data => {
        this.especialidades = data;
      },
      error => {
        console.error('Error al obtener las especialidades:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.ambienteForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const ambiente: Ambiente = this.ambienteForm.value;

    if (this.isEditing) {
      this.updateAmbiente(ambiente);
    } else {
      this.createAmbiente(ambiente);
    }
  }

  createAmbiente(ambiente: Ambiente): void {
    ambiente.createdAt = new Date().toISOString();
    ambiente.updatedAt = new Date().toISOString();

    this.ambienteService.createAmbiente(ambiente).subscribe(
      response => {
        Swal.fire('Éxito', 'Ambiente creado con éxito.', 'success');
        this.getAmbientes();
        this.resetForm();
      },
      error => {
        console.error('Error al crear el ambiente:', error);
        Swal.fire('Error', 'Error al crear el ambiente.', 'error');
      }
    );
  }

  updateAmbiente(ambiente: Ambiente): void {
    const updatedAmbiente: Ambiente = {
      ...ambiente,
      updatedAt: new Date().toISOString()
    };

    this.ambienteService.updateAmbiente(updatedAmbiente).subscribe(
      response => {
        Swal.fire('Éxito', 'Ambiente actualizado con éxito.', 'success');
        this.getAmbientes();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar el ambiente:', error);
        Swal.fire('Error', 'Error al actualizar el ambiente.', 'error');
      }
    );
  }

  resetForm(): void {
    this.ambienteForm.reset({
      id: 0,
      codigo: '',
      nombre: '',
      cupo: 0,
      especialidadId: null,
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: Ambiente): void {
    this.isEditing = true;
    this.ambienteForm.patchValue({
      id: item.id,
      codigo: item.codigo,
      nombre: item.nombre,
      cupo: item.cupo,
      especialidadId: item.especialidadId.id, // Relación con especialidad por ID
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
        this.ambienteService.deleteAmbiente(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'El ambiente ha sido eliminado.', 'success');
            this.getAmbientes();
          },
          error => {
            console.error('Error al eliminar el ambiente:', error);
            Swal.fire('Error', 'Error al eliminar el ambiente.', 'error');
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

    this.ambienteService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getAmbientes();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
