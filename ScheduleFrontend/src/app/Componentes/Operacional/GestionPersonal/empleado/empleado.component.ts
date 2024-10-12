import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Empleado } from '../../../../models/M-Operacional/GestionPersonal/empleado';
import { Cargo } from '../../../../models/M-Operacional/GestionPersonal/cargo';
import { TipoContrato } from '../../../../models/M-Operacional/GestionPersonal/tipo-contrato';
import { Persona } from '../../../../models/M-Security/persona';
import { EmpleadoService } from '../../../../Services/S-Operacional/GestionPersonal/empleado.service';
import { CargoService } from '../../../../Services/S-Operacional/GestionPersonal/cargo.service';
import { TipoContratoService } from '../../../../Services/S-Operacional/GestionPersonal/TipoContrato.service';
import { PersonaService } from '../../../../Services/S-Security/persona.service';


@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export class EmpleadoComponent implements OnInit {
  empleados: Empleado[] = [];
  cargos: Cargo[] = [];
  tiposContrato: TipoContrato[] = [];
  personas: Persona[] = [];
  empleadoForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;

  headers = [
    { title: 'Identificador', field: 'identificador' },
    { title: 'Fecha Inicio', field: 'fechaInicio' },
    { title: 'Fecha Fin', field: 'fechaFin' },
    { title: 'Cargo', field: 'cargoId.nombre' },
    { title: 'Tipo Contrato', field: 'tipoContratoId.nombre' },
    { title: 'Persona', field: 'personaId.primerNombre' },
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private empleadoService: EmpleadoService,
    private cargoService: CargoService,
    private tipoContratoService: TipoContratoService,
    private personaService: PersonaService
  ) {}

  ngOnInit(): void {
    this.getEmpleados();
    this.getCargos();
    this.getTipoContratos();
    this.getPersonas();
    this.initializeForm();
  }

  initializeForm(): void {
    this.empleadoForm = this.fb.group({
      id: [0],
      identificador: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      cargoId: this.fb.group({
        id: [null, Validators.required]
      }),
      tipoContratoId: this.fb.group({
        id: [null, Validators.required]
      }),
      personaId: this.fb.group({
        id: [null, Validators.required]
      }),
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getEmpleados(): void {
    this.empleadoService.getEmpleadosSinEliminar().subscribe(
      data => {
        this.empleados = data;
      },
      error => {
        console.error('Error al obtener los empleados:', error);
      }
    );
  }

  getCargos(): void {
    this.cargoService.getCargos().subscribe(
      data => {
        this.cargos = data;
      },
      error => {
        console.error('Error al obtener los cargos:', error);
      }
    );
  }

  getTipoContratos(): void {
    this.tipoContratoService.getTipoContratos().subscribe(
      data => {
        this.tiposContrato = data;
      },
      error => {
        console.error('Error al obtener los tipos de contrato:', error);
      }
    );
  }

  getPersonas(): void {
    this.personaService.getPersonas().subscribe(
      data => {
        this.personas = data;
      },
      error => {
        console.error('Error al obtener las personas:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.empleadoForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const empleado: Empleado = this.empleadoForm.value;

    if (this.isEditing) {
      this.updateEmpleado(empleado);
    } else {
      this.createEmpleado(empleado);
    }
  }

  createEmpleado(empleado: Empleado): void {
    empleado.createdAt = new Date().toISOString();
    empleado.updatedAt = new Date().toISOString();

    this.empleadoService.createEmpleado(empleado).subscribe(
      response => {
        Swal.fire('Éxito', 'Empleado creado con éxito.', 'success');
        this.getEmpleados();
        this.resetForm();
      },
      error => {
        console.error('Error al crear el empleado:', error);
        Swal.fire('Error', 'Error al crear el empleado.', 'error');
      }
    );
  }

  updateEmpleado(empleado: Empleado): void {
    const updatedEmpleado: Empleado = {
      ...empleado,
      updatedAt: new Date().toISOString()
    };

    this.empleadoService.updateEmpleado(updatedEmpleado).subscribe(
      response => {
        Swal.fire('Éxito', 'Empleado actualizado con éxito.', 'success');
        this.getEmpleados();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar el empleado:', error);
        Swal.fire('Error', 'Error al actualizar el empleado.', 'error');
      }
    );
  }

  resetForm(): void {
    this.empleadoForm.reset({
      id: 0,
      identificador: '',
      fechaInicio: '',
      fechaFin: '',
      cargoId: { id: null },
      tipoContratoId: { id: null },
      personaId: { id: null },
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: Empleado): void {
    this.isEditing = true;
    this.empleadoForm.patchValue({
      id: item.id,
      identificador: item.identificador,
      fechaInicio: item.fechaInicio,
      fechaFin: item.fechaFin,
      cargoId: item.cargoId,
      tipoContratoId: item.tipoContratoId,
      personaId: item.personaId,
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
        this.empleadoService.deleteEmpleado(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'El empleado ha sido eliminado.', 'success');
            this.getEmpleados();
          },
          error => {
            console.error('Error al eliminar el empleado:', error);
            Swal.fire('Error', 'Error al eliminar el empleado.', 'error');
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

    this.empleadoService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getEmpleados();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
