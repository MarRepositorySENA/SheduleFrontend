import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConvocatoriaComponent } from '../../../Componentes/Operacional/GestionHorario/convocatoria/convocatoria.component';
import { FichaComponent } from '../../../Componentes/Operacional/GestionHorario/ficha/ficha.component';
import { HorariosAmbientesComponent } from '../../../Componentes/Operacional/GestionHorario/horarios-ambientes/horarios-ambientes.component';
import { JornadaComponent } from '../../../Componentes/Operacional/GestionHorario/jornada/jornada.component';
import { MatriculaComponent } from '../../../Componentes/Operacional/GestionHorario/matricula/matricula.component';
import { ProgramacionFichaComponent } from '../../../Componentes/Operacional/GestionHorario/programacion-ficha/programacion-ficha.component';
import { CalendarioAmbientesComponent } from '../../../Componentes/Operacional/GestionHorario/calendario-ambientes/calendario-ambientes.component';

const routes: Routes = [
  { path: 'registro_convocatoria', component: ConvocatoriaComponent },  
  { path: 'registro_ficha', component: FichaComponent },  
  { path: 'registro_horarios_ambientes', component: HorariosAmbientesComponent },  
  { path: 'registro_jornada', component: JornadaComponent },  
  { path: 'registro_matricula', component: MatriculaComponent },  
  { path: 'registro_programacion_ficha', component: ProgramacionFichaComponent },
  { path: 'calendario_ambiente', component: CalendarioAmbientesComponent },  





];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionHorarioRoutingModule { }
