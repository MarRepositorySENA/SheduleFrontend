import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CentroFormacionService } from '../../../../Services/Parameter/Infraestructura/centro-formacion.service';
import { CiudadService } from '../../../../Services/Parameter/Ubicacion/ciudad.service';
import Swal from 'sweetalert2';
import { ProyectoFormativo } from '../../../../models/M-Operacional/PlanificacionFormativa/proyecto-formativo';
import { Ciudad } from '../../../../models/M-Parameter/Ubicacion/ciudad';
import { CentroFormacion } from '../../../../models/M-Parameter/infraestructura/centro-formacion';
import { ProyectoFormativoService } from '../../../../Services/S-Operacional/PlanificacionFormativa/proyecto-formativo.service';

@Component({
  selector: 'app-proyecto-formativo',
  templateUrl: './proyecto-formativo.component.html',
  styleUrls: ['./proyecto-formativo.component.css']
})
export class ProyectoFormativoComponent implements OnInit {
  proyectosFormativos: ProyectoFormativo[] = [];
  centrosFormacion: CentroFormacion[] = [];
  ciudades: Ciudad[] = [];
  proyectoFormativoForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;

  headers = [
    { title: 'Código', field: 'codigo' },
    { title: 'Título', field: 'titulo' },
    { title: 'Descripción', field: 'descripcion' },
    { title: 'Centro de Formación', field: 'centroFormacionId.nombre' },
    { title: 'Ciudad', field: 'ciudadId.nombre' },
    { title: 'Cantidad de RAP', field: 'cantidadRap' },
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private proyectoFormativoService: ProyectoFormativoService,
    private centroFormacionService: CentroFormacionService,
    private ciudadService: CiudadService
  ) {}

  ngOnInit(): void {
    this.getProyectosFormativos();
    this.getCentrosFormacion();
    this.getCiudades();
    this.initializeForm();
  }

  initializeForm(): void {
    this.proyectoFormativoForm = this.fb.group({
      id: [0],
      titulo: ['', Validators.required],
      codigo: ['', Validators.required],
      descripcion: ['', Validators.required],
      cantidadRap: [0, Validators.required],
      centroFormacionId: this.fb.group({
        id: [null, Validators.required]
      }),
      ciudadId: this.fb.group({
        id: [null, Validators.required]
      }),
      state: [true],
      createdAt: [''],
      updatedAt: ['']
    });
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

  getCentrosFormacion(): void {
    this.centroFormacionService.getCentrosFormacion().subscribe(
      data => {
        this.centrosFormacion = data;
      },
      error => {
        console.error('Error al obtener los centros de formación:', error);
      }
    );
  }

  getCiudades(): void {
    this.ciudadService.getCiudades().subscribe(
      data => {
        this.ciudades = data;
      },
      error => {
        console.error('Error al obtener las ciudades:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.proyectoFormativoForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const proyectoFormativo: ProyectoFormativo = this.proyectoFormativoForm.value;

    if (this.isEditing) {
      this.updateProyectoFormativo(proyectoFormativo);
    } else {
      this.createProyectoFormativo(proyectoFormativo);
    }
  }

  createProyectoFormativo(proyectoFormativo: ProyectoFormativo): void {
    proyectoFormativo.createdAt = new Date().toISOString();
    proyectoFormativo.updatedAt = new Date().toISOString();

    this.proyectoFormativoService.createProyectoFormativo(proyectoFormativo).subscribe(
      response => {
        Swal.fire('Éxito', 'Proyecto formativo creado con éxito.', 'success');
        this.getProyectosFormativos();
        this.resetForm();
      },
      error => {
        console.error('Error al crear el proyecto formativo:', error);
        Swal.fire('Error', 'Error al crear el proyecto formativo.', 'error');
      }
    );
  }

  updateProyectoFormativo(proyectoFormativo: ProyectoFormativo): void {
    proyectoFormativo.updatedAt = new Date().toISOString();

    this.proyectoFormativoService.updateProyectoFormativo(proyectoFormativo).subscribe(
      response => {
        Swal.fire('Éxito', 'Proyecto formativo actualizado con éxito.', 'success');
        this.getProyectosFormativos();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar el proyecto formativo:', error);
        Swal.fire('Error', 'Error al actualizar el proyecto formativo.', 'error');
      }
    );
  }

  resetForm(): void {
    this.proyectoFormativoForm.reset({
      id: 0,
      titulo: '',
      codigo: '',
      descripcion: '',
      cantidadRap: 0,
      centroFormacionId: { id: null },
      ciudadId: { id: null },
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: ProyectoFormativo): void {
    this.isEditing = true;
    this.proyectoFormativoForm.patchValue({
      id: item.id,
      titulo: item.titulo,
      codigo: item.codigo,
      descripcion: item.descripcion,
      cantidadRap: item.cantidadRap,
      centroFormacionId: item.centroFormacionId,
      ciudadId: item.ciudadId,
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
        this.proyectoFormativoService.deleteProyectoFormativo(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'El proyecto formativo ha sido eliminado.', 'success');
            this.getProyectosFormativos();
          },
          error => {
            console.error('Error al eliminar el proyecto formativo:', error);
            Swal.fire('Error', 'Error al eliminar el proyecto formativo.', 'error');
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

    this.proyectoFormativoService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getProyectosFormativos();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
