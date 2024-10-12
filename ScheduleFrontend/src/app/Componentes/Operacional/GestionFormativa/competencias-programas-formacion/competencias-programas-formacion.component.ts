import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CompetenciasProgramasFormacion } from '../../../../models/M-Operacional/GestionFormativa/competencias-programas-formacion';
import { ProgramaFormacion } from '../../../../models/M-Operacional/GestionFormativa/programa-formacion';
import { Competencia } from '../../../../models/M-Operacional/GestionFormativa/competencia';
import { CompetenciasProgramasFormacionService } from '../../../../Services/S-Operacional/GestionFormativa/competenciasProgramasFormacion.service';
import { CompetenciaService } from '../../../../Services/S-Operacional/GestionFormativa/competencia.service';
import { ProgramaFormacionService } from '../../../../Services/S-Operacional/GestionFormativa/ProgramaFormacion.service';

@Component({
  selector: 'app-competencias-programas-formacion',
  templateUrl: './competencias-programas-formacion.component.html',
  styleUrls: ['./competencias-programas-formacion.component.css']
})
export class CompetenciasProgramasFormacionComponent implements OnInit {
  competenciasProgramasFormacion: CompetenciasProgramasFormacion[] = [];
  programasFormacion: ProgramaFormacion[] = [];
  competencias: Competencia[] = [];
  competenciasProgramasFormacionForm!: FormGroup;
  selectedFile!: File;
  isEditing: boolean = false;

  headers = [
    { title: 'Programa de Formación', field: 'programaFormacionId.nombre' },
    { title: 'Competencia', field: 'competenciaId.nombre' },
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private competenciasProgramasFormacionService: CompetenciasProgramasFormacionService,
    private programaFormacionService: ProgramaFormacionService,
    private competenciaService: CompetenciaService
  ) {}

  ngOnInit(): void {
    this.getCompetenciasProgramasFormacion();
    this.getProgramasFormacion();
    this.getCompetencias();
    this.initializeForm();
  }

  initializeForm(): void {
    this.competenciasProgramasFormacionForm = this.fb.group({
      id: [0],
      programaFormacionId: [null, Validators.required],
      competenciaId: [null, Validators.required],
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getCompetenciasProgramasFormacion(): void {
    this.competenciasProgramasFormacionService.getCompetenciasProgramasFormacionSinEliminar().subscribe(
      data => {
        this.competenciasProgramasFormacion = data;
      },
      error => {
        console.error('Error al obtener las competencias-programas de formación:', error);
      }
    );
  }

  getProgramasFormacion(): void {
    this.programaFormacionService.getProgramasFormacion().subscribe(
      data => {
        this.programasFormacion = data;
      },
      error => {
        console.error('Error al obtener los programas de formación:', error);
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
    if (this.competenciasProgramasFormacionForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const competenciasProgramasFormacion: CompetenciasProgramasFormacion = this.competenciasProgramasFormacionForm.value;

    if (this.isEditing) {
      this.updateCompetenciasProgramasFormacion(competenciasProgramasFormacion);
    } else {
      this.createCompetenciasProgramasFormacion(competenciasProgramasFormacion);
    }
  }

  createCompetenciasProgramasFormacion(competenciasProgramasFormacion: CompetenciasProgramasFormacion): void {
    competenciasProgramasFormacion.createdAt = new Date().toISOString();
    competenciasProgramasFormacion.updatedAt = new Date().toISOString();

    this.competenciasProgramasFormacionService.createCompetenciasProgramasFormacion(competenciasProgramasFormacion).subscribe(
      response => {
        Swal.fire('Éxito', 'Relación entre competencia y programa de formación creada con éxito.', 'success');
        this.getCompetenciasProgramasFormacion();
        this.resetForm();
      },
      error => {
        console.error('Error al crear la relación:', error);
        Swal.fire('Error', 'Error al crear la relación.', 'error');
      }
    );
  }

  updateCompetenciasProgramasFormacion(competenciasProgramasFormacion: CompetenciasProgramasFormacion): void {
    const updatedCompetenciasProgramasFormacion: CompetenciasProgramasFormacion = {
      ...competenciasProgramasFormacion,
      updatedAt: new Date().toISOString()
    };

    this.competenciasProgramasFormacionService.updateCompetenciasProgramasFormacion(updatedCompetenciasProgramasFormacion).subscribe(
      response => {
        Swal.fire('Éxito', 'Relación entre competencia y programa de formación actualizada con éxito.', 'success');
        this.getCompetenciasProgramasFormacion();
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
    this.competenciasProgramasFormacionForm.reset({
      id: 0,
      programaFormacionId: null,
      competenciaId: null,
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: CompetenciasProgramasFormacion): void {
    this.isEditing = true;
    this.competenciasProgramasFormacionForm.patchValue({
      id: item.id,
      programaFormacionId: item.programaFormacionId.id,
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
        this.competenciasProgramasFormacionService.deleteCompetenciasProgramasFormacion(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'La relación ha sido eliminada.', 'success');
            this.getCompetenciasProgramasFormacion();
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

    this.competenciasProgramasFormacionService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getCompetenciasProgramasFormacion();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
