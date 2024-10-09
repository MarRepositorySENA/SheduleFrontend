import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartamentoService } from '../../../../Services/Parameter/Ubicacion/departamento.service';
import { PaisService } from '../../../../Services/Parameter/Ubicacion/pais.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.css']
})
export class DepartamentoComponent implements OnInit {
  departamentos: any[] = [];
  paises: any[] = []; // Lista de países para el dropdown
  departamentoForm!: FormGroup;
  selectedFile!: File;  // Archivo seleccionado para la carga masiva
  isEditing: boolean = false;
  headers = [
    { title: 'Nombre', field: 'nombre' },
    { title: 'Código', field: 'codigo' },
    { title: 'País', field: 'paisId.nombre' },  // Mostramos el nombre del país
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private departamentoService: DepartamentoService,
    private paisService: PaisService
  ) {}

  ngOnInit(): void {
    this.getDepartamentos();
    this.getPaises();
    this.initializeForm();
  }

  initializeForm(): void {
    this.departamentoForm = this.fb.group({
      id: [0],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      codigo: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9]{3,}$')]], // Patrones más flexibles
      paisId: [null, [Validators.required]],  // Campo obligatorio
      state: [true],  // Estado por defecto es true al crear
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getDepartamentos(): void {
    this.departamentoService.getDepartamentosSinEliminar().subscribe(
      data => {
        this.departamentos = data;
      },
      error => {
        console.error('Error al obtener los departamentos:', error);
      }
    );
  }

  getPaises(): void {
    this.paisService.getPaisesSinEliminar().subscribe(
      data => {
        this.paises = data;
      },
      error => {
        console.error('Error al obtener los países:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.departamentoForm.invalid) {
      Swal.fire('Error', 'Por favor, complete todos los campos obligatorios correctamente.', 'error');
      return;
    }

    const departamento = this.departamentoForm.value;

    if (this.isEditing) {
      this.updateDepartamento(departamento);
    } else {
      this.createDepartamento(departamento);
    }
  }

  createDepartamento(departamento: any): void {
    this.departamentoService.createDepartamento(departamento).subscribe(
      response => {
        Swal.fire('Éxito', 'Departamento creado con éxito.', 'success');
        this.getDepartamentos();
        this.resetForm();
      },
      error => {
        Swal.fire('Error', 'Error al crear el departamento.', 'error');
      }
    );
  }

  updateDepartamento(departamento: any): void {
    this.departamentoService.updateDepartamento(departamento).subscribe(
      response => {
        Swal.fire('Éxito', 'Departamento actualizado con éxito.', 'success');
        this.getDepartamentos();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        Swal.fire('Error', 'Error al actualizar el departamento.', 'error');
      }
    );
  }

  resetForm(): void {
    this.departamentoForm.reset({
      id: 0,
      nombre: '',
      codigo: '',
      paisId: null,  // Reseteamos el valor del dropdown
      state: true  // Estado por defecto es true al crear
    });
    this.isEditing = false;
  }

  onEdit(item: any): void {
    this.isEditing = true;
    this.departamentoForm.patchValue({
      id: item.id,
      nombre: item.nombre,
      codigo: item.codigo,
      paisId: item.paisId.id,  // Asignar el ID del país, no el objeto completo
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
        this.departamentoService.deleteDepartamento(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'El departamento ha sido eliminado.', 'success');
            this.getDepartamentos();  // Refresca la tabla
          },
          error => {
            Swal.fire('Error', 'Error al eliminar el departamento.', 'error');
          }
        );
      }
    });
  }

  // Carga masiva: Al seleccionar el archivo
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  // Carga masiva: Sube el archivo Excel
  uploadExcel(): void {
    if (!this.selectedFile) {
      Swal.fire('Error', 'Por favor seleccione un archivo Excel', 'error');
      return;
    }

    this.departamentoService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito', 'success');
        this.getDepartamentos();  // Refrescar los datos después de la carga
      },
      error => {
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva', 'error');
      }
    );
  }
}
