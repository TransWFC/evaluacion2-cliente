import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book, BookDTO, UpdateBookDTO } from '../../shared/models/book.model';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient) { }

  // Obtener todos los libros
  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(API_ENDPOINTS.BOOKS.GET_ALL);
  }

  // Obtener un libro por ID
  getBookById(id: string): Observable<Book> {
    return this.http.get<Book>(API_ENDPOINTS.BOOKS.GET_BY_ID(id));
  }

  // Buscar libros
  searchBooks(searchTerm: string): Observable<Book[]> {
    const params = new HttpParams().set('searchTerm', searchTerm);
    return this.http.get<Book[]>(API_ENDPOINTS.BOOKS.SEARCH, { params });
  }

  // Crear un nuevo libro (Admin y Bibliotecario)
  createBook(book: BookDTO): Observable<Book> {
    return this.http.post<Book>(API_ENDPOINTS.BOOKS.CREATE, book);
  }

  // Actualizar un libro (Admin y Bibliotecario)
  updateBook(id: string, book: UpdateBookDTO): Observable<void> {
    return this.http.put<void>(API_ENDPOINTS.BOOKS.UPDATE(id), book);
  }

  // Eliminar un libro (Solo Admin)
  deleteBook(id: string): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.BOOKS.DELETE(id));
  }

  // Verificar disponibilidad de un libro
  checkAvailability(id: string): Observable<{
    bookId: string;
    title: string;
    isAvailable: boolean;
    availableCopies: number;
    totalCopies: number;
  }> {
    return this.http.get<any>(API_ENDPOINTS.BOOKS.AVAILABILITY(id));
  }
}