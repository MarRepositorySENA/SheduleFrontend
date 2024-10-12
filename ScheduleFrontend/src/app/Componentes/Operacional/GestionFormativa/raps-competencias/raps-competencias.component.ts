import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { RapsCompetencias } from '../../../../models/M-Operacional/GestionFormativa/raps-competencias';
import { Rap } from '../../../../models/M-Operacional/GestionFormativa/rap';
import { Competencia } from '../../../../models/M-Operacional/GestionFormativa/competencia';
import { RapsCompetenciasService } from '../../../../Services/S-Operacional/GestionFormativa/RapsCompetencias.service';
import { RapService } from '../../../../Services/S-Operacional/GestionFormativa/Rap.service';
import { CompetenciaService } from '../../../../Services/S-Operacional/GestionFormativa/competencia.service';

@Component({
  selector: 'app-raps-competencias',
  templateUrl: './raps-competencias.component.html',
  styleUrls: ['./raps-competencias.component.css']
})
export class RapsCompetenciasComponent implements OnInit {
  rapsCompetencias: RapsCompetencias[] = [];
  raps: Rap[] = [];
  competencias: Competencia[] = [];
  rapsCompetenciasForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;

  headers = [
    { title: 'RAP', field: 'rapId.descripcion' },
    { title: 'Competencia', field: 'competenciaId.nombre' },
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private rapsCompetenciasService: RapsCompetenciasService,
    private rapService: RapService,
    private competenciaService: CompetenciaService
  ) {}

  ngOnInit(): void {
    this.getRapsCompetencias();
    this.getRaps();
    this.getCompetencias();
    this.initializeForm();
  }

  initializeForm(): void {
    this.rapsCompetenciasForm = this.fb.group({
      id: [0],
      rapId: [null, Validators.required],
      competenciaId: [null, Validators.required],
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getRapsCompetencias(): void {
    this.rapsCompetenciasService.getRapsCompetenciasSinEliminar().subscribe(
      data => {
        this.rapsCompetencias = data;
      },
      error => {
        console.error('Error al obtener las relaciones RAP-Competencia:', error);
      }
    );
  }

  getRaps(): void {
    this.rapService.getRaps().subscribe(
      data => {
        this.raps = data;
      },
      error => {
        console.error('Error al obtener los RAPs:', error);
      }
    );
  }

  getCompetencias(): void {
    this.competenciaService.getCompetencias().subscribe(
      data => {
        this.competencias = data;
      },
      error => {
        console.error('Error al obtener las competencias:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.rapsCompetenciasForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const rapsCompetencias: RapsCompetencias = this.rapsCompetenciasForm.value;

    if (this.isEditing) {
      this.updateRapsCompetencias(rapsCompetencias);
    } else {
      this.createRapsCompetencias(rapsCompetencias);
    }
  }

  createRapsCompetencias(rapsCompetencias: RapsCompetencias): void {
    rapsCompetencias.createdAt = new Date().toISOString();
    rapsCompetencias.updatedAt = new Date().toISOString();

    this.rapsCompetenciasService.createRapsCompetencias(rapsCompetencias).subscribe(
      response => {
        Swal.fire('Éxito', 'Relación RAP-Competencia creada con éxito.', 'success');
        this.getRapsCompetencias();
        this.resetForm();
      },
      error => {
        console.error('Error al crear la relación:', error);
        Swal.fire('Error', 'Error al crear la relación.', 'error');
      }
    );
  }

  updateRapsCompetencias(rapsCompetencias: RapsCompetencias): void {
    const updatedRapsCompetencias: RapsCompetencias = {
      ...rapsCompetencias,
      updatedAt: new Date().toISOString()
    };

    this.rapsCompetenciasService.updateRapsCompetencias(updatedRapsCompetencias).subscribe(
      response => {
        Swal.fire('Éxito', 'Relación RAP-Competencia actualizada con éxito.', 'success');
        this.getRapsCompetencias();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar la relación:', error);
        Swal.fire('Error', 'Error al actualizar la relación.', 'error');
      }
    );
  }

  resetForm(): void {
    this.rapsCompetenciasForm.reset({
      id: 0,
      rapId: null,
      competenciaId: null,
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: RapsCompetencias): void {
    this.isEditing = true;
    this.rapsCompetenciasForm.patchValue({
      id: item.id,
      rapId: item.rapId.id,
      competenciaId: item.competenciaId.id,
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
        this.rapsCompetenciasService.deleteRapsCompetencias(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'La relación ha sido eliminada.', 'success');
            this.getRapsCompetencias();
          },
          error => {
            console.error('Error al eliminar la relación:', error);
            Swal.fire('Error', 'Error al eliminar la relación.', 'error');
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

    this.rapsCompetenciasService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getRapsCompetencias();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
