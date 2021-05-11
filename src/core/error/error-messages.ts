import { GraphQLError } from "graphql";

abstract class BaseError extends Error {
  public readonly base: boolean = true;
  public code: number;
  public details?: string;

  constructor(message: string, code: number, details?: string) {
    super(message);
    this.code = code ?? 500;
    this.details = details;
  }
}

export class AuthError extends BaseError {
  constructor(message?: string, details?: string) {
    super(message ?? "Credenciais inválidas. Tente novamente.", 401, details ?? "Unauthorized");
  }
}

export class NotFoundError extends BaseError {
  constructor(message?: string, details?: string) {
    super(message ?? "Usuário não encontrado", 404, details ?? "User not found");
  }
}

export class InternalError extends BaseError {
  constructor(messege?: string, details?: string) {
    super(messege ?? "Erro do servidor. Tente novamente mais tarde.", 500, details);
  }
}

export const formatError = (error: GraphQLError) => {
  const originalError = error.originalError as BaseError;

  if (!originalError?.base) {
    return {
      message: "Erro não identificado. Contate o desenvolvedor.",
      code: 500,
      details: error.message,
    };
  }
  return {
    message: originalError.message,
    code: originalError.code,
    details: originalError.details,
  };
};

export const ErrorMessage = {
  badlyFormattedPassword: "Senha inválida. Deve conter ao menos uma letra e uma número, e ao menos 7 caracters.",
  email: "E-mail já cadastrado.",
  token: {
    invalid: "Credenciais inválidas. Tente novamente",
    expired: "Tempo expirado. Faça login novamente",
  },
};
