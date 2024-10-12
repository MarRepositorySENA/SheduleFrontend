import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ProyectosFormativosFichas } from '../../../../models/M-Operacional/PlanificacionFormativa/proyectos-formativos-fichas';
import { ProyectoFormativo } from '../../../../models/M-Operacional/PlanificacionFormativa/proyecto-formativo';
import { Ficha } from '../../../../models/M-Operacional/GestionHorario/ficha';
import { ProyectosFormativosFichasService } from '../../../../Services/S-Operacional/PlanificacionFormativa/proyectos-formativos-fichas.service';
import { ProyectoFormativoService } from '../../../../Services/S-Operacional/PlanificacionFormativa/proyecto-formativo.service';
import { FichaService } from '../../../../Services/S-Operacional/GestionHorario/ficha.service';


@Component({
  selector: 'app-proyectos-formativos-fichas',
  templateUrl: './proyectos-formativos-fichas.component.html',
  styleUrls: ['./proyectos-formativos-fichas.component.css']
})
export class ProyectosFormativosFichasComponent implements OnInit {
  proyectosFormativosFichas: ProyectosFormativosFichas[] = [];
  proyectoFormativoForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;
  proyectosFormativos: ProyectoFormativo[] = []; // Relación con ProyectoFormativo
  fichas: Ficha[] = []; // Relación con Ficha
  headers = [
    { title: 'Proyecto Formativo', field: 'proyectoFormativoId.titulo' }, // Mostrar título del proyecto
    { title: 'Código del Proyecto', field: 'proyectoFormativoId.codigo' }, // Mostrar código del proyecto
    { title: 'Ficha', field: 'fichaId.codigo' }, // Mostrar código de la ficha
    { title: 'Fecha Inicio', field: 'fichaId.fechaInicio' }, // Mostrar fecha de inicio de la ficha
    { title: 'Fecha Fin', field: 'fichaId.fechaFin' }, // Mostrar fecha de fin de la ficha
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private proyectosFormativosFichasService: ProyectosFormativosFichasService,
    private proyectoFormativoService: ProyectoFormativoService,
    private fichaService: FichaService

  ) {}

  ngOnInit(): void {
    this.getProyectosFormativosFichas();
    this.getProyectosFormativos();
    this.getFichas();
    this.initializeForm();
  }

  initializeForm(): void {
    this.proyectoFormativoForm = this.fb.group({
      id: [0],
      proyectoFormativoId: [null, Validators.required], // Llave foránea con ProyectoFormativo
      fichaId: [null, Validators.required], // Llave foránea con Ficha
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getProyectosFormativosFichas(): void {
    this.proyectosFormativosFichasService.getProyectosFormativosFichasSinEliminar().subscribe(
      data => {
        this.proyectosFormativosFichas = data;
      },
      error => {
        console.error('Error al obtener los proyectos formativos fichas:', error);
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

  getFichas(): void {
    this.fichaService.getFichasSinEliminar().subscribe(
      data => {
        this.fichas = data;
      },
      error => {
        console.error('Error al obtener las fichas:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.proyectoFormativoForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const proyectoFormativoFicha: ProyectosFormativosFichas = this.proyectoFormativoForm.value;

    if (this.isEditing) {
      this.updateProyectoFormativoFicha(proyectoFormativoFicha);
    } else {
      this.createProyectoFormativoFicha(proyectoFormativoFicha);
    }
  }

  createProyectoFormativoFicha(proyectoFormativoFicha: ProyectosFormativosFichas): void {
    proyectoFormativoFicha.createdAt = new Date().toISOString();
    proyectoFormativoFicha.updatedAt = new Date().toISOString();

    this.proyectosFormativosFichasService.createProyectoFormativoFicha(proyectoFormativoFicha).subscribe(
      response => {
        Swal.fire('Éxito', 'Proyecto formativo ficha creado con éxito.', 'success');
        this.getProyectosFormativosFichas();
        this.resetForm();
      },
      error => {
        console.error('Error al crear el proyecto formativo ficha:', error);
        Swal.fire('Error', 'Error al crear el proyecto formativo ficha.', 'error');
      }
    );
  }

  updateProyectoFormativoFicha(proyectoFormativoFicha: ProyectosFormativosFichas): void {
    const updatedProyectoFormativoFicha: ProyectosFormativosFichas = {
      ...proyectoFormativoFicha,
      updatedAt: new Date().toISOString()
    };

    this.proyectosFormativosFichasService.updateProyectoFormativoFicha(updatedProyectoFormativoFicha).subscribe(
      response => {
        Swal.fire('Éxito', 'Proyecto formativo ficha actualizado con éxito.', 'success');
        this.getProyectosFormativosFichas();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar el proyecto formativo ficha:', error);
        Swal.fire('Error', 'Error al actualizar el proyecto formativo ficha.', 'error');
      }
    );
  }

  resetForm(): void {
    this.proyectoFormativoForm.reset({
      id: 0,
      proyectoFormativoId: null,
      fichaId: null,
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: ProyectosFormativosFichas): void {
    this.isEditing = true;
    this.proyectoFormativoForm.patchValue({
      id: item.id,
      proyectoFormativoId: item.proyectoFormativoId.id, // Relación con proyecto formativo por ID
      fichaId: item.fichaId.id, // Relación con ficha por ID
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
        this.proyectosFormativosFichasService.deleteProyectoFormativoFicha(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'El proyecto formativo ficha ha sido eliminado.', 'success');
            this.getProyectosFormativosFichas();
          },
          error => {
            console.error('Error al eliminar el proyecto formativo ficha:', error);
            Swal.fire('Error', 'Error al eliminar el proyecto formativo ficha.', 'error');
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

    this.proyectosFormativosFichasService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getProyectosFormativosFichas();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
