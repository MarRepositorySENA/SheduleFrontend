import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { VistasRoles } from '../../../models/M-Security/vistas-roles';
import { Vista } from '../../../models/M-Security/vista';   // Modelo de Vista
import { Role } from '../../../models/M-Security/role';     // Modelo de Role
import { VistasRolesService } from '../../../Services/S-Security/vistas-roles.service';
import { VistaService } from '../../../Services/S-Security/vista.service';
import { RoleService } from '../../../Services/S-Security/role.service';

@Component({
  selector: 'app-vistas-roles',
  templateUrl: './vistas-roles.component.html',
  styleUrls: ['./vistas-roles.component.css']
})
export class VistasRolesComponent implements OnInit {
  vistasRoles: VistasRoles[] = [];
  vistasRolesForm!: FormGroup;
  selectedFile!: File; // Para la carga masiva
  isEditing: boolean = false;
  vistas: Vista[] = []; // Relación con Vista
  roles: Role[] = [];   // Relación con Role
  headers = [
    { title: 'Vista', field: 'vistaId.nombre' },  // Mostrar el nombre de la vista
    { title: 'Rol', field: 'roleId.nombre' },     // Mostrar el nombre del rol
    { title: 'Estado', field: 'state' }
  ];

  constructor(
    private fb: FormBuilder,
    private vistasRolesService: VistasRolesService,
    private vistaService: VistaService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.getVistasRoles();
    this.getVistas();
    this.getRoles();
    this.initializeForm();
  }

  initializeForm(): void {
    this.vistasRolesForm = this.fb.group({
      id: [0],
      vistaId: [null, Validators.required],  // Llave foránea con Vista
      roleId: [null, Validators.required],   // Llave foránea con Role
      state: [true, Validators.required],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  getVistasRoles(): void {
    this.vistasRolesService.getVistasRolesSinEliminar().subscribe(
      data => {
        this.vistasRoles = data;
      },
      error => {
        console.error('Error al obtener las vistas-roles:', error);
      }
    );
  }

  getVistas(): void {
    this.vistaService.getVistasSinEliminar().subscribe(
      data => {
        this.vistas = data;
      },
      error => {
        console.error('Error al obtener las vistas:', error);
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
    if (this.vistasRolesForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const vistasRoles: VistasRoles = this.vistasRolesForm.value;

    if (this.isEditing) {
      this.updateVistasRoles(vistasRoles);
    } else {
      this.createVistasRoles(vistasRoles);
    }
  }

  createVistasRoles(vistasRoles: VistasRoles): void {
    vistasRoles.createdAt = new Date().toISOString();
    vistasRoles.updatedAt = new Date().toISOString();

    this.vistasRolesService.createVistasRoles(vistasRoles).subscribe(
      response => {
        Swal.fire('Éxito', 'Vistas-Roles creado con éxito.', 'success');
        this.getVistasRoles();
        this.resetForm();
      },
      error => {
        console.error('Error al crear vistas-roles:', error);
        Swal.fire('Error', 'Error al crear vistas-roles.', 'error');
      }
    );
  }

  updateVistasRoles(vistasRoles: VistasRoles): void {
    const updatedVistasRoles: VistasRoles = {
      ...vistasRoles,
      updatedAt: new Date().toISOString()
    };

    this.vistasRolesService.updateVistasRoles(updatedVistasRoles).subscribe(
      response => {
        Swal.fire('Éxito', 'Vistas-Roles actualizado con éxito.', 'success');
        this.getVistasRoles();
        this.resetForm();
        this.isEditing = false;
      },
      error => {
        console.error('Error al actualizar vistas-roles:', error);
        Swal.fire('Error', 'Error al actualizar vistas-roles.', 'error');
      }
    );
  }

  resetForm(): void {
    this.vistasRolesForm.reset({
      id: 0,
      vistaId: null,
      roleId: null,
      state: true
    });
    this.isEditing = false;
  }

  onEdit(item: VistasRoles): void {
    this.isEditing = true;
    this.vistasRolesForm.patchValue({
      id: item.id,
      vistaId: item.vistaId.id,  // Relación con vista por ID
      roleId: item.roleId.id,    // Relación con rol por ID
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
        this.vistasRolesService.deleteVistasRoles(id).subscribe(
          response => {
            Swal.fire('Eliminado!', 'El Vistas-Roles ha sido eliminado.', 'success');
            this.getVistasRoles();
          },
          error => {
            console.error('Error al eliminar vistas-roles:', error);
            Swal.fire('Error', 'Error al eliminar vistas-roles.', 'error');
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

    this.vistasRolesService.cargarMasivo(this.selectedFile).subscribe(
      response => {
        Swal.fire('Éxito', 'Carga masiva completada con éxito.', 'success');
        this.getVistasRoles();
      },
      error => {
        console.error('Error durante la carga masiva:', error);
        Swal.fire('Error', error.error.message || 'Error durante la carga masiva.', 'error');
      }
    );
  }
}
