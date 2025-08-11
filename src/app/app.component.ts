import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
  // Removido standalone: true
})
export class AppComponent implements OnInit {
  title = 'Sistema de Biblioteca';
  isLoggedIn = false;
  username: string | null = null;
  userRole: string | null = null;
  sidenavOpened = true;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      this.username = user?.username || null;
      this.userRole = user?.role || null;
    });

    // Verificar token al iniciar
    this.authService.verifyToken().subscribe();
  }

  toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
  }

  logout() {
    this.authService.logout();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  get canManageBooks(): boolean {
    return this.authService.canManageBooks();
  }

  get canManageLoans(): boolean {
    return this.authService.canManageLoans();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}