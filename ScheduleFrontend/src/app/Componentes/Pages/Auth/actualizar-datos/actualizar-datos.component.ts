import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { differenceInYears } from 'date-fns';

@Component({
  selector: 'app-actualizar-datos',
  templateUrl: './actualizar-datos.component.html',
  styleUrls: ['./actualizar-datos.component.css']
})
export class ActualizarDatosComponent implements OnInit {
  actualizarForm: FormGroup;
  fotoPrevia: string | ArrayBuffer | null = null;
  tiposDocumento = ['CC', 'TI', 'CE', 'PP', 'RC', 'RUT', 'NIT'];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.actualizarForm = this.fb.group({
      primerNombre: ['', Validators.required],
      segundoNombre: [''],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', [Validators.required, Validators.min(0)]],
      email: ['', [Validators.required, Validators.email]],
      genero: ['', Validators.required],
      direccion: [''],
      fechaNacimiento: ['', [Validators.required, this.validarEdad]]
    });
  }

  ngOnInit(): void {
    // Cargar datos del usuario aquí (como en versiones anteriores)
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.fotoPrevia = e.target?.result ?? null;  // Si es undefined, asigna null
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  validarEdad(control: any) {
    const fechaNacimiento = new Date(control.value);
    const edad = differenceInYears(new Date(), fechaNacimiento);
    return edad >= 14 && edad <= 85 ? null : { edadInvalida: true };
  }

      // Lógica para enviar los datos


  onSubmit() {
    // Lógica para enviar los datos
  }
}
