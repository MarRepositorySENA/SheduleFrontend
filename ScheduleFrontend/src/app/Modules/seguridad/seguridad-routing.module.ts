import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CargaMasivaComponent } from '../../Componentes/Security/carga-masiva/carga-masiva.component';
import { RoleComponent } from '../../Componentes/Security/role/role.component';
import { UsuariosRolesComponent } from '../../Componentes/Security/usuarios-roles/usuarios-roles.component';
import { VistasRolesComponent } from '../../Componentes/Security/vistas-roles/vistas-roles.component';
import { VistaComponent } from '../../Componentes/Security/vista/vista.component';
import { ModuloComponent } from '../../Componentes/Security/modulo/modulo.component';
import { PersonaComponent } from '../../Componentes/Security/persona/persona.component';

const routes: Routes = [
  { path: 'registro_carga-masiva', component: CargaMasivaComponent },
  { path: 'registro_role', component: RoleComponent },
  { path: 'registros_usuarios_roles', component: UsuariosRolesComponent },
  { path: 'registros_vistas_roles', component: VistasRolesComponent },
  { path: 'registro_vista', component: VistaComponent },
  { path: 'registro_modulo', component: ModuloComponent },
  { path: 'registro_persona', component:  PersonaComponent },
  { path: 'registros_usuarios', component:  CargaMasivaComponent },


];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeguridadRoutingModule { }
