import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { FichasEmpleados } from '../../../../models/M-Operacional/GestionPersonal/fichas-empleados';
import { Empleado } from '../../../../models/M-Operacional/GestionPersonal/empleado';
import { Ficha } from '../../../../models/M-Operacional/GestionHorario/ficha';
import { FichasEmpleadosService } from '../../../../Services/S-Operacional/GestionPersonal/FichasEmpleados.service';
import { EmpleadoService } from '../../../../Services/S-Operacional/GestionPersonal/empleado.service';
import { FichaService } from '../../../../Services/S-Operacional/GestionHorario/ficha.service';

@Component({
  selector: 'app-fichas-empleados',
  templateUrl: './fichas-empleados.component.html',
  styleUrls: ['./fichas-empleados.component.css']
})
export class FichasEmpleadosComponent implements OnInit {
  fichasEmpleados: FichasEmpleados[] = [];
  empleados: Empleado[] = [];
  fichas: Ficha[] = [];
  fichasEmpleadosForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;

  headers = [
    { title: 'Empleado', field: 'empleadoId.identificador' },
    { title: 'Ficha', field: 'fichaId.codigo' },
    { title: 'Fecha Inicio', field: 'fichaId.fechaInicio' },
    { title: 'Fecha Fin', field: 'fichaId.fechaFin' },
    { title: 'Cargo', field: 'empleadoId.cargoId.nombre' },
    { title: 'Tipo Contrato', field: 'empleadoId.tipoContratoId.nombre' },
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private fichasEmpleadosService: FichasEmpleadosService,
    private empleadoService: EmpleadoService,
    private fichaService: FichaService
  ) {}

  ngOnInit(): void {
    this.getFichasEmpleados();
    this.getEmpleados();
    this.getFichas();
    this.initializeForm();
  }

  initializeForm(): void {
    this.fichasEmpleadosForm = this.fb.group({
      id: [0],
      empleadoId: this.fb.group({
        id: [null, Validators.required]
      }),
      fichaId: this.fb.group({
        id: [null, Validators.required]
      }),
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getFichasEmpleados(): void {
    this.fichasEmpleadosService.getFichasEmpleadosSinEliminar().subscribe(
      data => {
        this.fichasEmpleados = data;
      },
      error => {
        console.error('Error al obtener las fichas de empleados:', error);
      }
    );
  }

  getEmpleados(): void {
    this.empleadoService.getEmpleados().subscribe(
      data => {
        this.empleados = data;
      },
      error => {
        console.error('Error al obtener los empleados:', error);
      }
    );
  }

  getFichas(): void {
    this.fichaService.getFichas().subscribe(
      data => {
        this.fichas = data;
      },
      error => {
        console.error('Error al obtener las fichas:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.fichasEmpleadosForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const fichasEmpleados: FichasEmpleados = this.fichasEmpleadosForm.value;

    if (this.isEditing) {
      this.updateFichasEmpleados(fichasEmpleados);
    } else {
      this.createFichasEmpleados(fichasEmpleados);
    }
  }

  createFichasEmpleados(fichasEmpleados: FichasEmpleados): void {
    fichasEmpleados.createdAt = new Date().toISOString();
    fichasEmpleados.updatedAt = new Date().toISOString();

    this.fichasEmpleadosService.createFichasEmpleados(fichasEmpleados).subscribe(
      response => {
        Swal.fire('Éxito', 'Fichas-Empleado creado con éxito.', 'success');
        this.getFichasEmpleados();
        this.resetForm();
      },
      error => {
        console.error('Error al crear la ficha-empleado:', error);
        Swal.fire('Error', 'Error al crear la ficha-empleado.', 'error');
      }
    );
  }

  updateFichasEmpleados(fichasEmpleados: FichasEmpleados): void {
    const updatedFichasEmpleados: FichasEmpleados = {
      ...fichasEmpleados,
      updatedAt: new Date().toISOString()
    };

    this.fichasEmpleadosService.updateFichasEmpleados(updatedFichasEmpleados).subscribe(
      response => {
        Swal.fire('Éxito', 'Fichas-Empleado actualizado con éxito.', 'success');
        this.getFichasEmpleados();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar la ficha-empleado:', error);
        Swal.fire('Error', 'Error al actualizar la ficha-empleado.', 'error');
      }
    );
  }

  resetForm(): void {
    this.fichasEmpleadosForm.reset({
      id: 0,
      empleadoId: { id: null },
      fichaId: { id: null },
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: FichasEmpleados): void {
    this.isEditing = true;
    this.fichasEmpleadosForm.patchValue({
      id: item.id,
      empleadoId: item.empleadoId,
      fichaId: item.fichaId,
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
        this.fichasEmpleadosService.deleteFichasEmpleados(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'La ficha-empleado ha sido eliminada.', 'success');
            this.getFichasEmpleados();
          },
          error => {
            console.error('Error al eliminar la ficha-empleado:', error);
            Swal.fire('Error', 'Error al eliminar la ficha-empleado.', 'error');
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

    this.fichasEmpleadosService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getFichasEmpleados();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
