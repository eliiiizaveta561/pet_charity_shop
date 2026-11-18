export type Role = 'customer' | 'admin';

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  name: string;
}
