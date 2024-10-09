import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContinenteService } from '../../../../Services/Parameter/Ubicacion/continente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-continente',
  templateUrl: './continente.component.html',
  styleUrls: ['./continente.component.css']
})
export class ContinenteComponent implements OnInit {
  continentes: any[] = [];
  continenteForm!: FormGroup;
  selectedFile!: File;  // Archivo seleccionado para la carga masiva
  isEditing: boolean = false;
  headers = [
    { title: 'Nombre', field: 'nombre' },
    { title: 'Código', field: 'codigo' },
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private continenteService: ContinenteService
  ) {}

  ngOnInit(): void {
    this.getContinentes();
    this.initializeForm();
  }

  initializeForm(): void {
    this.continenteForm = this.fb.group({
      id: [0],  // Asegurarnos de que la ID esté presente, 0 para nuevos registros
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      codigo: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9]{3,}$')]],
      state: [true],  // Estado por defecto al crear
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getContinentes(): void {
    this.continenteService.getContinentesSinEliminar().subscribe(
      data => {
        this.continentes = data;
      },
      error => {
        console.error('Error al obtener los continentes:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.continenteForm.invalid) {
      Swal.fire('Error', 'Por favor, complete todos los campos obligatorios correctamente.', 'error');
      return;
    }

    const continente = this.continenteForm.value;

    if (this.isEditing) {
      this.updateContinente(continente);
    } else {
      this.createContinente(continente);
    }
  }

  createContinente(continente: any): void {
    continente.state = true;  // Estado por defecto es true
    this.continenteService.createContinente(continente).subscribe(
      response => {
        Swal.fire('Éxito', 'Continente creado con éxito.', 'success');
        this.getContinentes();
        this.resetForm();
      },
      error => {
        Swal.fire('Error', 'Error al crear el continente.', 'error');
      }
    );
  }

  updateContinente(continente: any): void {
    this.continenteService.updateContinente(continente).subscribe(
      response => {
        Swal.fire('Éxito', 'Continente actualizado con éxito.', 'success');
        this.getContinentes();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        Swal.fire('Error', 'Error al actualizar el continente.', 'error');
      }
    );
  }

  resetForm(): void {
    this.continenteForm.reset({
      id: 0,
      nombre: '',
      codigo: '',
      state: true  // Estado por defecto es true al crear
    });
    this.isEditing = false;
  }

  onEdit(item: any): void {
    this.isEditing = true;
    // Si el campo createdAt es nulo, no lo incluimos en el formulario
    this.continenteForm.patchValue({
      id: item.id,
      nombre: item.nombre,
      codigo: item.codigo,
      state: item.state,
      createdAt: item.createdAt ? item.createdAt : undefined, // No pasar `null`
      updatedAt: item.updatedAt
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
        this.continenteService.deleteContinente(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'El continente ha sido eliminado.', 'success');
            this.getContinentes();  // Refresca la tabla
          },
          error => {
            Swal.fire('Error', 'Error al eliminar el continente.', 'error');
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

    this.continenteService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito', 'success');
        this.getContinentes();  // Refrescar los datos después de la carga
      },
      error => {
        // Mostrar el mensaje de error devuelto por el backend
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva', 'error');
      }
    );
  }
}
