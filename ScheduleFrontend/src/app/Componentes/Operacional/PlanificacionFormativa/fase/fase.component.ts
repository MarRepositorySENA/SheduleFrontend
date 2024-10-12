import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Fase } from '../../../../models/M-Operacional/PlanificacionFormativa/fase';
import { ProyectoFormativo } from '../../../../models/M-Operacional/PlanificacionFormativa/proyecto-formativo';
import { ProyectoFormativoService } from '../../../../Services/S-Operacional/PlanificacionFormativa/proyecto-formativo.service';
import { FaseService } from '../../../../Services/S-Operacional/PlanificacionFormativa/fase.service';

@Component({
  selector: 'app-fase',
  templateUrl: './fase.component.html',
  styleUrls: ['./fase.component.css']
})
export class FaseComponent implements OnInit {
  fases: Fase[] = [];
  proyectosFormativos: ProyectoFormativo[] = [];
  faseForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;

  headers = [
    { title: 'Código', field: 'codigo' },
    { title: 'Nombre', field: 'nombre' },
    { title: 'Descripción', field: 'descripcion' },
    { title: 'Proyecto Formativo', field: 'proyectoFormativoId.titulo' },
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private faseService: FaseService,
    private proyectoFormativoService: ProyectoFormativoService
  ) {}

  ngOnInit(): void {
    this.getFases();
    this.getProyectosFormativos();
    this.initializeForm();
  }

  initializeForm(): void {
    this.faseForm = this.fb.group({
      id: [0],
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      proyectoFormativoId: this.fb.group({
        id: [null, Validators.required]
      }),
      state: [true],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getFases(): void {
    this.faseService.getFasesSinEliminar().subscribe(
      data => {
        this.fases = data;
      },
      error => {
        console.error('Error al obtener las fases:', error);
      }
    );
  }

  getProyectosFormativos(): void {
    this.proyectoFormativoService.getProyectosFormativosSinEliminar().subscribe(
      data => {
        this.proyectosFormativos = data;
      },
      error => {
        console.error('Error al obtener los proyectos formativos:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.faseForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const fase: Fase = this.faseForm.value;

    if (this.isEditing) {
      this.updateFase(fase);
    } else {
      this.createFase(fase);
    }
  }

  createFase(fase: Fase): void {
    fase.createdAt = new Date().toISOString();
    fase.updatedAt = new Date().toISOString();

    this.faseService.createFase(fase).subscribe(
      response => {
        Swal.fire('Éxito', 'Fase creada con éxito.', 'success');
        this.getFases();
        this.resetForm();
      },
      error => {
        console.error('Error al crear la fase:', error);
        Swal.fire('Error', 'Error al crear la fase.', 'error');
      }
    );
  }

  updateFase(fase: Fase): void {
    fase.updatedAt = new Date().toISOString();

    this.faseService.updateFase(fase).subscribe(
      response => {
        Swal.fire('Éxito', 'Fase actualizada con éxito.', 'success');
        this.getFases();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar la fase:', error);
        Swal.fire('Error', 'Error al actualizar la fase.', 'error');
      }
    );
  }

  resetForm(): void {
    this.faseForm.reset({
      id: 0,
      codigo: '',
      nombre: '',
      descripcion: '',
      proyectoFormativoId: { id: null },
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: Fase): void {
    this.isEditing = true;
    this.faseForm.patchValue({
      id: item.id,
      codigo: item.codigo,
      nombre: item.nombre,
      descripcion: item.descripcion,
      proyectoFormativoId: item.proyectoFormativoId,
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
        this.faseService.deleteFase(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'La fase ha sido eliminada.', 'success');
            this.getFases();
          },
          error => {
            console.error('Error al eliminar la fase:', error);
            Swal.fire('Error', 'Error al eliminar la fase.', 'error');
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

    this.faseService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getFases();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
