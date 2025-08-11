export interface User {
  id: string;
  username: string;
  email: string;
  role: 'Administrador' | 'Bibliotecario' | 'UsuarioRegistrado';
  createdAt?: Date;
  isActive?: boolean;
}