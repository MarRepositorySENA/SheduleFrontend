import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CentroFormacionService } from '../../../../Services/Parameter/Infraestructura/centro-formacion.service';
import { RegionalService } from '../../../../Services/Parameter/Infraestructura/regional.service';
import { CiudadService } from '../../../../Services/Parameter/Ubicacion/ciudad.service';
import { Regional } from '../../../../models/M-Parameter/infraestructura/regional';
import { Ciudad } from '../../../../models/M-Parameter/Ubicacion/ciudad';
import { CentroFormacion } from '../../../../models/M-Parameter/infraestructura/centro-formacion';

@Component({
  selector: 'app-centro-formacion',
  templateUrl: './centro-formacion.component.html',
  styleUrls: ['./centro-formacion.component.css']
})
export class CentroFormacionComponent implements OnInit {
  centrosFormacion: CentroFormacion[] = [];
  regionales: Regional[] = [];
  ciudades: Ciudad[] = [];
  centroFormacionForm!: FormGroup;
  isEditing: boolean = false;
  headers = [
    { title: 'Nombre', field: 'nombre' },
    { title: 'Dirección', field: 'direccion' },
    { title: 'Teléfono', field: 'telefono' },
    { title: 'Regional', field: 'regionalId.nombre' },
    { title: 'Ciudad', field: 'ciudadId.nombre' },
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private centroFormacionService: CentroFormacionService,
    private regionalService: RegionalService,
    private ciudadService: CiudadService
  ) {}

  ngOnInit(): void {
    this.getCentrosFormacion();
   
    this.getCiudades();
    this.initializeForm();
  }

  initializeForm(): void {
    this.centroFormacionForm = this.fb.group({
      id: [0],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      direccion: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{7,10}$')]],
      regionalId: this.fb.group({
        id: [null, Validators.required]
      }),
      ciudadId: this.fb.group({
        id: [null, Validators.required]
      }),
      state: [true],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getCentrosFormacion(): void {
    this.centroFormacionService.getCentrosFormacionSinEliminar().subscribe(
      data => {
        this.centrosFormacion = data;
      },
      error => {
        console.error('Error al obtener los centros de formación:', error);
      }
    );
  }

 

  getCiudades(): void {
    this.ciudadService.getCiudades().subscribe(
      data => {
        this.ciudades = data;
      },
      error => {
        console.error('Error al obtener las ciudades:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.centroFormacionForm.invalid) {
      alert('Por favor, complete todos los campos correctamente.');
      return;
    }

    const centroFormacion: CentroFormacion = this.centroFormacionForm.value;
    if (this.isEditing) {
      this.updateCentroFormacion(centroFormacion);
    } else {
      this.createCentroFormacion(centroFormacion);
    }
  }

  createCentroFormacion(centroFormacion: CentroFormacion): void {
    centroFormacion.createdAt = new Date().toISOString();
    centroFormacion.updatedAt = new Date().toISOString();

    this.centroFormacionService.createCentroFormacion(centroFormacion).subscribe(
      response => {
        alert('Centro de formación creado con éxito.');
        this.getCentrosFormacion();
        this.resetForm();
      },
      error => {
        console.error('Error al crear el centro de formación:', error);
      }
    );
  }



  updateCentroFormacion(centroFormacion: CentroFormacion): void {
    const updatedCentroFormacion: CentroFormacion = {
      ...centroFormacion,
      updatedAt: new Date().toISOString()
    };

    this.centroFormacionService.updateCentroFormacion(updatedCentroFormacion).subscribe(
      response => {
        alert('Centro de formación actualizado con éxito.');
        this.getCentrosFormacion();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar el centro de formación:', error);
      }
    );
  }

  resetForm(): void {
    this.centroFormacionForm.reset({
      id: 0,
      nombre: '',
      direccion: '',
      telefono: '',
      regionalId: { id: null },
      ciudadId: { id: null },
      state: true
    });
    this.isEditing = false;
  }
}
