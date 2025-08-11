import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { API_ENDPOINTS } from '../../shared/constants/api-endpoints';
import { LoginRequest, RegisterRequest, AuthResponse } from '../../shared/models/auth.model';
import { User } from '../../shared/models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private tokenKey = environment.tokenKey;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = this.getUserFromToken();
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials)
      .pipe(
        tap(response => {
          if (response && response.token) {
            this.saveToken(response.token);
            this.currentUserSubject.next(response.user);
          }
        }),
        map(response => response)
      );
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(API_ENDPOINTS.AUTH.REGISTER, userData);
  }

  logout(): void {
    // Llamar al endpoint de logout si existe
    this.http.post(API_ENDPOINTS.AUTH.LOGOUT, {}).pipe(
      catchError(() => of(null))
    ).subscribe();

    // Limpiar token y usuario local
    this.removeToken();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  verifyToken(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return of(null);
    }

    return this.http.get(API_ENDPOINTS.AUTH.VERIFY).pipe(
      tap(response => {
        if (response) {
          const user = this.getUserFromToken();
          this.currentUserSubject.next(user);
        }
      }),
      catchError(() => {
        this.removeToken();
        this.currentUserSubject.next(null);
        return of(null);
      })
    );
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const payload = this.getTokenPayload(token);
      const exp = payload?.exp;
      if (exp) {
        const expirationDate = new Date(exp * 1000);
        return expirationDate > new Date();
      }
      return true;
    } catch {
      return false;
    }
  }

  getUserRole(): string | null {
    const user = this.currentUserValue;
    return user ? user.role : null;
  }

  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const userRole = this.getUserRole();
    return userRole ? roles.includes(userRole) : false;
  }

  isAdmin(): boolean {
    return this.hasRole('Administrador');
  }

  isBibliotecario(): boolean {
    return this.hasRole('Bibliotecario');
  }

  isUsuarioRegistrado(): boolean {
    return this.hasRole('UsuarioRegistrado');
  }

  canManageBooks(): boolean {
    return this.hasAnyRole(['Administrador', 'Bibliotecario']);
  }

  canManageLoans(): boolean {
    return this.hasAnyRole(['Administrador', 'Bibliotecario']);
  }

  canDeleteBooks(): boolean {
    return this.hasRole('Administrador');
  }

  private getUserFromToken(): User | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const payload = this.getTokenPayload(token);
      if (payload) {
        return {
          id: payload.userId || '',
          username: payload.unique_name || payload.name || '',
          email: payload.email || '',
          role: payload.role || 'UsuarioRegistrado'
        };
      }
    } catch (error) {
      console.error('Error parsing token:', error);
    }

    return null;
  }

  private getTokenPayload(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}