import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegionalService } from '../../../../Services/Parameter/Infraestructura/regional.service';
import { DepartamentoService } from '../../../../Services/Parameter/Ubicacion/departamento.service';
import { Regional } from '../../../../models/M-Parameter/infraestructura/regional';
import { Departamento } from '../../../../models/M-Parameter/Ubicacion/departamento';

@Component({
  selector: 'app-regional',
  templateUrl: './regional.component.html',
  styleUrls: ['./regional.component.css']
})
export class RegionalComponent implements OnInit {
  regionales: Regional[] = [];
  departamentos: Departamento[] = [];
  regionalForm!: FormGroup;
  isEditing: boolean = false;
  headers = [
    { title: 'NIT', field: 'nit' },
    { title: 'Nombre', field: 'nombre' },
    { title: 'Acrónimo', field: 'acronimo' },
    { title: 'Dirección', field: 'direccion' },
    { title: 'Teléfono', field: 'telefono' },
    { title: 'Departamento', field: 'departamentoId.nombre' },
    { title: 'País', field: 'departamentoId.paisId.nombre' },
    { title: 'Continente', field: 'departamentoId.paisId.continenteId.nombre' },
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private regionalService: RegionalService,
    private departamentoService: DepartamentoService
  ) {}

  ngOnInit(): void {
    this.getRegionales();
    this.getDepartamentos();
    this.initializeForm();
  }

  initializeForm(): void {
    this.regionalForm = this.fb.group({
      id: [0],
      nit: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Solo números para el NIT
      nombre: ['', [Validators.required, Validators.minLength(3)]], // Nombre obligatorio, al menos 3 caracteres
      acronimo: ['', [Validators.required, Validators.maxLength(5)]], // Acrónimo obligatorio, máximo 5 caracteres
      direccion: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{7,10}$')]], // Teléfono debe ser de 7 a 10 dígitos
      departamentoId: this.fb.group({
        id: [null, Validators.required]
      }),
      state: [true],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getRegionales(): void {
    this.regionalService.getRegionalesSinEliminar().subscribe(
      data => {
        this.regionales = data;
      },
      error => {
        console.error('Error al obtener los regionales:', error);
      }
    );
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

  onSubmit(): void {
    if (this.regionalForm.invalid) {
      alert('Por favor, complete todos los campos obligatorios correctamente.');
      return;
    }

    const regional: Regional = this.regionalForm.value;
    if (this.isEditing) {
      this.updateRegional(regional);
    } else {
      this.createRegional(regional);
    }
  }

  createRegional(regional: Regional): void {
    regional.createdAt = new Date().toISOString();
    regional.updatedAt = new Date().toISOString();

    this.regionalService.createRegional(regional).subscribe(
      response => {
        alert('Regional creada con éxito.');
        this.getRegionales();
        this.resetForm();
      },
      error => {
        console.error('Error al crear la regional:', error);
      }
    );
  }

  updateRegional(regional: Regional): void {
    const updatedRegional: Regional = {
      ...regional,
      updatedAt: new Date().toISOString()
    };

    this.regionalService.updateRegional(updatedRegional).subscribe(
      response => {
        alert('Regional actualizada con éxito.');
        this.getRegionales();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar la regional:', error);
      }
    );
  }

  editRegional(regional: Regional): void {
    this.isEditing = true;
    this.regionalForm.patchValue({
      id: regional.id,
      nit: regional.nit,
      nombre: regional.nombre,
      acronimo: regional.acronimo,
      direccion: regional.direccion,
      telefono: regional.telefono,
      departamentoId: {
        id: regional.departamentoId?.id || null
      },
      state: regional.state,
      createdAt: regional.createdAt,
      updatedAt: regional.updatedAt
    });
  }

  deleteRegional(id: number): void {
    const regionalToDelete = this.regionales.find(reg => reg.id === id);
    if (regionalToDelete) {
      regionalToDelete.deletedAt = new Date().toISOString();
      this.regionalService.updateRegional(regionalToDelete).subscribe(
        () => {
          alert('Regional eliminada visualmente.');
          this.getRegionales();
        },
        error => {
          console.error('Error al eliminar la regional:', error);
        }
      );
    }
  }

  resetForm(): void {
    this.regionalForm.reset({
      id: 0,
      nit: '',
      nombre: '',
      acronimo: '',
      direccion: '',
      telefono: '',
      departamentoId: { id: null },
      state: true
    });
    this.isEditing = false;
  }
}
