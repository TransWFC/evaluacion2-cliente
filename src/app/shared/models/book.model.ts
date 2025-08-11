export interface Book {
  id?: string;
  title: string;
  author: string;
  isbn?: string;
  publisher?: string;
  publicationYear?: number;
  category?: string;
  description?: string;
  availableCopies: number;
  totalCopies: number;
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
  createdBy?: string;
}

export interface BookDTO {
  title: string;
  author: string;
  isbn?: string;
  publisher?: string;
  publicationYear?: number;
  category?: string;
  description?: string;
  totalCopies: number;
}

export interface UpdateBookDTO {
  title: string;
  author: string;
  publisher?: string;
  publicationYear?: number;
  category?: string;
  description?: string;
  totalCopies: number;
}