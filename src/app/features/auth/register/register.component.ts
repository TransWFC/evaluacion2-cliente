import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegisterRequest } from '../../../shared/models/auth.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})

export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirm = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(5)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  ngOnInit(): void {}

  get f() {
    return this.registerForm.controls;
  }

  private passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    if (!pass || !confirm) return null;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.loading = true;

    const payload = {
      username: this.f['username'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
      // Si tu API requiere más campos, agrégalos aquí.
      // role: 'UsuarioRegistrado'
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.snackBar.open(res?.message || 'Cuenta creada exitosamente', 'Cerrar', {
          duration: 3500,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['success-snackbar'],
        });
        // tras registro, manda a login
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.loading = false;
        let msg = 'No se pudo completar el registro';
        if (error.status === 409) msg = 'El usuario ya existe';
        else if (error.status === 0) msg = 'No hay conexión con el servidor';
        else if (error.error?.message) msg = error.error.message;

        this.snackBar.open(msg, 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // helpers de errores
  getUsernameErrorMessage(): string {
    if (this.f['username'].hasError('required')) return 'El nombre de usuario es requerido';
    if (this.f['username'].hasError('minlength')) return 'Debe tener al menos 3 caracteres';
    return '';
  }

  getEmailErrorMessage(): string {
    if (this.f['email'].hasError('required')) return 'El email es requerido';
    if (this.f['email'].hasError('email')) return 'Email inválido';
    return '';
  }

  getPasswordErrorMessage(): string {
    if (this.f['password'].hasError('required')) return 'La contraseña es requerida';
    if (this.f['password'].hasError('minlength')) return 'Debe tener al menos 5 caracteres';
    return '';
  }

  getConfirmPasswordErrorMessage(): string {
    if (this.f['confirmPassword'].hasError('required')) return 'Confirma la contraseña';
    if (this.registerForm.hasError('passwordMismatch')) return 'Las contraseñas no coinciden';
    return '';
  }
}
