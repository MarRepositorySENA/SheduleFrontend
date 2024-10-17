import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './Componentes/Pages/layout/layout.component';
import { AuthGuard } from './Services/Jwt/AuthGuard';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./Modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    component: LayoutComponent, // El LayoutComponent asegura que el menú y navbar sean visibles
    canActivate: [AuthGuard],  // Verifica autenticación con AuthGuard
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./Modules/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'informacion',
        loadChildren: () => import('./Modules/informacion/informacion.module').then(m => m.InformacionModule)
      },
      {
        path: 'parametrizacion',
        loadChildren: () => import('./Modules/parametrizacion/parametrizacion.module').then(m => m.ParametrizacionModule)
      },
      {
        path: 'seguridad',
        loadChildren: () => import('./Modules/seguridad/seguridad.module').then(m => m.SeguridadModule)
      },
      {
        path: 'operacional',
        loadChildren: () => import('./Modules/operacional/operacional.module').then(m => m.OperacionalModule)
      },
      {
        path: 'actualizar-datos',  // Nueva ruta para Actualizar Datos
        loadChildren: () =>
          import('./Modules/actualizar-datos/actualizar-datos.module').then(m => m.ActualizarDatosModule)
      }
    ]
  },
  { path: '**', redirectTo: 'auth' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
