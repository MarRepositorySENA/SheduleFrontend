import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Matricula } from '../../../../models/M-Operacional/GestionHorario/matricula';
import { Ficha } from '../../../../models/M-Operacional/GestionHorario/ficha';
import { MatriculaService } from '../../../../Services/S-Operacional/GestionHorario/matricula.service';
import { PersonaService } from '../../../../Services/S-Security/persona.service';
import { FichaService } from '../../../../Services/S-Operacional/GestionHorario/ficha.service';
import { Persona } from '../../../../models/M-Security/persona';

@Component({
  selector: 'app-matricula',
  templateUrl: './matricula.component.html',
  styleUrls: ['./matricula.component.css']
})
export class MatriculaComponent implements OnInit {
  matriculas: Matricula[] = [];
  personas: Persona[] = [];
  fichas: Ficha[] = [];
  matriculaForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;

  headers = [
    { title: 'Estado Proceso', field: 'estadoProceso' },
    { title: 'Persona', field: 'personaId.primerNombre' },
    { title: 'Ficha', field: 'fichaId.codigo' },
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private matriculaService: MatriculaService,
    private personaService: PersonaService,
    private fichaService: FichaService
  ) {}

  ngOnInit(): void {
    this.getMatriculas();
    this.getPersonas();
    this.getFichas();
    this.initializeForm();
  }

  initializeForm(): void {
    this.matriculaForm = this.fb.group({
      id: [0],
      estadoProceso: ['', Validators.required],
      personaId: this.fb.group({
        id: [null, Validators.required]
      }),
      fichaId: this.fb.group({
        id: [null, Validators.required]
      }),
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getMatriculas(): void {
    this.matriculaService.getMatriculasSinEliminar().subscribe(
      data => {
        this.matriculas = data;
      },
      error => {
        console.error('Error al obtener las matrículas:', error);
      }
    );
  }

  getPersonas(): void {
    this.personaService.getPersonas().subscribe(
      data => {
        this.personas = data;
      },
      error => {
        console.error('Error al obtener las personas:', error);
      }
    );
  }

  getFichas(): void {
    this.fichaService.getFichas().subscribe(
      data => {
        this.fichas = data;
      },
      error => {
        console.error('Error al obtener las fichas:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.matriculaForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const matricula: Matricula = this.matriculaForm.value;

    if (this.isEditing) {
      this.updateMatricula(matricula);
    } else {
      this.createMatricula(matricula);
    }
  }

  createMatricula(matricula: Matricula): void {
    matricula.createdAt = new Date().toISOString();
    matricula.updatedAt = new Date().toISOString();

    this.matriculaService.createMatricula(matricula).subscribe(
      response => {
        Swal.fire('Éxito', 'Matrícula creada con éxito.', 'success');
        this.getMatriculas();
        this.resetForm();
      },
      error => {
        console.error('Error al crear la matrícula:', error);
        Swal.fire('Error', 'Error al crear la matrícula.', 'error');
      }
    );
  }

  updateMatricula(matricula: Matricula): void {
    const updatedMatricula: Matricula = {
      ...matricula,
      updatedAt: new Date().toISOString()
    };

    this.matriculaService.updateMatricula(updatedMatricula).subscribe(
      response => {
        Swal.fire('Éxito', 'Matrícula actualizada con éxito.', 'success');
        this.getMatriculas();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar la matrícula:', error);
        Swal.fire('Error', 'Error al actualizar la matrícula.', 'error');
      }
    );
  }

  resetForm(): void {
    this.matriculaForm.reset({
      id: 0,
      estadoProceso: '',
      personaId: { id: null },
      fichaId: { id: null },
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: Matricula): void {
    this.isEditing = true;
    this.matriculaForm.patchValue({
      id: item.id,
      estadoProceso: item.estadoProceso,
      personaId: item.personaId,
      fichaId: item.fichaId,
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
        this.matriculaService.deleteMatricula(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'La matrícula ha sido eliminada.', 'success');
            this.getMatriculas();
          },
          error => {
            console.error('Error al eliminar la matrícula:', error);
            Swal.fire('Error', 'Error al eliminar la matrícula.', 'error');
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

    this.matriculaService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getMatriculas();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
