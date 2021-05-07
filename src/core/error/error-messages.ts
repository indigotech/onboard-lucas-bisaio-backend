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
  constructor(message?: string, code?: number, details?: string) {
    super(
      message ?? "Credenciais inválidas. Tente novamente.",
      code ?? 401,
      details
    );
  }
}

export class InternalError extends BaseError {
  constructor(messege?: string, code?: number, details?: string) {
    super(
      messege ?? "Erro do servidor. Tente novamente mais tarde.",
      code ?? 500,
      details
    );
  }
}

export const formatError = (error: GraphQLError) => {
  const originalError = error.originalError as BaseError;

  if (!originalError?.base) {
    return {
      message: "Erro não identificado. Contate o desenvolvedor.",
      code: 500,
      detail: error.message,
    };
  }
  return {
    message: originalError.message,
    code: originalError.code,
    detail: originalError.details,
  };
};

export const ErrorMessage = {
  password:
    "Senha inválida. Deve conter ao menos uma letra e uma número, e ao menos 7 caracters.",
  email: "E-mail já cadastrado.",
};
