import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Funciones } from '../../../../models/M-Operacional/GestionPersonal/funciones';
import { ProyectoFormativo } from '../../../../models/M-Operacional/PlanificacionFormativa/proyecto-formativo';
import { FuncionesService } from '../../../../Services/S-Operacional/GestionPersonal/Funciones.service';
import { ProyectoFormativoService } from '../../../../Services/S-Operacional/PlanificacionFormativa/proyecto-formativo.service';


@Component({
  selector: 'app-funciones',
  templateUrl: './funciones.component.html',
  styleUrls: ['./funciones.component.css']
})
export class FuncionesComponent implements OnInit {
  funciones: Funciones[] = [];
  proyectosFormativos: ProyectoFormativo[] = [];
  funcionesForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;

  headers = [
    { title: 'Código', field: 'codigo' },
    { title: 'Nombre', field: 'nombre' },
    { title: 'Descripción', field: 'descripcion' },
    { title: 'Proyecto Formativo', field: 'proyectoFormativoId.titulo' },
    { title: 'Centro de Formación', field: 'proyectoFormativoId.centroFormacionId.nombre' },
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private funcionesService: FuncionesService,
    private proyectoFormativoService: ProyectoFormativoService
  ) {}

  ngOnInit(): void {
    this.getFunciones();
    this.getProyectosFormativos();
    this.initializeForm();
  }

  initializeForm(): void {
    this.funcionesForm = this.fb.group({
      id: [0],
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      proyectoFormativoId: this.fb.group({
        id: [null, Validators.required]
      }),
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getFunciones(): void {
    this.funcionesService.getFuncionesSinEliminar().subscribe(
      data => {
        this.funciones = data;
      },
      error => {
        console.error('Error al obtener las funciones:', error);
      }
    );
  }

  getProyectosFormativos(): void {
    this.proyectoFormativoService.getProyectosFormativos().subscribe(
      data => {
        this.proyectosFormativos = data;
      },
      error => {
        console.error('Error al obtener los proyectos formativos:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.funcionesForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const funciones: Funciones = this.funcionesForm.value;

    if (this.isEditing) {
      this.updateFunciones(funciones);
    } else {
      this.createFunciones(funciones);
    }
  }

  createFunciones(funciones: Funciones): void {
    funciones.createdAt = new Date().toISOString();
    funciones.updatedAt = new Date().toISOString();

    this.funcionesService.createFunciones(funciones).subscribe(
      response => {
        Swal.fire('Éxito', 'Función creada con éxito.', 'success');
        this.getFunciones();
        this.resetForm();
      },
      error => {
        console.error('Error al crear la función:', error);
        Swal.fire('Error', 'Error al crear la función.', 'error');
      }
    );
  }

  updateFunciones(funciones: Funciones): void {
    const updatedFunciones: Funciones = {
      ...funciones,
      updatedAt: new Date().toISOString()
    };

    this.funcionesService.updateFunciones(updatedFunciones).subscribe(
      response => {
        Swal.fire('Éxito', 'Función actualizada con éxito.', 'success');
        this.getFunciones();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar la función:', error);
        Swal.fire('Error', 'Error al actualizar la función.', 'error');
      }
    );
  }

  resetForm(): void {
    this.funcionesForm.reset({
      id: 0,
      codigo: '',
      nombre: '',
      descripcion: '',
      proyectoFormativoId: { id: null },
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: Funciones): void {
    this.isEditing = true;
    this.funcionesForm.patchValue({
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
        this.funcionesService.deleteFunciones(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'La función ha sido eliminada.', 'success');
            this.getFunciones();
          },
          error => {
            console.error('Error al eliminar la función:', error);
            Swal.fire('Error', 'Error al eliminar la función.', 'error');
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

    this.funcionesService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getFunciones();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
