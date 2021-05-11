export interface UserType {
  id: number;
  name: string;
  email: string;
  birthDate?: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  birthDate?: string;
}

export interface LoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginType {
  token: string;
  user: UserType;
}
