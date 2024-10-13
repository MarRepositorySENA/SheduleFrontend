import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './Componentes/Pages/layout/layout.component';
import { AuthGuard } from './Services/Jwt/AuthGuard';
import { RecuperarContraseniaComponent } from "./Componentes/Pages/Auth/recuperar-contrasenia/recuperar-contrasenia.component";
import { ActualizarContraseniaComponent } from "./Componentes/Pages/Auth/actualizar-contrasenia/actualizar-contrasenia.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth', // Redirige a la autenticación por defecto
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./Modules/auth/auth.module').then(m => m.AuthModule) // Ruta para el módulo de autenticación (login)
  },
  {
    path: '',
    component: LayoutComponent, // Carga el LayoutComponent después del login exitoso
    canActivate: [AuthGuard],    // Protege las rutas con AuthGuard para verificar la autenticación
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./Modules/dashboard/dashboard.module').then(m => m.DashboardModule) // Ruta para el módulo de dashboard
      },
      {
        path: 'parametrizacion',
        loadChildren: () => import('./Modules/parametrizacion/parametrizacion.module').then(m => m.ParametrizacionModule) // Ruta para parametrización
      },
      {
        path: 'seguridad',
        loadChildren: () => import('./Modules/seguridad/seguridad.module').then(m => m.SeguridadModule) // Ruta para seguridad
      },
      {
        path: 'operacional',
        loadChildren: () => import('./Modules/operacional/operacional.module').then(m => m.OperacionalModule) // Ruta para operacional
      }
    ]
  }

  // Agregar más rutas según sea necesario
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
