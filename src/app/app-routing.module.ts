import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';
import { AdminGuard } from './core/guards/admin-guard';
import { RoleGuard } from './core/guards/role-guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/books',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'books',
    loadChildren: () => import('./features/books/books-module').then(m => m.BooksModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'loans',
    loadChildren: () => import('./features/loans/loans-module').then(m => m.LoansModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/books'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: false,
    enableTracing: false // Activar solo para debugging
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }