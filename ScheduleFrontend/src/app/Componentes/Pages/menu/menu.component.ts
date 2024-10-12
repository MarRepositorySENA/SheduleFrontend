import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  modulos: any[] = [];
  usuario: string = '';  // Este será dinámico según el login
  rol: string = '';

  constructor() {}

  ngOnInit(): void {
    // Obtener el nombre de usuario desde el localStorage
    const storedUser = localStorage.getItem('username');
    
    if (storedUser) {
      this.usuario = storedUser;  // Asignar el usuario desde localStorage
      this.rol = this.getRol(this.usuario);  // Obtener el rol basado en el nombre del usuario
      this.cargarModulos();  // Cargar los módulos según el rol
    } else {
      console.error('No se ha encontrado un usuario autenticado.');
    }
  }

  // Método para obtener el rol según el nombre de usuario
  getRol(usuario: string): string {
    switch (usuario.toLowerCase()) {
      case 'miguel':
        return 'admin';
      case 'margb':
        return 'instructor';
      case 'davidra':
        return 'aprendiz';
      case 'coordinador123':
        return 'coordinador';
      case 'soporteuser':
        return 'soporte';
      default:
        return 'aprendiz';  // Rol por defecto
    }
  }

  // Método para cargar los módulos según el rol
  cargarModulos() {
    if (this.rol === 'admin') {
      this.modulos = [
        {
          nombre: 'Operacional',
          icono: 'fa fa-cogs',
          expanded: false,
          submodulos: [
            {
              nombre: 'Gestión Formativa',
              icono: 'fa fa-book',
              expanded: false,
              vistas: [
                { nombre: 'Competencias', ruta: 'operacional/gestion_formativa/registro_competencia' },
                { nombre: 'Competencias Programa Formación', ruta: 'operacional/gestion_formativa/registro_competencias_programa_formacion' },
                { nombre: 'Modalidad', ruta: 'operacional/gestion_formativa/registro_modalidad' },
                { nombre: 'Nivel Formación', ruta: 'operacional/gestion_formativa/registro_nivel_formacion' },
                { nombre: 'Programa Formación', ruta: 'operacional/gestion_formativa/registro_programa_formacion' },
                { nombre: 'RAP', ruta: 'operacional/gestion_formativa/registro_rap' },
                { nombre: 'RAPs Competencias', ruta: 'operacional/gestion_formativa/registro_raps_competencias' },
                { nombre: 'Tipo Formación', ruta: 'operacional/gestion_formativa/registro_tipo_formacion' }
              ]
            },
            {
              nombre: 'Gestión Horario',
              icono: 'fa fa-calendar',
              vistas: [
                { nombre: 'Convocatoria', ruta: 'operacional/gestion_horario/registro_convocatoria' },
                { nombre: 'Fichas', ruta: 'operacional/gestion_horario/registro_ficha' },
                { nombre: 'Horarios Ambientes', ruta: 'operacional/gestion_horario/registro_horarios_ambientes' },
                { nombre: 'Jornadas', ruta: 'operacional/gestion_horario/registro_jornada' },
                { nombre: 'Matrícula', ruta: 'operacional/gestion_horario/registro_matricula' },
                { nombre: 'Programación Fichas', ruta: 'operacional/gestion_horario/registro_programacion_ficha' }
              ]
            },
            {
              nombre: 'Gestión Personal',
              icono: 'fa fa-users',
              vistas: [
                { nombre: 'Cargos', ruta: 'operacional/gestion_personal/registro_cargo' },
                { nombre: 'Empleados', ruta: 'operacional/gestion_personal/registro_empleado' },
                { nombre: 'Fichas Empleados', ruta: 'operacional/gestion_personal/registro_fichas_empleados' },
                { nombre: 'Funciones', ruta: 'operacional/gestion_personal/registro_funciones' },
                { nombre: 'Horarios Empleados', ruta: 'operacional/gestion_personal/registro_horarios_empleados' },
                { nombre: 'Tipo Contrato', ruta: 'operacional/gestion_personal/registro_tipo_contrato' }
              ]
            },
            {
              nombre: 'Planificación Formativa',
              icono: 'fa fa-tasks',
              vistas: [
                { nombre: 'Actividad Proyecto', ruta: 'operacional/planificacion_formativa/registro_actividad_proyecto' },
                { nombre: 'Actividades Proyectos RAPs', ruta: 'operacional/planificacion_formativa/registro_actividades_proyectos_raps' },
                { nombre: 'Fases', ruta: 'operacional/planificacion_formativa/registro_fase' },
                { nombre: 'Proyecto Formativo', ruta: 'operacional/planificacion_formativa/registro_proyecto_formativo' },
                { nombre: 'Proyectos Formativos Fichas', ruta: 'operacional/planificacion_formativa/registro_proyectos_formativos_fichas' }
              ]
            }
          ]
        },
        {
          nombre: 'Parametrización',
          icono: 'fa fa-wrench',
          expanded: false,
          submodulos: [
            {
              nombre: 'Ubicación',
              icono: 'fa fa-map-marker-alt',
              vistas: [
                { nombre: 'Continente', ruta: 'parametrizacion/ubicacion/registro_continente' },
                { nombre: 'País', ruta: 'parametrizacion/ubicacion/registro_pais' },
                { nombre: 'Departamento', ruta: 'parametrizacion/ubicacion/registro_departamento' },
                { nombre: 'Ciudad', ruta: 'parametrizacion/ubicacion/registro_ciudad' },
                { nombre: 'Localidad', ruta: 'parametrizacion/ubicacion/registro_localidad' }
              ]
            },
            {
              nombre: 'Infraestructura',
              icono: 'fa fa-building',
              vistas: [
                { nombre: 'Ambiente', ruta: 'parametrizacion/infraestructura/registro_ambiente' },
                { nombre: 'Centro Formación', ruta: 'parametrizacion/infraestructura/registro_centro_formacion' },
                { nombre: 'Especialidad', ruta: 'parametrizacion/infraestructura/registro_especialidad' },
                { nombre: 'Piso', ruta: 'parametrizacion/infraestructura/registro_piso' },
                { nombre: 'Regional', ruta: 'parametrizacion/infraestructura/registro_regional' },
                { nombre: 'Sede', ruta: 'parametrizacion/infraestructura/registro_sede' }
              ]
            }
          ]
        },
        {
          nombre: 'Seguridad',
          icono: 'fa fa-shield-alt',
          vistas: [
            { nombre: 'Roles', ruta: 'seguridad/registro_role' },
            { nombre: 'Usuarios y Roles', ruta: 'seguridad/registro_usuarios_roles' },
            { nombre: 'Vistas y Roles', ruta: 'seguridad/registro_vistas_roles' },
            { nombre: 'Personas y Usuarios', ruta: 'seguridad/registros_persona_usuario' },
            { nombre: 'Modulos', ruta: 'seguridad/registros_modulo' }
          ]
        }
      ];
    } else if (this.rol === 'instructor') {
      this.modulos = [
        {
          nombre: 'Operacional',
          icono: 'fa fa-cogs',
          submodulos: [
            {
              nombre: 'Gestión Horario',
              icono: 'fa fa-calendar',
              vistas: [
                { nombre: 'Convocatoria', ruta: 'operacional/gestion_horario/registro_convocatoria' },
                { nombre: 'Jornadas', ruta: 'operacional/gestion_horario/registro_jornada' },
                { nombre: 'Programación Fichas', ruta: 'operacional/gestion_horario/registro_programacion_ficha' }
              ]
            }
          ]
        }
      ];
    } else if (this.rol === 'aprendiz') {
      this.modulos = [
        {
          nombre: 'Operacional',
          icono: 'fa fa-cogs',
          submodulos: [
            {
              nombre: 'Planificación Formativa',
              icono: 'fa fa-tasks',
              vistas: [
                { nombre: 'Proyecto Formativo', ruta: 'operacional/planificacion_formativa/registro_proyecto_formativo' },
                { nombre: 'Proyectos Formativos Fichas', ruta: 'operacional/planificacion_formativa/registro_proyectos_formativos_fichas' }
              ]
            }
          ]
        }
      ];
    } else if (this.rol === 'coordinador') {
      this.modulos = [
        {
          nombre: 'Operacional',
          icono: 'fa fa-cogs',
          submodulos: [
            {
              nombre: 'Gestión Personal',
              icono: 'fa fa-users',
              vistas: [
                { nombre: 'Empleados', ruta: 'operacional/gestion_personal/registro_empleado' },
                { nombre: 'Cargos', ruta: 'operacional/gestion_personal/registro_cargo' }
              ]
            }
          ]
        }
      ];
    } else if (this.rol === 'soporte') {
      this.modulos = [
        {
          nombre: 'Seguridad',
          icono: 'fa fa-shield-alt',
          vistas: [
            { nombre: 'Personas y Usuarios', ruta: 'seguridad/registros_persona_usuario' },
            { nombre: 'Modulos', ruta: 'seguridad/registros_modulo' }
          ]
        }
      ];
    }
  }

  // Método para alternar la expansión de los módulos
  toggleModuleExpansion(modulo: any) {
    modulo.expanded = !modulo.expanded;
  }

  // Método para alternar la expansión de los submódulos
  toggleSubmoduleExpansion(submodulo: any) {
    submodulo.expanded = !submodulo.expanded;
  }
}
