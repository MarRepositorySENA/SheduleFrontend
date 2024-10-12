import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { Competencia } from '../../../../models/M-Operacional/GestionFormativa/competencia';
import { CompetenciaService } from '../../../../Services/S-Operacional/GestionFormativa/competencia.service';

@Component({
  selector: 'app-competencia',
  templateUrl: './competencia.component.html',
  styleUrls: ['./competencia.component.css']
})
export class CompetenciaComponent implements OnInit {
  competencias: Competencia[] = [];
  competenciaForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;
  headers = [
    { title: 'Código', field: 'codigo' },
    { title: 'Nombre', field: 'nombre' },
    { title: 'Descripción', field: 'descripcion' },
    { title: 'Duración (horas)', field: 'duraccion' },
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private competenciaService: CompetenciaService
  ) {}

  ngOnInit(): void {
    this.getCompetencias();
    this.initializeForm();
  }

  initializeForm(): void {
    this.competenciaForm = this.fb.group({
      id: [0],
      codigo: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      duraccion: [0, [Validators.required, Validators.min(1)]], // Duración mínima de 1 hora
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getCompetencias(): void {
    this.competenciaService.getCompetenciasSinEliminar().subscribe(
      data => {
        this.competencias = data;
      },
      error => {
        console.error('Error al obtener las competencias:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.competenciaForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const competencia: Competencia = this.competenciaForm.value;

    if (this.isEditing) {
      this.updateCompetencia(competencia);
    } else {
      this.createCompetencia(competencia);
    }
  }

  createCompetencia(competencia: Competencia): void {
    competencia.createdAt = new Date().toISOString();
    competencia.updatedAt = new Date().toISOString();

    this.competenciaService.createCompetencia(competencia).subscribe(
      response => {
        Swal.fire('Éxito', 'Competencia creada con éxito.', 'success');
        this.getCompetencias();
        this.resetForm();
      },
      error => {
        console.error('Error al crear la competencia:', error);
        Swal.fire('Error', 'Error al crear la competencia.', 'error');
      }
    );
  }

  updateCompetencia(competencia: Competencia): void {
    const updatedCompetencia: Competencia = {
      ...competencia,
      updatedAt: new Date().toISOString()
    };

    this.competenciaService.updateCompetencia(updatedCompetencia).subscribe(
      response => {
        Swal.fire('Éxito', 'Competencia actualizada con éxito.', 'success');
        this.getCompetencias();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar la competencia:', error);
        Swal.fire('Error', 'Error al actualizar la competencia.', 'error');
      }
    );
  }

  resetForm(): void {
    this.competenciaForm.reset({
      id: 0,
      codigo: '',
      nombre: '',
      descripcion: '',
      duraccion: 0,
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: Competencia): void {
    this.isEditing = true;
    this.competenciaForm.patchValue({
      id: item.id,
      codigo: item.codigo,
      nombre: item.nombre,
      descripcion: item.descripcion,
      duraccion: item.duraccion,
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
      confirmButtonText: 'Sí, eliminarla'
    }).then((result) => {
      if (result.isConfirmed) {
        this.competenciaService.deleteCompetencia(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'La competencia ha sido eliminada.', 'success');
            this.getCompetencias();
          },
          error => {
            console.error('Error al eliminar la competencia:', error);
            Swal.fire('Error', 'Error al eliminar la competencia.', 'error');
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

    this.competenciaService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getCompetencias();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
