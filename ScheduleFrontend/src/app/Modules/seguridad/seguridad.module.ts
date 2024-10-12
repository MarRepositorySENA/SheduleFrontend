import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeguridadRoutingModule } from './seguridad-routing.module';
import { RoleComponent } from '../../Componentes/Security/role/role.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableComponent } from '../../Componentes/Pages/table/table.component';
import { CargaMasivaComponent } from '../../Componentes/Security/carga-masiva/carga-masiva.component';
import { UsuariosRolesComponent } from '../../Componentes/Security/usuarios-roles/usuarios-roles.component';
import { VistasRolesComponent } from '../../Componentes/Security/vistas-roles/vistas-roles.component';
import { VistaComponent } from '../../Componentes/Security/vista/vista.component';
import { PersonaUsuarioComponent } from '../../Componentes/Security/persona-usuario/persona-usuario.component';
import { ModuloComponent } from '../../Componentes/Security/modulo/modulo.component';


@NgModule({
  declarations: [
    CargaMasivaComponent,
    RoleComponent,
    UsuariosRolesComponent,
    VistasRolesComponent, 
    VistaComponent,
    PersonaUsuarioComponent,
    ModuloComponent,
    CargaMasivaComponent
  ],
  imports: [
    CommonModule,
    SeguridadRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    TableComponent
  ]
})
export class SeguridadModule { }
