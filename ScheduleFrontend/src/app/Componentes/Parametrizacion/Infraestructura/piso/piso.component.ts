import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PisoService } from '../../../../Services/Parameter/Infraestructura/piso.service';
import { SedeService } from '../../../../Services/Parameter/Infraestructura/sede.service'; // Servicio de Sede
import Swal from 'sweetalert2';
import { Piso } from '../../../../models/M-Parameter/infraestructura/piso';
import { Sede } from '../../../../models/M-Parameter/infraestructura/sede';


@Component({
  selector: 'app-piso',
  templateUrl: './piso.component.html',
  styleUrls: ['./piso.component.css']
})
export class PisoComponent implements OnInit {
  pisos: Piso[] = [];
  sedes: Sede[] = []; // Relación foránea con Sede
  pisoForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;
  headers = [
    { title: 'Código', field: 'codigo' },
    { title: 'Nombre', field: 'nombre' },
    { title: 'Sede', field: 'sedeId.nombre' }, // Mostrar el nombre de la sede
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private pisoService: PisoService,
    private sedeService: SedeService
  ) {}

  ngOnInit(): void {
    this.getPisos();
    this.getSedes(); // Cargar las sedes
    this.initializeForm();
  }

  initializeForm(): void {
    this.pisoForm = this.fb.group({
      id: [0],
      codigo: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', Validators.required],
      sedeId: [null, Validators.required], // Llave foránea con Sede
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getPisos(): void {
    this.pisoService.getPisosSinEliminar().subscribe(
      data => {
        this.pisos = data;
      },
      error => {
        console.error('Error al obtener los pisos:', error);
      }
    );
  }

  getSedes(): void {
    this.sedeService.getSedesSinEliminar().subscribe(
      data => {
        this.sedes = data;
      },
      error => {
        console.error('Error al obtener las sedes:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.pisoForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const piso: Piso = this.pisoForm.value;

    if (this.isEditing) {
      this.updatePiso(piso);
    } else {
      this.createPiso(piso);
    }
  }

  createPiso(piso: Piso): void {
    piso.createdAt = new Date().toISOString();
    piso.updatedAt = new Date().toISOString();

    this.pisoService.createPiso(piso).subscribe(
      response => {
        Swal.fire('Éxito', 'Piso creado con éxito.', 'success');
        this.getPisos();
        this.resetForm();
      },
      error => {
        console.error('Error al crear el piso:', error);
        Swal.fire('Error', 'Error al crear el piso.', 'error');
      }
    );
  }

  updatePiso(piso: Piso): void {
    const updatedPiso: Piso = {
      ...piso,
      updatedAt: new Date().toISOString()
    };

    this.pisoService.updatePiso(updatedPiso).subscribe(
      response => {
        Swal.fire('Éxito', 'Piso actualizado con éxito.', 'success');
        this.getPisos();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar el piso:', error);
        Swal.fire('Error', 'Error al actualizar el piso.', 'error');
      }
    );
  }

  resetForm(): void {
    this.pisoForm.reset({
      id: 0,
      codigo: '',
      nombre: '',
      sedeId: null,
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: Piso): void {
    this.isEditing = true;
    this.pisoForm.patchValue({
      id: item.id,
      codigo: item.codigo,
      nombre: item.nombre,
      sedeId: item.sedeId.id, // Relación con sede por ID
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
        this.pisoService.deletePiso(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'El piso ha sido eliminado.', 'success');
            this.getPisos();
          },
          error => {
            console.error('Error al eliminar el piso:', error);
            Swal.fire('Error', 'Error al eliminar el piso.', 'error');
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

    this.pisoService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getPisos();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
