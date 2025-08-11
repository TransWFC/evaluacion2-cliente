export interface User {
    id: number;
    email: string;
    userName: string;
    role: 'Admin' | 'User';
}