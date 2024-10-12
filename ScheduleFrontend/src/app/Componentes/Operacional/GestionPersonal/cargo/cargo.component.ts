import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Cargo } from '../../../../models/M-Operacional/GestionPersonal/cargo';
import { CargoService } from '../../../../Services/S-Operacional/GestionPersonal/cargo.service';

@Component({
  selector: 'app-cargo',
  templateUrl: './cargo.component.html',
  styleUrls: ['./cargo.component.css']
})
export class CargoComponent implements OnInit {
  cargos: Cargo[] = [];
  cargoForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;

  headers = [
    { title: 'Código', field: 'codigo' },
    { title: 'Nombre', field: 'nombre' },
    { title: 'Descripción', field: 'descripcion' },
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private cargoService: CargoService
  ) {}

  ngOnInit(): void {
    this.getCargos();
    this.initializeForm();
  }

  initializeForm(): void {
    this.cargoForm = this.fb.group({
      id: [0],
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getCargos(): void {
    this.cargoService.getCargosSinEliminar().subscribe(
      data => {
        this.cargos = data;
      },
      error => {
        console.error('Error al obtener los cargos:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.cargoForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const cargo: Cargo = this.cargoForm.value;

    if (this.isEditing) {
      this.updateCargo(cargo);
    } else {
      this.createCargo(cargo);
    }
  }

  createCargo(cargo: Cargo): void {
    cargo.createdAt = new Date().toISOString();
    cargo.updatedAt = new Date().toISOString();

    this.cargoService.createCargo(cargo).subscribe(
      response => {
        Swal.fire('Éxito', 'Cargo creado con éxito.', 'success');
        this.getCargos();
        this.resetForm();
      },
      error => {
        console.error('Error al crear el cargo:', error);
        Swal.fire('Error', 'Error al crear el cargo.', 'error');
      }
    );
  }

  updateCargo(cargo: Cargo): void {
    const updatedCargo: Cargo = {
      ...cargo,
      updatedAt: new Date().toISOString()
    };

    this.cargoService.updateCargo(updatedCargo).subscribe(
      response => {
        Swal.fire('Éxito', 'Cargo actualizado con éxito.', 'success');
        this.getCargos();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar el cargo:', error);
        Swal.fire('Error', 'Error al actualizar el cargo.', 'error');
      }
    );
  }

  resetForm(): void {
    this.cargoForm.reset({
      id: 0,
      codigo: '',
      nombre: '',
      descripcion: '',
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: Cargo): void {
    this.isEditing = true;
    this.cargoForm.patchValue({
      id: item.id,
      codigo: item.codigo,
      nombre: item.nombre,
      descripcion: item.descripcion,
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
        this.cargoService.deleteCargo(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'El cargo ha sido eliminado.', 'success');
            this.getCargos();
          },
          error => {
            console.error('Error al eliminar el cargo:', error);
            Swal.fire('Error', 'Error al eliminar el cargo.', 'error');
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

    this.cargoService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getCargos();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
