export interface Loan {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  username: string;
  loanDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: LoanStatus;
  notes?: string;
  processedBy?: string;
  isOverdue?: boolean;
}

export enum LoanStatus {
  Active = 'Active',
  Returned = 'Returned',
  Overdue = 'Overdue',
  Lost = 'Lost'
}

export interface LoanRequestDTO {
  bookId: string;
  loanDays?: number;
  notes?: string;
  username?: string; // Para admin/bibliotecario
}

export interface ReturnBookDTO {
  loanId: string;
  notes?: string;
  status?: LoanStatus;
}

export interface LoanStatistics {
  totalActiveLoans: number;
  totalOverdueLoans: number;
  timestamp: Date;
}