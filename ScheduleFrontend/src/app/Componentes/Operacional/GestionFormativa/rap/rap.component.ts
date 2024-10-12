import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Rap } from '../../../../models/M-Operacional/GestionFormativa/rap';
import { RapService } from '../../../../Services/S-Operacional/GestionFormativa/Rap.service';

@Component({
  selector: 'app-rap',
  templateUrl: './rap.component.html',
  styleUrls: ['./rap.component.css']
})
export class RapComponent implements OnInit {
  raps: Rap[] = [];
  rapForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;

  headers = [
    { title: 'Descripción', field: 'descripcion' },
    { title: 'Duración (horas)', field: 'duraccion' },
    { title: 'Nivel', field: 'nivel' },
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private rapService: RapService
  ) {}

  ngOnInit(): void {
    this.getRaps();
    this.initializeForm();
  }

  initializeForm(): void {
    this.rapForm = this.fb.group({
      id: [0],
      descripcion: ['', Validators.required],
      duraccion: [0, [Validators.required, Validators.min(1)]],
      nivel: ['', Validators.required],
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getRaps(): void {
    this.rapService.getRapsSinEliminar().subscribe(
      data => {
        this.raps = data;
      },
      error => {
        console.error('Error al obtener los RAPs:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.rapForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const rap: Rap = this.rapForm.value;

    if (this.isEditing) {
      this.updateRap(rap);
    } else {
      this.createRap(rap);
    }
  }

  createRap(rap: Rap): void {
    rap.createdAt = new Date().toISOString();
    rap.updatedAt = new Date().toISOString();

    this.rapService.createRap(rap).subscribe(
      response => {
        Swal.fire('Éxito', 'RAP creado con éxito.', 'success');
        this.getRaps();
        this.resetForm();
      },
      error => {
        console.error('Error al crear el RAP:', error);
        Swal.fire('Error', 'Error al crear el RAP.', 'error');
      }
    );
  }

  updateRap(rap: Rap): void {
    const updatedRap: Rap = {
      ...rap,
      updatedAt: new Date().toISOString()
    };

    this.rapService.updateRap(updatedRap).subscribe(
      response => {
        Swal.fire('Éxito', 'RAP actualizado con éxito.', 'success');
        this.getRaps();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar el RAP:', error);
        Swal.fire('Error', 'Error al actualizar el RAP.', 'error');
      }
    );
  }

  resetForm(): void {
    this.rapForm.reset({
      id: 0,
      descripcion: '',
      duraccion: 0,
      nivel: '',
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: Rap): void {
    this.isEditing = true;
    this.rapForm.patchValue({
      id: item.id,
      descripcion: item.descripcion,
      duraccion: item.duraccion,
      nivel: item.nivel,
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
        this.rapService.deleteRap(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'El RAP ha sido eliminado.', 'success');
            this.getRaps();
          },
          error => {
            console.error('Error al eliminar el RAP:', error);
            Swal.fire('Error', 'Error al eliminar el RAP.', 'error');
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

    this.rapService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getRaps();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
