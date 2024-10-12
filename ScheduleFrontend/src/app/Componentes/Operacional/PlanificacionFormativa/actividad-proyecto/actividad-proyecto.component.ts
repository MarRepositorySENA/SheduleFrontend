import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActividadProyecto } from '../../../../models/M-Operacional/PlanificacionFormativa/actividad-proyecto';
import { Fase } from '../../../../models/M-Operacional/PlanificacionFormativa/fase';
import { ActividadProyectoService } from '../../../../Services/S-Operacional/PlanificacionFormativa/actividad-proyecto.service';
import { FaseService } from '../../../../Services/S-Operacional/PlanificacionFormativa/fase.service';

@Component({
  selector: 'app-actividad-proyecto',
  templateUrl: './actividad-proyecto.component.html',
  styleUrls: ['./actividad-proyecto.component.css']
})
export class ActividadProyectoComponent implements OnInit {
  actividadesProyecto: ActividadProyecto[] = [];
  fases: Fase[] = [];
  actividadProyectoForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;

  headers = [
    { title: 'Código', field: 'codigo' },
    { title: 'Nombre', field: 'nombre' },
    { title: 'Descripción', field: 'descripcion' },
    { title: 'Fase', field: 'faseId.nombre' },
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private actividadProyectoService: ActividadProyectoService,
    private faseService: FaseService
  ) {}

  ngOnInit(): void {
    this.getActividadesProyecto();
    this.getFases();
    this.initializeForm();
  }

  initializeForm(): void {
    this.actividadProyectoForm = this.fb.group({
      id: [0],
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      faseId: this.fb.group({
        id: [null, Validators.required]
      }),
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getActividadesProyecto(): void {
    this.actividadProyectoService.getActividadesProyectoSinEliminar().subscribe(
      data => {
        this.actividadesProyecto = data;
      },
      error => {
        console.error('Error al obtener las actividades de proyecto:', error);
      }
    );
  }

  getFases(): void {
    this.faseService.getFases().subscribe(
      data => {
        this.fases = data;
      },
      error => {
        console.error('Error al obtener las fases:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.actividadProyectoForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const actividadProyecto: ActividadProyecto = this.actividadProyectoForm.value;

    if (this.isEditing) {
      this.updateActividadProyecto(actividadProyecto);
    } else {
      this.createActividadProyecto(actividadProyecto);
    }
  }

  createActividadProyecto(actividadProyecto: ActividadProyecto): void {
    actividadProyecto.createdAt = new Date().toISOString();
    actividadProyecto.updatedAt = new Date().toISOString();

    this.actividadProyectoService.createActividadProyecto(actividadProyecto).subscribe(
      response => {
        Swal.fire('Éxito', 'Actividad de proyecto creada con éxito.', 'success');
        this.getActividadesProyecto();
        this.resetForm();
      },
      error => {
        console.error('Error al crear la actividad de proyecto:', error);
        Swal.fire('Error', 'Error al crear la actividad de proyecto.', 'error');
      }
    );
  }

  updateActividadProyecto(actividadProyecto: ActividadProyecto): void {
    const updatedActividadProyecto: ActividadProyecto = {
      ...actividadProyecto,
      updatedAt: new Date().toISOString()
    };

    this.actividadProyectoService.updateActividadProyecto(updatedActividadProyecto).subscribe(
      response => {
        Swal.fire('Éxito', 'Actividad de proyecto actualizada con éxito.', 'success');
        this.getActividadesProyecto();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar la actividad de proyecto:', error);
        Swal.fire('Error', 'Error al actualizar la actividad de proyecto.', 'error');
      }
    );
  }

  resetForm(): void {
    this.actividadProyectoForm.reset({
      id: 0,
      codigo: '',
      nombre: '',
      descripcion: '',
      faseId: { id: null },
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: ActividadProyecto): void {
    this.isEditing = true;
    this.actividadProyectoForm.patchValue({
      id: item.id,
      codigo: item.codigo,
      nombre: item.nombre,
      descripcion: item.descripcion,
      faseId: item.faseId,
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
        this.actividadProyectoService.deleteActividadProyecto(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'La actividad de proyecto ha sido eliminada.', 'success');
            this.getActividadesProyecto();
          },
          error => {
            console.error('Error al eliminar la actividad de proyecto:', error);
            Swal.fire('Error', 'Error al eliminar la actividad de proyecto.', 'error');
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

    this.actividadProyectoService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getActividadesProyecto();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
