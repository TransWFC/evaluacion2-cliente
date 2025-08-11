import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../shared/models/auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  hidePassword = true;
  returnUrl: string = '/books';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    // Si ya está logueado, redirigir
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/books']);
    }

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    // Obtener URL de retorno de los parámetros de la ruta o default a '/books'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/books';
  }

  // Getters para facilitar el acceso a los campos del formulario
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    // Verificar si el formulario es válido
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.loading = true;

    const credentials: LoginRequest = {
      username: this.f['username'].value,
      password: this.f['password'].value
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.loading = false;
        
        // Mostrar mensaje de éxito
        this.snackBar.open(`¡Bienvenido ${response.user.username}!`, 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['success-snackbar']
        });

        // Redirigir según el rol del usuario
        this.redirectBasedOnRole(response.user.role);
      },
      error: (error) => {
        this.loading = false;
        
        let errorMessage = 'Error al iniciar sesión';
        
        if (error.status === 401) {
          errorMessage = 'Usuario o contraseña incorrectos';
        } else if (error.status === 0) {
          errorMessage = 'No se pudo conectar con el servidor';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  private redirectBasedOnRole(role: string): void {
    switch (role) {
      case 'Administrador':
        this.router.navigate(['/books']);
        break;
      case 'Bibliotecario':
        this.router.navigate(['/loans']);
        break;
      case 'UsuarioRegistrado':
        this.router.navigate(['/books']);
        break;
      default:
        this.router.navigate([this.returnUrl]);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  // Métodos para mostrar errores de validación
  getUsernameErrorMessage(): string {
    if (this.f['username'].hasError('required')) {
      return 'El nombre de usuario es requerido';
    }
    if (this.f['username'].hasError('minlength')) {
      return 'El nombre de usuario debe tener al menos 3 caracteres';
    }
    return '';
  }

  getPasswordErrorMessage(): string {
    if (this.f['password'].hasError('required')) {
      return 'La contraseña es requerida';
    }
    if (this.f['password'].hasError('minlength')) {
      return 'La contraseña debe tener al menos 5 caracteres';
    }
    return '';
  }
}