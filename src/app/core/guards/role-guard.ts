import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles = route.data['roles'] as string[];

    if (!expectedRoles || expectedRoles.length === 0) {
      return true;
    }

    if (this.authService.hasAnyRole(expectedRoles)) {
      return true;
    }

    // No tiene el rol requerido
    this.snackBar.open('No tiene los permisos necesarios para acceder a esta sección', 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['warning-snackbar']
    });

    this.router.navigate(['/books']);
    return false;
  }
}