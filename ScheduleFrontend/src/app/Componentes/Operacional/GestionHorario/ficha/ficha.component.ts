import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Ficha } from '../../../../models/M-Operacional/GestionHorario/ficha';
import { Jornada } from '../../../../models/M-Operacional/GestionHorario/jornada';
import { Convocatoria } from '../../../../models/M-Operacional/GestionHorario/convocatoria';
import { ProgramaFormacion } from '../../../../models/M-Operacional/GestionFormativa/programa-formacion';
import { FichaService } from '../../../../Services/S-Operacional/GestionHorario/ficha.service';
import { JornadaService } from '../../../../Services/S-Operacional/GestionHorario/jornada.service';
import { ConvocatoriaService } from '../../../../Services/S-Operacional/GestionHorario/convocatoria.service';
import { ProgramaFormacionService } from '../../../../Services/S-Operacional/GestionFormativa/ProgramaFormacion.service';

@Component({
  selector: 'app-ficha',
  templateUrl: './ficha.component.html',
  styleUrls: ['./ficha.component.css']
})
export class FichaComponent implements OnInit {
  fichas: Ficha[] = [];
  jornadas: Jornada[] = [];
  convocatorias: Convocatoria[] = [];
  programasFormacion: ProgramaFormacion[] = [];
  fichaForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;

  headers = [
    { title: 'Código', field: 'codigo' },
    { title: 'Fecha Inicio', field: 'fechaInicio' },
    { title: 'Fecha Fin', field: 'fechaFin' },
    { title: 'Cupo', field: 'cupo' },
    { title: 'Etapa', field: 'etapa' },
    { title: 'Jornada', field: 'jornadaId.nombre' },
    { title: 'Convocatoria', field: 'convocatoriaId.codigo' },
    { title: 'Programa de Formación', field: 'programaFormacionId.nombre' },
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private fichaService: FichaService,
    private jornadaService: JornadaService,
    private convocatoriaService: ConvocatoriaService,
    private programaFormacionService: ProgramaFormacionService
  ) {}

  ngOnInit(): void {
    this.getFichas();
    this.getJornadas();
    this.getConvocatorias();
    this.getProgramasFormacion();
    this.initializeForm();
  }

  initializeForm(): void {
    this.fichaForm = this.fb.group({
      id: [0],
      codigo: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      cupo: [0, [Validators.required, Validators.min(1)]],
      etapa: ['', Validators.required],
      jornadaId: this.fb.group({
        id: [null, Validators.required]
      }),
      convocatoriaId: this.fb.group({
        id: [null, Validators.required]
      }),
      programaFormacionId: this.fb.group({
        id: [null, Validators.required]
      }),
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
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

  getJornadas(): void {
    this.jornadaService.getJornadas().subscribe(
      data => {
        this.jornadas = data;
      },
      error => {
        console.error('Error al obtener las jornadas:', error);
      }
    );
  }

  getConvocatorias(): void {
    this.convocatoriaService.getConvocatorias().subscribe(
      data => {
        this.convocatorias = data;
      },
      error => {
        console.error('Error al obtener las convocatorias:', error);
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

  onSubmit(): void {
    if (this.fichaForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const ficha: Ficha = this.fichaForm.value;

    if (this.isEditing) {
      this.updateFicha(ficha);
    } else {
      this.createFicha(ficha);
    }
  }

  createFicha(ficha: Ficha): void {
    ficha.createdAt = new Date().toISOString();
    ficha.updatedAt = new Date().toISOString();

    this.fichaService.createFicha(ficha).subscribe(
      response => {
        Swal.fire('Éxito', 'Ficha creada con éxito.', 'success');
        this.getFichas();
        this.resetForm();
      },
      error => {
        console.error('Error al crear la ficha:', error);
        Swal.fire('Error', 'Error al crear la ficha.', 'error');
      }
    );
  }

  updateFicha(ficha: Ficha): void {
    const updatedFicha: Ficha = {
      ...ficha,
      updatedAt: new Date().toISOString()
    };

    this.fichaService.updateFicha(updatedFicha).subscribe(
      response => {
        Swal.fire('Éxito', 'Ficha actualizada con éxito.', 'success');
        this.getFichas();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar la ficha:', error);
        Swal.fire('Error', 'Error al actualizar la ficha.', 'error');
      }
    );
  }

  resetForm(): void {
    this.fichaForm.reset({
      id: 0,
      codigo: '',
      fechaInicio: '',
      fechaFin: '',
      cupo: 0,
      etapa: '',
      jornadaId: { id: null },
      convocatoriaId: { id: null },
      programaFormacionId: { id: null },
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: Ficha): void {
    this.isEditing = true;
    this.fichaForm.patchValue({
      id: item.id,
      codigo: item.codigo,
      fechaInicio: item.fechaInicio,
      fechaFin: item.fechaFin,
      cupo: item.cupo,
      etapa: item.etapa,
      jornadaId: item.jornadaId,
      convocatoriaId: item.convocatoriaId,
      programaFormacionId: item.programaFormacionId,
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
        this.fichaService.deleteFicha(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'La ficha ha sido eliminada.', 'success');
            this.getFichas();
          },
          error => {
            console.error('Error al eliminar la ficha:', error);
            Swal.fire('Error', 'Error al eliminar la ficha.', 'error');
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

    this.fichaService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getFichas();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
