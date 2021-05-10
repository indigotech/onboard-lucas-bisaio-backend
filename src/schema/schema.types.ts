export interface UserResponse {
  id: number;
  name: string;
  email: string;
  password: string;
  birthDate?: string;
}

export interface UserInput {
  name: string;
  email: string;
  password: string;
  birthDate?: string;
}
