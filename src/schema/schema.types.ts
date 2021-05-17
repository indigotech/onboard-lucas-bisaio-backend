export interface UserType {
  id: number;
  name: string;
  email: string;
  birthDate?: string;
  address: AddressInput[];
}

export interface UserInput {
  id: number;
}

export interface UsersInput {
  take?: number;
  skip?: number;
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

export interface UsersType {
  users: UserType[];
  count: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AddressInput {
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: number;
}
