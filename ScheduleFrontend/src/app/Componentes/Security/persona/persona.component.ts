import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Persona } from '../../../models/M-Security/persona';
import { PersonaService } from '../../../Services/S-Security/persona.service';


@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {
  personas: Persona[] = [];
  personaForm!: FormGroup;
  isEditing: boolean = false;
  selectedFile!: File;
  headers = [
    { title: 'ID', field: 'id' },
    { title: 'Nombre Completo', field: 'primerNombre' },
    { title: 'Email', field: 'email' },
    { title: 'Teléfono', field: 'telefono' },
    { title: 'Dirección', field: 'direccion' }
  ];

  constructor(
    private fb: FormBuilder,
    private personaService: PersonaService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadPersonas();
  }

  initializeForm(): void {
    this.personaForm = this.fb.group({
      id: [0],
      primerNombre: ['', [Validators.required, Validators.minLength(2)]],
      segundoNombre: [''],
      primerApellido: ['', [Validators.required, Validators.minLength(2)]],
      segundoApellido: [''],
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      email: ['', [Validators.required, Validators.email]],
      genero: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      fechaNacimiento: ['', Validators.required]
    });
  }

  loadPersonas(): void {
    this.personaService.getPersonasSinEliminar().subscribe((data) => {
      this.personas = data;
    });
  }

  onSubmit(): void {
    if (this.personaForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos correctamente.', 'error');
      return;
    }

    const persona: Persona = this.personaForm.value;

    if (this.isEditing) {
      this.personaService.updatePersona(persona).subscribe(() => {
        Swal.fire('Éxito', 'Persona actualizada con éxito.', 'success');
        this.loadPersonas();
        this.resetForm();
      });
    } else {
      this.personaService.createPersona(persona).subscribe(() => {
        Swal.fire('Éxito', 'Persona creada con éxito.', 'success');
        this.loadPersonas();
        this.resetForm();
      });
    }
  }

  onEdit(persona: Persona): void {
    this.isEditing = true;
    this.personaForm.patchValue(persona);
  }

  onDelete(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.personaService.deletePersona(id).subscribe(() => {
          Swal.fire('Eliminado!', 'La persona ha sido eliminada.', 'success');
          this.loadPersonas();
        });
      }
    });
  }

  resetForm(): void {
    this.personaForm.reset();
    this.isEditing = false;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadExcel(): void {
    if (!this.selectedFile) {
      Swal.fire('Error', 'Por favor seleccione un archivo.', 'error');
      return;
    }

    this.personaService.cargarMasivo(this.selectedFile).subscribe(() => {
      Swal.fire('Éxito', 'Carga masiva exitosa.', 'success');
      this.loadPersonas();
    });
  }
}
