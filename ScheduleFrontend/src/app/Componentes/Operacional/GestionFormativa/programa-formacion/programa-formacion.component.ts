import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { ProgramaFormacion } from '../../../../models/M-Operacional/GestionFormativa/programa-formacion';
import { Modalidad } from '../../../../models/M-Operacional/GestionFormativa/modalidad';
import { NivelFormacion } from '../../../../models/M-Operacional/GestionFormativa/nivel-formacion';
import { TipoFormacion } from '../../../../models/M-Operacional/GestionFormativa/tipo-formacion';
import { ProgramaFormacionService } from '../../../../Services/S-Operacional/GestionFormativa/ProgramaFormacion.service';
import { ModalidadService } from '../../../../Services/S-Operacional/GestionFormativa/modalidad.service';
import { NivelFormacionService } from '../../../../Services/S-Operacional/GestionFormativa/NivelFormacion.service';
import { TipoFormacionService } from '../../../../Services/S-Operacional/GestionFormativa/TipoFormacion.service';

@Component({
  selector: 'app-programa-formacion',
  templateUrl: './programa-formacion.component.html',
  styleUrls: ['./programa-formacion.component.css']
})
export class ProgramaFormacionComponent implements OnInit {
  programasFormacion: ProgramaFormacion[] = [];
  modalidades: Modalidad[] = [];
  nivelesFormacion: NivelFormacion[] = [];
  tiposFormacion: TipoFormacion[] = [];
  programaFormacionForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;

  headers = [
    { title: 'Nombre', field: 'nombre' },
    { title: 'Descripción', field: 'descripcion' },
    { title: 'Duración (horas)', field: 'duraccion' },
    { title: 'Modalidad', field: 'modalidadId.nombre' },
    { title: 'Nivel de Formación', field: 'nivelFormacionId.nombre' },
    { title: 'Tipo de Formación', field: 'tipoFormacionId.nombre' },
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private programaFormacionService: ProgramaFormacionService,
    private modalidadService: ModalidadService,
    private nivelFormacionService: NivelFormacionService,
    private tipoFormacionService: TipoFormacionService
  ) {}

  ngOnInit(): void {
    this.getProgramasFormacion();
    this.getModalidades();
    this.getNivelesFormacion();
    this.getTiposFormacion();
    this.initializeForm();
  }

  initializeForm(): void {
    this.programaFormacionForm = this.fb.group({
      id: [0],
      nombre: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      duraccion: [0, [Validators.required, Validators.min(1)]],
      modalidadId: [0, Validators.required],
      nivelFormacionId:  [0, Validators.required],
      tipoFormacionId: [0, Validators.required],
      state: [true] // Puedes inicializarlo como desees
    });
  }

  getProgramasFormacion(): void {
    this.programaFormacionService.getProgramasFormacionSinEliminar().subscribe(
      data => {
        this.programasFormacion = data;
      },
      error => {
        console.error('Error al obtener los programas de formación:', error);
      }
    );
  }

  getModalidades(): void {
    this.modalidadService.getModalidades().subscribe(
      data => {
        this.modalidades = data;
      },
      error => {
        console.error('Error al obtener las modalidades:', error);
      }
    );
  }

  getNivelesFormacion(): void {
    this.nivelFormacionService.getNivelesFormacion().subscribe(
      data => {
        this.nivelesFormacion = data;
      },
      error => {
        console.error('Error al obtener los niveles de formación:', error);
      }
    );
  }

  getTiposFormacion(): void {
    this.tipoFormacionService.getTiposFormacion().subscribe(
      data => {
        this.tiposFormacion = data;
      },
      error => {
        console.error('Error al obtener los tipos de formación:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.programaFormacionForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const formValue = this.programaFormacionForm.value;

    const programaFormacion: ProgramaFormacion = {
      nombre: formValue.nombre,
      descripcion: formValue.descripcion,
      duraccion: formValue.duraccion,
      modalidadId: { id: formValue.modalidadId }, // Aquí es donde construyes el objeto
      nivelFormacionId: { id: formValue.nivelFormacionId }, // Aquí lo haces también
      tipoFormacionId: { id: formValue.tipoFormacionId }, // Aquí lo haces también
      state: formValue.state // Puedes establecer el estado desde el formulario
    };

    console.log('Programa de formación enviado:', programaFormacion);

    if (this.isEditing) {
      this.updateProgramaFormacion(programaFormacion);
    } else {
      this.createProgramaFormacion(programaFormacion);
    }
  }

  createProgramaFormacion(programaFormacion: ProgramaFormacion): void {
    programaFormacion.createdAt = new Date().toISOString();
    programaFormacion.updatedAt = new Date().toISOString();

    this.programaFormacionService.createProgramaFormacion(programaFormacion).subscribe(
      response => {
        Swal.fire('Éxito', 'Programa de formación creado con éxito.', 'success');
        this.getProgramasFormacion();
        this.resetForm();
      },
      error => {
        console.error('Error al crear el programa de formación:', error);
        Swal.fire('Error', 'Error al crear el programa de formación.', 'error');
      }
    );
  }

  updateProgramaFormacion(programaFormacion: ProgramaFormacion): void {
    const updatedProgramaFormacion: ProgramaFormacion = {
      ...programaFormacion,
      updatedAt: new Date().toISOString()
    };

    this.programaFormacionService.updateProgramaFormacion(updatedProgramaFormacion).subscribe(
      response => {
        Swal.fire('Éxito', 'Programa de formación actualizado con éxito.', 'success');
        this.getProgramasFormacion();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar el programa de formación:', error);
        Swal.fire('Error', 'Error al actualizar el programa de formación.', 'error');
      }
    );
  }

  resetForm(): void {
    this.programaFormacionForm.reset({
      id: 0,
      nombre: '',
      descripcion: '',
      duraccion: 0,
      modalidadId: null,
      nivelFormacionId: null,
      tipoFormacionId: null,
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: ProgramaFormacion): void {
    this.isEditing = true;
    this.programaFormacionForm.patchValue({
      id: item.id,
      nombre: item.nombre,
      descripcion: item.descripcion,
      duraccion: item.duraccion,
      modalidadId: { id: item.modalidadId.id }, // Verifica que item.modalidadId.id tenga un valor válido
      nivelFormacionId: { id: item.nivelFormacionId.id }, // Verifica que item.nivelFormacionId.id tenga un valor válido
      tipoFormacionId: { id: item.tipoFormacionId.id }, // Verifica que item.tipoFormacionId.id tenga un valor válido
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
        this.programaFormacionService.deleteProgramaFormacion(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'El programa de formación ha sido eliminado.', 'success');
            this.getProgramasFormacion();
          },
          error => {
            console.error('Error al eliminar el programa de formación:', error);
            Swal.fire('Error', 'Error al eliminar el programa de formación.', 'error');
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

    this.programaFormacionService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getProgramasFormacion();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
