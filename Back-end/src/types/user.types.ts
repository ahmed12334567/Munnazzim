export type UserRole = 'admin' | 'user' | 'viewer';

export interface User {
    username?: string;
    email: string;
    password: string;
    role: UserRole;
}