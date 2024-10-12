import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisService } from '../../../../Services/Parameter/Ubicacion/pais.service';
import { ContinenteService } from '../../../../Services/Parameter/Ubicacion/continente.service';
import Swal from 'sweetalert2';
import { Pais } from '../../../../models/M-Parameter/Ubicacion/pais';
import { Continente } from '../../../../models/M-Parameter/Ubicacion/continente';

@Component({
  selector: 'app-pais',
  templateUrl: './pais.component.html',
  styleUrls: ['./pais.component.css']
})
export class PaisComponent implements OnInit {
  paises: Pais[] = [];
  continentes: Continente[] = []; // Relación foránea con Continente
  paisForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;
  headers = [
    { title: 'Nombre', field: 'nombre' },
    { title: 'Código', field: 'codigo' },
    { title: 'Continente', field: 'continenteId.nombre' }, // Mostrar el nombre del continente
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private paisService: PaisService,
    private continenteService: ContinenteService
  ) {}

  ngOnInit(): void {
    this.getPaises();
    this.getContinentes(); // Cargar los continentes
    this.initializeForm();
  }

  initializeForm(): void {
    this.paisForm = this.fb.group({
      id: [0],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      codigo: ['', Validators.required],
      continenteId: [null, Validators.required], // Llave foránea con Continente
      state: [true, Validators.required],
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
    if (this.paisForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const pais: Pais = this.paisForm.value;

    if (this.isEditing) {
      this.updatePais(pais);
    } else {
      this.createPais(pais);
    }
  }

  createPais(pais: Pais): void {
    pais.createdAt = new Date().toISOString();
    pais.updatedAt = new Date().toISOString();

    this.paisService.createPais(pais).subscribe(
      response => {
        Swal.fire('Éxito', 'País creado con éxito.', 'success');
        this.getPaises();
        this.resetForm();
      },
      error => {
        console.error('Error al crear el país:', error);
        Swal.fire('Error', 'Error al crear el país.', 'error');
      }
    );
  }

  updatePais(pais: Pais): void {
    const updatedPais: Pais = {
      ...pais,
      updatedAt: new Date().toISOString()
    };

    this.paisService.updatePais(updatedPais).subscribe(
      response => {
        Swal.fire('Éxito', 'País actualizado con éxito.', 'success');
        this.getPaises();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar el país:', error);
        Swal.fire('Error', 'Error al actualizar el país.', 'error');
      }
    );
  }

  resetForm(): void {
    this.paisForm.reset({
      id: 0,
      nombre: '',
      codigo: '',
      continenteId: null,
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: Pais): void {
    this.isEditing = true;
    this.paisForm.patchValue({
      id: item.id,
      nombre: item.nombre,
      codigo: item.codigo,
      continenteId: item.continenteId.id, // Relación con continente por ID
      state: item.state,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  onDelete(id: number): void {
    // Verificar dependencias antes de eliminar el país
    this.paisService.getPaises().subscribe(
      response => {
        const paisRelacionado = response.some(p => p.id === id);
        if (paisRelacionado) {
          Swal.fire('Error', 'No se puede eliminar el país porque tiene dependencias.', 'error');
          return;
        }
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
                this.getPaises();
              },
              error => {
                console.error('Error al eliminar el país:', error);
                Swal.fire('Error', 'Error al eliminar el país.', 'error');
              }
            );
          }
        });
      },
      error => {
        console.error('Error al verificar dependencias del país:', error);
      }
    );
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadExcel(): void {
    if (!this.selectedFile) {
      Swal.fire('Error', 'Por favor seleccione un archivo Excel.', 'error');
      return;
    }

    this.paisService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getPaises();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
