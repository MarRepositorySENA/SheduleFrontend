import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartamentoService } from '../../../../Services/Parameter/Ubicacion/departamento.service';
import { PaisService } from '../../../../Services/Parameter/Ubicacion/pais.service'; // Servicio de País
import Swal from 'sweetalert2';
import { Departamento } from '../../../../models/M-Parameter/Ubicacion/departamento';
import { Pais } from '../../../../models/M-Parameter/Ubicacion/pais'; // Modelo de País

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.css']
})
export class DepartamentoComponent implements OnInit {
  departamentos: Departamento[] = [];
  paises: Pais[] = []; // Relación foránea con País
  departamentoForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;
  headers = [
    { title: 'Nombre', field: 'nombre' },
    { title: 'Código', field: 'codigo' },
    { title: 'País', field: 'paisId.nombre' }, // Mostrar el nombre del país
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private departamentoService: DepartamentoService,
    private paisService: PaisService
  ) {}

  ngOnInit(): void {
    this.getDepartamentos();
    this.getPaises(); // Cargar los países
    this.initializeForm();
  }

  initializeForm(): void {
    this.departamentoForm = this.fb.group({
      id: [0],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      codigo: ['', Validators.required],
      paisId: [null, Validators.required], // Llave foránea con País
      state: [true, Validators.required],
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
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const departamento: Departamento = this.departamentoForm.value;

    if (this.isEditing) {
      this.updateDepartamento(departamento);
    } else {
      this.createDepartamento(departamento);
    }
  }

  createDepartamento(departamento: Departamento): void {
    departamento.createdAt = new Date().toISOString();
    departamento.updatedAt = new Date().toISOString();

    this.departamentoService.createDepartamento(departamento).subscribe(
      response => {
        Swal.fire('Éxito', 'Departamento creado con éxito.', 'success');
        this.getDepartamentos();
        this.resetForm();
      },
      error => {
        console.error('Error al crear el departamento:', error);
        Swal.fire('Error', 'Error al crear el departamento.', 'error');
      }
    );
  }

  updateDepartamento(departamento: Departamento): void {
    const updatedDepartamento: Departamento = {
      ...departamento,
      updatedAt: new Date().toISOString()
    };

    this.departamentoService.updateDepartamento(updatedDepartamento).subscribe(
      response => {
        Swal.fire('Éxito', 'Departamento actualizado con éxito.', 'success');
        this.getDepartamentos();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar el departamento:', error);
        Swal.fire('Error', 'Error al actualizar el departamento.', 'error');
      }
    );
  }

  resetForm(): void {
    this.departamentoForm.reset({
      id: 0,
      nombre: '',
      codigo: '',
      paisId: null,
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: Departamento): void {
    this.isEditing = true;
    this.departamentoForm.patchValue({
      id: item.id,
      nombre: item.nombre,
      codigo: item.codigo,
      paisId: item.paisId.id, // Relación con país por ID
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
        this.departamentoService.deleteDepartamento(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'El departamento ha sido eliminado.', 'success');
            this.getDepartamentos();
          },
          error => {
            console.error('Error al eliminar el departamento:', error);
            Swal.fire('Error', 'Error al eliminar el departamento.', 'error');
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

    this.departamentoService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getDepartamentos();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
