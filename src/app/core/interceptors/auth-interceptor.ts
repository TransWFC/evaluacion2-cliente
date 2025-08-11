import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Obtener el token
    const token = this.authService.getToken();
    
    // Clonar la request y añadir el token si existe
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Añadir Content-Type si no está presente
    if (!request.headers.has('Content-Type') && !(request.body instanceof FormData)) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Manejar la respuesta
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expirado o inválido
          this.handleAuthError();
        } else if (error.status === 403) {
          // Sin permisos
          this.handleForbiddenError();
        } else if (error.status === 404) {
          // Recurso no encontrado
          this.handleNotFoundError(error);
        } else if (error.status === 400) {
          // Bad request
          this.handleBadRequestError(error);
        } else if (error.status >= 500) {
          // Error del servidor
          this.handleServerError(error);
        }

        return throwError(() => error);
      })
    );
  }

  private handleAuthError(): void {
    // Limpiar sesión
    this.authService.logout();
    
    // Mostrar mensaje
    this.snackBar.open('Sesión expirada. Por favor, inicie sesión nuevamente.', 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
    
    // Redirigir al login
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: this.router.url }
    });
  }

  private handleForbiddenError(): void {
    this.snackBar.open('No tiene permisos para realizar esta acción.', 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['warning-snackbar']
    });
  }

  private handleNotFoundError(error: HttpErrorResponse): void {
    const message = error.error?.message || 'Recurso no encontrado.';
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['warning-snackbar']
    });
  }

  private handleBadRequestError(error: HttpErrorResponse): void {
    let message = 'Solicitud inválida.';
    
    if (error.error) {
      if (typeof error.error === 'string') {
        message = error.error;
      } else if (error.error.message) {
        message = error.error.message;
      } else if (error.error.errors) {
        // Manejar errores de validación de modelo
        const errors = error.error.errors;
        const errorMessages = [];
        for (const key in errors) {
          if (errors.hasOwnProperty(key)) {
            errorMessages.push(errors[key].join(', '));
          }
        }
        message = errorMessages.join(' ');
      }
    }

    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }

  private handleServerError(error: HttpErrorResponse): void {
    const message = 'Error en el servidor. Por favor, intente más tarde.';
    
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });

    // Log del error para debugging (solo en desarrollo)
    if (!environment.production) {
      console.error('Server Error:', error);
    }
  }
}