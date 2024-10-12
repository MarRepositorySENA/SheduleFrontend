import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  originalFormValues: any;  // Para guardar los valores originales y detectar cambios
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
      id: [0], // Sin validadores
      nombre: [''],  // Sin validadores
      codigo: [''],  // Sin validadores
      state: [true],  // Sin validadores
      createdAt: [''],  // Sin validadores
      updatedAt: ['']   // Sin validadores
    });

    // Guardar los valores originales después de inicializar el formulario
    this.originalFormValues = this.continenteForm.getRawValue();
  }

  getContinentes(): void {
    this.continenteService.getContinentesSinEliminar().subscribe(
      data => {
        this.continentes = data;
        console.log('Continentes obtenidos del servidor:', this.continentes);
      },
      error => {
        console.error('Error al obtener los continentes:', error);
      }
    );
  }
  
  onSubmit(): void {
    // Log para ver el estado del formulario y los valores ingresados
    console.log('Formulario enviado:', this.continenteForm.value);
    
    const continente = this.continenteForm.value;
    console.log('Datos a enviar (continente):', continente);
  
    // Si estamos editando, actualizamos; de lo contrario, creamos un nuevo registro
    if (this.isEditing) {
      console.log('Actualizando continente:', continente);
      this.updateContinente(continente);
    } else {
      console.log('Creando nuevo continente:', continente);
      this.createContinente(continente);
    }
  }
  

  createContinente(continente: any): void {
    this.continenteService.createContinente(continente).subscribe(
      response => {
        Swal.fire('Éxito', 'Continente creado con éxito.', 'success');
        this.getContinentes();
        this.resetForm();
      },
      error => {
        console.log('Error al crear el continente:', error);
        Swal.fire('Error', 'Error al crear el continente.', 'error');
      }
    );
  }

  updateContinente(continente: any): void {
    console.log('Iniciando actualización del continente:', continente);
    this.continenteService.updateContinente(continente).subscribe(
      response => {
        console.log('Respuesta del servidor al actualizar continente:', response);
        Swal.fire('Éxito', 'Continente actualizado con éxito.', 'success');
        this.getContinentes();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.log('Error al actualizar el continente:', error);
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
    console.log('Formulario reiniciado:', this.continenteForm.value);
  }
  

  onEdit(item: any): void {
    this.isEditing = true;
    console.log('Datos del continente seleccionados para edición:', item);
  
    this.continenteForm.patchValue({
      id: item.id,
      nombre: item.nombre,
      codigo: item.codigo,
      state: item.state,
      createdAt: item.createdAt ? item.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  
    console.log('Formulario después de cargar los datos para edición:', this.continenteForm.value);
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
            console.log('Error al eliminar el continente:', error);
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
        console.log('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva', 'error');
      }
    );
  }
}
