import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { NavbarComponent } from '../../Componentes/Pages/navbar/navbar.component';
import { MenuComponent } from '../../Componentes/Pages/menu/menu.component';
import { LayoutComponent } from '../../Componentes/Pages/layout/layout.component';
import { RouterModule } from '@angular/router';





@NgModule({
  declarations: [
    NavbarComponent,
    MenuComponent,
    LayoutComponent 
    
  ],
  imports: [
    CommonModule,
    RouterModule
   
  ],
  exports: [
    NavbarComponent,
    MenuComponent, // Exportar el MenuComponent para que esté disponible a nivel global
    LayoutComponent

  ]
})
export class SharedModule { }
