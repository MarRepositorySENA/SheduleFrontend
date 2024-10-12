import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActividadesProyectosRaps } from '../../../../models/M-Operacional/PlanificacionFormativa/actividades-proyectos-raps';
import { ActividadProyecto } from '../../../../models/M-Operacional/PlanificacionFormativa/actividad-proyecto';
import { Rap } from '../../../../models/M-Operacional/GestionFormativa/rap';
import { ActividadesProyectosRapsService } from '../../../../Services/S-Operacional/PlanificacionFormativa/actividades-proyectos-raps.service';
import { ActividadProyectoService } from '../../../../Services/S-Operacional/PlanificacionFormativa/actividad-proyecto.service';
import { RapService } from '../../../../Services/S-Operacional/GestionFormativa/Rap.service';

@Component({
  selector: 'app-actividades-proyectos-raps',
  templateUrl: './actividades-proyectos-raps.component.html',
  styleUrls: ['./actividades-proyectos-raps.component.css']
})
export class ActividadesProyectosRapsComponent implements OnInit {
  actividadesProyectosRaps: ActividadesProyectosRaps[] = [];
  actividadesProyecto: ActividadProyecto[] = [];
  raps: Rap[] = [];
  actividadesProyectosRapsForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;

  headers = [
    { title: 'Actividad de Proyecto', field: 'actividadProyectoId.nombre' },
    { title: 'RAP', field: 'rapId.descripcion' },
    { title: 'Duración del RAP', field: 'rapId.duraccion' },
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private actividadesProyectosRapsService: ActividadesProyectosRapsService,
    private actividadProyectoService: ActividadProyectoService,
    private rapService: RapService
  ) {}

  ngOnInit(): void {
    this.getActividadesProyectosRaps();
    this.getActividadesProyecto();
    this.getRaps();
    this.initializeForm();
  }

  initializeForm(): void {
    this.actividadesProyectosRapsForm = this.fb.group({
      id: [0],
      actividadProyectoId: this.fb.group({
        id: [null, Validators.required]
      }),
      rapId: this.fb.group({
        id: [null, Validators.required]
      }),
      state: [true],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getActividadesProyectosRaps(): void {
    this.actividadesProyectosRapsService.getActividadesProyectosRapsSinEliminar().subscribe(
      data => {
        this.actividadesProyectosRaps = data;
      },
      error => {
        console.error('Error al obtener las actividades-proyectos-raps:', error);
      }
    );
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

  getRaps(): void {
    this.rapService.getRapsSinEliminar().subscribe(
      data => {
        this.raps = data;
      },
      error => {
        console.error('Error al obtener los RAPs:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.actividadesProyectosRapsForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const actividadProyectoRap: ActividadesProyectosRaps = this.actividadesProyectosRapsForm.value;

    if (this.isEditing) {
      this.updateActividadProyectoRap(actividadProyectoRap);
    } else {
      this.createActividadProyectoRap(actividadProyectoRap);
    }
  }

  createActividadProyectoRap(actividadProyectoRap: ActividadesProyectosRaps): void {
    actividadProyectoRap.createdAt = new Date().toISOString();
    actividadProyectoRap.updatedAt = new Date().toISOString();

    this.actividadesProyectosRapsService.createActividadesProyectosRaps(actividadProyectoRap).subscribe(
      response => {
        Swal.fire('Éxito', 'Actividad Proyecto RAP creada con éxito.', 'success');
        this.getActividadesProyectosRaps();
        this.resetForm();
      },
      error => {
        console.error('Error al crear la actividad proyecto RAP:', error);
        Swal.fire('Error', 'Error al crear la actividad proyecto RAP.', 'error');
      }
    );
  }

  updateActividadProyectoRap(actividadProyectoRap: ActividadesProyectosRaps): void {
    actividadProyectoRap.updatedAt = new Date().toISOString();

    this.actividadesProyectosRapsService.updateActividadesProyectosRaps(actividadProyectoRap).subscribe(
      response => {
        Swal.fire('Éxito', 'Actividad Proyecto RAP actualizada con éxito.', 'success');
        this.getActividadesProyectosRaps();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar la actividad proyecto RAP:', error);
        Swal.fire('Error', 'Error al actualizar la actividad proyecto RAP.', 'error');
      }
    );
  }

  resetForm(): void {
    this.actividadesProyectosRapsForm.reset({
      id: 0,
      actividadProyectoId: { id: null },
      rapId: { id: null },
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: ActividadesProyectosRaps): void {
    this.isEditing = true;
    this.actividadesProyectosRapsForm.patchValue({
      id: item.id,
      actividadProyectoId: item.actividadProyectoId,
      rapId: item.rapId,
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
        this.actividadesProyectosRapsService.deleteActividadesProyectosRaps(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'Actividad Proyecto RAP ha sido eliminada.', 'success');
            this.getActividadesProyectosRaps();
          },
          error => {
            console.error('Error al eliminar la actividad proyecto RAP:', error);
            Swal.fire('Error', 'Error al eliminar la actividad proyecto RAP.', 'error');
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

    this.actividadesProyectosRapsService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getActividadesProyectosRaps();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
