import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { TipoContrato } from '../../../../models/M-Operacional/GestionPersonal/tipo-contrato';
import { TipoContratoService } from '../../../../Services/S-Operacional/GestionPersonal/TipoContrato.service';

@Component({
  selector: 'app-tipo-contrato',
  templateUrl: './tipo-contrato.component.html',
  styleUrls: ['./tipo-contrato.component.css']
})
export class TipoContratoComponent implements OnInit {
  tiposContrato: TipoContrato[] = [];
  tipoContratoForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;

  headers = [
    { title: 'Código', field: 'codigo' },
    { title: 'Nombre', field: 'nombre' },
    { title: 'Cantidad de Horas', field: 'cantidadHora' },
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private tipoContratoService: TipoContratoService
  ) {}

  ngOnInit(): void {
    this.getTiposContrato();
    this.initializeForm();
  }

  initializeForm(): void {
    this.tipoContratoForm = this.fb.group({
      id: [0],
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      cantidadHora: [0, [Validators.required, Validators.min(1)]],
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getTiposContrato(): void {
    this.tipoContratoService.getTipoContratosSinEliminar().subscribe(
      data => {
        this.tiposContrato = data;
      },
      error => {
        console.error('Error al obtener los tipos de contrato:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.tipoContratoForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const tipoContrato: TipoContrato = this.tipoContratoForm.value;

    if (this.isEditing) {
      this.updateTipoContrato(tipoContrato);
    } else {
      this.createTipoContrato(tipoContrato);
    }
  }

  createTipoContrato(tipoContrato: TipoContrato): void {
    tipoContrato.createdAt = new Date().toISOString();
    tipoContrato.updatedAt = new Date().toISOString();

    this.tipoContratoService.createTipoContrato(tipoContrato).subscribe(
      response => {
        Swal.fire('Éxito', 'Tipo de contrato creado con éxito.', 'success');
        this.getTiposContrato();
        this.resetForm();
      },
      error => {
        console.error('Error al crear el tipo de contrato:', error);
        Swal.fire('Error', 'Error al crear el tipo de contrato.', 'error');
      }
    );
  }

  updateTipoContrato(tipoContrato: TipoContrato): void {
    const updatedTipoContrato: TipoContrato = {
      ...tipoContrato,
      updatedAt: new Date().toISOString()
    };

    this.tipoContratoService.updateTipoContrato(updatedTipoContrato).subscribe(
      response => {
        Swal.fire('Éxito', 'Tipo de contrato actualizado con éxito.', 'success');
        this.getTiposContrato();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar el tipo de contrato:', error);
        Swal.fire('Error', 'Error al actualizar el tipo de contrato.', 'error');
      }
    );
  }

  resetForm(): void {
    this.tipoContratoForm.reset({
      id: 0,
      codigo: '',
      nombre: '',
      cantidadHora: 0,
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: TipoContrato): void {
    this.isEditing = true;
    this.tipoContratoForm.patchValue({
      id: item.id,
      codigo: item.codigo,
      nombre: item.nombre,
      cantidadHora: item.cantidadHora,
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
        this.tipoContratoService.deleteTipoContrato(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'El tipo de contrato ha sido eliminado.', 'success');
            this.getTiposContrato();
          },
          error => {
            console.error('Error al eliminar el tipo de contrato:', error);
            Swal.fire('Error', 'Error al eliminar el tipo de contrato.', 'error');
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

    this.tipoContratoService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getTiposContrato();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
