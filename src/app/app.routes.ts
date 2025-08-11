// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },

  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth-module').then(m => m.AuthModule),
  },
  {
    path: 'books',
    loadChildren: () =>
      import('./features/books/books-module').then(m => m.BooksModule),
  },
  {
    path: 'loans',
    loadChildren: () =>
      import('./features/loans/loans-module').then(m => m.LoansModule),
  },

  { path: '**', redirectTo: 'books' },
];
