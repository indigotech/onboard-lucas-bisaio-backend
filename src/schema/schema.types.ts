export interface UserType {
  id: number;
  name: string;
  email: string;
  birthDate?: string;
}

export interface UserInput {
  name: string;
  email: string;
  password: string;
  birthDate?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginType {
  token: string;
  user: UserType;
}
