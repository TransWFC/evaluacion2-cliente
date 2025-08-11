import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Loan, LoanRequestDTO, ReturnBookDTO, LoanStatistics, LoanStatus } from '../../shared/models/loan.model';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  constructor(private http: HttpClient) { }

  // Obtener todos los préstamos (Admin y Bibliotecario)
  getAllLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(API_ENDPOINTS.LOANS.GET_ALL);
  }

  // Obtener mis préstamos
  getMyLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(API_ENDPOINTS.LOANS.GET_MY_LOANS);
  }

  // Obtener mis préstamos activos
  getMyActiveLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(API_ENDPOINTS.LOANS.GET_MY_ACTIVE_LOANS);
  }

  // Obtener préstamos vencidos (Admin y Bibliotecario)
  getOverdueLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(API_ENDPOINTS.LOANS.GET_OVERDUE);
  }

  // Obtener préstamos de un usuario específico (Admin)
  getUserLoans(username: string): Observable<Loan[]> {
    return this.http.get<Loan[]>(API_ENDPOINTS.LOANS.GET_USER_LOANS(username));
  }

  // Crear préstamo (Admin y Bibliotecario)
  createLoan(loanRequest: LoanRequestDTO): Observable<Loan> {
    return this.http.post<Loan>(API_ENDPOINTS.LOANS.CREATE, loanRequest);
  }

  // Solicitar préstamo (Todos los usuarios)
  requestLoan(loanRequest: LoanRequestDTO): Observable<Loan> {
    return this.http.post<Loan>(API_ENDPOINTS.LOANS.REQUEST, loanRequest);
  }

  // Devolver libro (Admin y Bibliotecario)
  returnBook(loanId: string, returnData: ReturnBookDTO): Observable<void> {
    return this.http.put<void>(API_ENDPOINTS.LOANS.RETURN(loanId), returnData);
  }

  // Actualizar estado del préstamo (Admin)
  updateLoanStatus(loanId: string, status: LoanStatus): Observable<void> {
    return this.http.put<void>(API_ENDPOINTS.LOANS.UPDATE_STATUS(loanId), { status });
  }

  // Obtener estadísticas (Admin y Bibliotecario)
  getLoanStatistics(): Observable<LoanStatistics> {
    return this.http.get<LoanStatistics>(API_ENDPOINTS.LOANS.STATISTICS);
  }
}