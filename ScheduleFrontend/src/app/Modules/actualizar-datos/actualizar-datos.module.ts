import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActualizarDatosRoutingModule } from './actualizar-datos-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActualizarDatosComponent } from '../../Componentes/Pages/Auth/actualizar-datos/actualizar-datos.component';

@NgModule({
  declarations: [
    ActualizarDatosComponent
  ],
  imports: [
    CommonModule,
    ActualizarDatosRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ActualizarDatosModule {}
