import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Persona } from '../../../models/M-Security/persona';
import { Usuario } from '../../../models/M-Security/usuario';
import { PersonaUsuarioService } from '../../../Services/S-Security/persona-usuario.service';

@Component({
  selector: 'app-persona-usuario',
  templateUrl: './persona-usuario.component.html',
  styleUrls: ['./persona-usuario.component.css']
})
export class PersonaUsuarioComponent implements OnInit {
  personaUsuarioForm!: FormGroup;
  personas: Persona[] = [];
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;
  headers = [
    { title: 'Primer Nombre', field: 'primerNombre' },
    { title: 'Primer Apellido', field: 'primerApellido' },
    { title: 'Nombre de Usuario', field: 'usuarioName' },
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private personaUsuarioService: PersonaUsuarioService
  ) {}

  ngOnInit(): void {
    this.getPersonas();
    this.initializeForm();
  }

  initializeForm(): void {
    this.personaUsuarioForm = this.fb.group({
      persona: this.fb.group({
        id: [0],
        primerNombre: ['', Validators.required],
        segundoNombre: [''],
        primerApellido: ['', Validators.required],
        segundoApellido: [''],
        tipoDocumento: ['', Validators.required],
        numeroDocumento: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        genero: ['', Validators.required],
        direccion: ['', Validators.required],
        telefono: ['', Validators.required],
        fechaNacimiento: ['', Validators.required],
        state: [true]
      }),
      usuario: this.fb.group({
        usuarioName: ['', Validators.required],
        contrasenia: ['', Validators.required],
        personaId: [null, Validators.required],  // Aseguramos que personaId esté correctamente referenciado
        state: [true]
      })
    });
  }

  // Obtener todas las personas
  getPersonas(): void {
    this.personaUsuarioService.getPersonas().subscribe(
      data => {
        this.personas = data;
      },
      error => {
        console.error('Error al obtener las personas:', error);
      }
    );
  }

  // Crear Persona y Usuario
  onSubmit(): void {
    if (this.personaUsuarioForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const persona: Persona = this.personaUsuarioForm.get('persona')?.value;
    const usuario: Usuario = this.personaUsuarioForm.get('usuario')?.value;

    this.personaUsuarioService.createPersonaUsuario(persona, usuario).subscribe(
      () => {
        Swal.fire('Éxito', 'Persona y Usuario creados con éxito.', 'success');
        this.getPersonas(); // Refrescar la lista de personas
        this.resetForm();
      },
      error => {
        console.error('Error al crear persona y usuario:', error);
        Swal.fire('Error', 'Error al crear persona y usuario.', 'error');
      }
    );
  }

  // Editar Persona y Usuario
  onEdit(persona: Persona, usuario: Usuario): void {
    this.isEditing = true;

    // Llenar el formulario con los datos de persona y usuario
    this.personaUsuarioForm.patchValue({
      persona: {
        id: persona.id,
        primerNombre: persona.primerNombre,
        segundoNombre: persona.segundoNombre,
        primerApellido: persona.primerApellido,
        segundoApellido: persona.segundoApellido,
        tipoDocumento: persona.tipoDocumento,
        numeroDocumento: persona.numeroDocumento,
        email: persona.email,
        genero: persona.genero,
        direccion: persona.direccion,
        telefono: persona.telefono,
        fechaNacimiento: persona.fechaNacimiento,
        state: persona.state
      },
      usuario: {
        usuarioName: usuario.usuarioName,
        contrasenia: '', // No podemos mostrar la contraseña actual, por seguridad
        personaId: usuario.personaId.id, // Relación con personaId de Usuario
        state: usuario.state
      }
    });
  }

  // Actualizar Persona y Usuario
  updatePersonaUsuario(): void {
    const persona: Persona = this.personaUsuarioForm.get('persona')?.value;
    const usuario: Usuario = this.personaUsuarioForm.get('usuario')?.value;

    this.personaUsuarioService.updatePersonaUsuario(persona, usuario).subscribe(
      () => {
        Swal.fire('Éxito', 'Persona y Usuario actualizados con éxito.', 'success');
        this.getPersonas(); // Refrescar la lista
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar persona y usuario:', error);
        Swal.fire('Error', 'Error al actualizar persona y usuario.', 'error');
      }
    );
  }

  // Eliminar Persona y Usuario
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
        this.personaUsuarioService.deletePersonaUsuario(id).subscribe(
          () => {
            Swal.fire('Eliminado!', 'Persona y Usuario eliminados con éxito.', 'success');
            this.getPersonas(); // Refrescar la lista de personas
          },
          error => {
            console.error('Error al eliminar persona y usuario:', error);
            Swal.fire('Error', 'Error al eliminar persona y usuario.', 'error');
          }
        );
      }
    });
  }

  // Reiniciar formulario
  resetForm(): void {
    this.personaUsuarioForm.reset({
      persona: {
        id: 0,
        primerNombre: '',
        segundoNombre: '',
        primerApellido: '',
        segundoApellido: '',
        tipoDocumento: '',
        numeroDocumento: '',
        email: '',
        genero: '',
        direccion: '',
        telefono: '',
        fechaNacimiento: '',
        state: true
      },
      usuario: {
        usuarioName: '',
        contrasenia: '',
        personaId: null,
        state: true
      }
    });
    this.isEditing = false;
  }

  // Carga masiva desde archivo Excel
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadExcel(): void {
    if (!this.selectedFile) {
      Swal.fire('Error', 'Por favor seleccione un archivo Excel.', 'error');
      return;
    }

    this.personaUsuarioService.cargarMasivo(this.selectedFile).subscribe(
      () => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getPersonas();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
