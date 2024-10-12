import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Role } from '../../../models/M-Security/role';
import { RoleService } from '../../../Services/S-Security/role.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  roles: Role[] = [];
  roleForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;
  headers = [
    { title: 'Nombre', field: 'nombre' },
    { title: 'Descripción', field: 'descripcion' },
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.getRoles();
    this.initializeForm();
  }

  initializeForm(): void {
    this.roleForm = this.fb.group({
      id: [0],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', Validators.required],
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
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
    if (this.roleForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const role: Role = this.roleForm.value;

    if (this.isEditing) {
      this.updateRole(role);
    } else {
      this.createRole(role);
    }
  }

  createRole(role: Role): void {
    role.createdAt = new Date().toISOString();
    role.updatedAt = new Date().toISOString();

    this.roleService.createRole(role).subscribe(
      response => {
        Swal.fire('Éxito', 'Rol creado con éxito.', 'success');
        this.getRoles();
        this.resetForm();
      },
      error => {
        console.error('Error al crear rol:', error);
        Swal.fire('Error', 'Error al crear rol.', 'error');
      }
    );
  }

  updateRole(role: Role): void {
    const updatedRole: Role = {
      ...role,
      updatedAt: new Date().toISOString()
    };

    this.roleService.updateRole(updatedRole).subscribe(
      response => {
        Swal.fire('Éxito', 'Rol actualizado con éxito.', 'success');
        this.getRoles();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar rol:', error);
        Swal.fire('Error', 'Error al actualizar rol.', 'error');
      }
    );
  }

  resetForm(): void {
    this.roleForm.reset({
      id: 0,
      nombre: '',
      descripcion: '',
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: Role): void {
    this.isEditing = true;
    this.roleForm.patchValue({
      id: item.id,
      nombre: item.nombre,
      descripcion: item.descripcion,
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
        this.roleService.deleteRole(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'El Rol ha sido eliminado.', 'success');
            this.getRoles();
          },
          error => {
            console.error('Error al eliminar rol:', error);
            Swal.fire('Error', 'Error al eliminar rol.', 'error');
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

    this.roleService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getRoles();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
