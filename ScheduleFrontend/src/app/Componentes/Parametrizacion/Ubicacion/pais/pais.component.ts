import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisService } from '../../../../Services/Parameter/Ubicacion/pais.service';
import { ContinenteService } from '../../../../Services/Parameter/Ubicacion/continente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pais',
  templateUrl: './pais.component.html',
  styleUrls: ['./pais.component.css']
})
export class PaisComponent implements OnInit {
  paises: any[] = [];
  continentes: any[] = []; // Lista de continentes para el dropdown
  paisForm!: FormGroup;
  selectedFile!: File;  // Archivo seleccionado para la carga masiva
  isEditing: boolean = false;
  headers = [
    { title: 'Nombre', field: 'nombre' },
    { title: 'Código', field: 'codigo' },
    { title: 'Continente', field: 'continenteId.nombre' },  // Mostramos el nombre del continente
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private paisService: PaisService,
    private continenteService: ContinenteService
  ) {}

  ngOnInit(): void {
    this.getPaises();
    this.getContinentes();
    this.initializeForm();
  }

  initializeForm(): void {
    this.paisForm = this.fb.group({
      id: [0],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      codigo: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9]{3,}$')]], // Patrones más flexibles
      continenteId: [null, [Validators.required]],  // Campo obligatorio
      state: [true],  // Estado por defecto es true al crear
      createdAt: [''],
      updatedAt: ['']
    });
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
    // Verificar si el formulario es válido
    if (this.paisForm.invalid) {
      Swal.fire('Error', 'Por favor, complete todos los campos obligatorios correctamente.', 'error');
      return;
    }
  
    const pais = this.paisForm.value;
  
    // Verificar si es una edición o una creación
    if (this.isEditing) {
      this.updatePais(pais);
    } else {
      this.createPais(pais);
    }
  }

  createPais(pais: any): void {
    this.paisService.createPais(pais).subscribe(
      response => {
        Swal.fire('Éxito', 'País creado con éxito.', 'success');
        this.getPaises();
        this.resetForm();
      },
      error => {
        Swal.fire('Error', 'Error al crear el país.', 'error');
      }
    );
  }

  updatePais(pais: any): void {
    this.paisService.updatePais(pais).subscribe(
      response => {
        Swal.fire('Éxito', 'País actualizado con éxito.', 'success');
        this.getPaises();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        Swal.fire('Error', 'Error al actualizar el país.', 'error');
      }
    );
  }

  resetForm(): void {
    this.paisForm.reset({
      id: 0,
      nombre: '',
      codigo: '',
      continenteId: null,  // Reseteamos el valor del dropdown
      state: true  // Estado por defecto es true al crear
    });
    this.isEditing = false;
  }

  onEdit(item: any): void {
    this.isEditing = true;
  
    // Verificar si ya se cargaron los continentes
    if (this.continentes.length === 0) {
      // Si los continentes no están cargados, cargarlos antes de editar
      this.getContinentes();
    }
  
    // Llenar el formulario con los datos del país seleccionado
    this.paisForm.patchValue({
      id: item.id,
      nombre: item.nombre,
      codigo: item.codigo,
      continenteId: item.continenteId.id,  // Asignar solo el ID del continente
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
        this.paisService.deletePais(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'El país ha sido eliminado.', 'success');
            this.getPaises();  // Refresca la tabla
          },
          error => {
            Swal.fire('Error', 'Error al eliminar el país.', 'error');
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

    this.paisService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito', 'success');
        this.getPaises();  // Refrescar los datos después de la carga
      },
      error => {
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva', 'error');
      }
    );
  }
}
