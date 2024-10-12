import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuariosRoles } from '../../../models/M-Security/usuarios-roles';
import { Usuario } from '../../../models/M-Security/usuario';               // Modelo de Usuario
import { Role } from '../../../models/M-Security/role';                     // Modelo de Role
import { UsuariosRolesService } from '../../../Services/S-Security/usuarios-roles.service';
import { UsuarioService } from '../../../Services/S-Security/usuario.service';
import { RoleService } from '../../../Services/S-Security/role.service';

@Component({
  selector: 'app-usuarios-roles',
  templateUrl: './usuarios-roles.component.html',
  styleUrls: ['./usuarios-roles.component.css']
})
export class UsuariosRolesComponent implements OnInit {
  usuariosRoles: UsuariosRoles[] = [];
  usuariosRolesForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;
  usuarios: Usuario[] = []; // Relación con Usuario
  roles: Role[] = [];       // Relación con Role
  headers = [
    { title: 'Usuario', field: 'usuarioId.usuarioName' },  // Mostrar el nombre del usuario
    { title: 'Rol', field: 'roleId.nombre' },              // Mostrar el nombre del rol
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private usuariosRolesService: UsuariosRolesService,
    private usuarioService: UsuarioService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.getUsuariosRoles();
    this.getUsuarios();
    this.getRoles();
    this.initializeForm();
  }

  initializeForm(): void {
    this.usuariosRolesForm = this.fb.group({
      id: [0],
      usuarioId: [null, Validators.required],  // Llave foránea con Usuario
      roleId: [null, Validators.required],     // Llave foránea con Role
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getUsuariosRoles(): void {
    this.usuariosRolesService.getUsuariosRolesSinEliminar().subscribe(
      data => {
        this.usuariosRoles = data;
      },
      error => {
        console.error('Error al obtener los usuarios-roles:', error);
      }
    );
  }

  getUsuarios(): void {
    this.usuarioService.getUsuariosSinEliminar().subscribe(
      data => {
        this.usuarios = data;
      },
      error => {
        console.error('Error al obtener los usuarios:', error);
      }
    );
  }

  getRoles(): void {
    this.roleService.getRolesSinEliminar().subscribe(
      data => {
        this.roles = data;
      },
      error => {
        console.error('Error al obtener los roles:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.usuariosRolesForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const usuariosRoles: UsuariosRoles = this.usuariosRolesForm.value;

    if (this.isEditing) {
      this.updateUsuariosRoles(usuariosRoles);
    } else {
      this.createUsuariosRoles(usuariosRoles);
    }
  }

  createUsuariosRoles(usuariosRoles: UsuariosRoles): void {
    usuariosRoles.createdAt = new Date().toISOString();
    usuariosRoles.updatedAt = new Date().toISOString();

    this.usuariosRolesService.createUsuariosRoles(usuariosRoles).subscribe(
      response => {
        Swal.fire('Éxito', 'Usuario-Rol creado con éxito.', 'success');
        this.getUsuariosRoles();
        this.resetForm();
      },
      error => {
        console.error('Error al crear usuario-rol:', error);
        Swal.fire('Error', 'Error al crear usuario-rol.', 'error');
      }
    );
  }

  updateUsuariosRoles(usuariosRoles: UsuariosRoles): void {
    const updatedUsuariosRoles: UsuariosRoles = {
      ...usuariosRoles,
      updatedAt: new Date().toISOString()
    };

    this.usuariosRolesService.updateUsuariosRoles(updatedUsuariosRoles).subscribe(
      response => {
        Swal.fire('Éxito', 'Usuario-Rol actualizado con éxito.', 'success');
        this.getUsuariosRoles();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar usuario-rol:', error);
        Swal.fire('Error', 'Error al actualizar usuario-rol.', 'error');
      }
    );
  }

  resetForm(): void {
    this.usuariosRolesForm.reset({
      id: 0,
      usuarioId: null,
      roleId: null,
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: UsuariosRoles): void {
    this.isEditing = true;
    this.usuariosRolesForm.patchValue({
      id: item.id,
      usuarioId: item.usuarioId.id, // Relación con usuario por ID
      roleId: item.roleId.id,       // Relación con rol por ID
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
        this.usuariosRolesService.deleteUsuariosRoles(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'El Usuario-Rol ha sido eliminado.', 'success');
            this.getUsuariosRoles();
          },
          error => {
            console.error('Error al eliminar usuario-rol:', error);
            Swal.fire('Error', 'Error al eliminar usuario-rol.', 'error');
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

    this.usuariosRolesService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getUsuariosRoles();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
