import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Convocatoria } from '../../../../models/M-Operacional/GestionHorario/convocatoria';
import { ConvocatoriaService } from '../../../../Services/S-Operacional/GestionHorario/convocatoria.service';

@Component({
  selector: 'app-convocatoria',
  templateUrl: './convocatoria.component.html',
  styleUrls: ['./convocatoria.component.css']
})
export class ConvocatoriaComponent implements OnInit {
  convocatorias: Convocatoria[] = [];
  convocatoriaForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;

  headers = [
    { title: 'Código', field: 'codigo' },
    { title: 'Año', field: 'anio.value' },
    { title: 'Trimestre', field: 'trimestre' },
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private convocatoriaService: ConvocatoriaService
  ) {}

  ngOnInit(): void {
    this.getConvocatorias();
    this.initializeForm();
  }

  initializeForm(): void {
    this.convocatoriaForm = this.fb.group({
      id: [0],
      codigo: ['', Validators.required],
      anio:  ['', Validators.required],
      trimestre: ['', Validators.required],
      state: [true, Validators.required]
    });
  }

  getConvocatorias(): void {
    this.convocatoriaService.getConvocatoriasSinEliminar().subscribe(
      data => {
        this.convocatorias = data;
      },
      error => {
        console.error('Error al obtener las convocatorias:', error);
      }
    );
  }

  onSubmit(): void {
    // Verifica si el formulario es válido
    if (this.convocatoriaForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    // Obtén los valores del formulario
    const formValue = this.convocatoriaForm.value;

    // Construye el objeto 'Convocatoria'
    const convocatoria: Convocatoria = {
      id:formValue.id ,
      codigo: formValue.codigo,
      anio: formValue.anio,
      trimestre: formValue.trimestre,
      state: formValue.state,
      createdAt: formValue.createdAt,
      updatedAt: formValue.updatedAt,
      deletedAt: formValue.deletedAt

    };

    // Aquí puedes manejar si estás creando o editando
    if (this.isEditing) {
      this.updateConvocatoria(convocatoria);
    } else {
      this.createConvocatoria(convocatoria);
    }
  }


  createConvocatoria(convocatoria: Convocatoria): void {
    convocatoria.createdAt = new Date().toISOString();
    convocatoria.updatedAt = new Date().toISOString();

    this.convocatoriaService.createConvocatoria(convocatoria).subscribe(
      response => {
        Swal.fire('Éxito', 'Convocatoria creada con éxito.', 'success');
        this.getConvocatorias();
        this.resetForm();
      },
      error => {
        console.error('Error al crear la convocatoria:', error);
        Swal.fire('Error', 'Error al crear la convocatoria.', 'error');
      }
    );
  }

  updateConvocatoria(convocatoria: Convocatoria): void {
    const updatedConvocatoria: Convocatoria = {
      ...convocatoria,
      updatedAt: new Date().toISOString()
    };

    this.convocatoriaService.updateConvocatoria(updatedConvocatoria).subscribe(
      response => {
        Swal.fire('Éxito', 'Convocatoria actualizada con éxito.', 'success');
        this.getConvocatorias();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar la convocatoria:', error);
        Swal.fire('Error', 'Error al actualizar la convocatoria.', 'error');
      }
    );
  }

  resetForm(): void {
    this.convocatoriaForm.reset({
      id: 0,
      codigo: '',
      anio: { value: null, leap: false },
      trimestre: '',
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: Convocatoria): void {
    this.isEditing = true;
    this.convocatoriaForm.patchValue({
      id: item.id,
      codigo: item.codigo,
      anio: item.anio,
      trimestre: item.trimestre,
      state: item.state
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
        this.convocatoriaService.deleteConvocatoria(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'La convocatoria ha sido eliminada.', 'success');
            this.getConvocatorias();
          },
          error => {
            console.error('Error al eliminar la convocatoria:', error);
            Swal.fire('Error', 'Error al eliminar la convocatoria.', 'error');
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

    this.convocatoriaService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getConvocatorias();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
