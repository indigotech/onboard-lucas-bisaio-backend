export class AuthError extends Error {
  constructor(message?: string) {
    super(message ?? "Unauthorizated");
  }
}

export const ErrorMessage = {
  password:
    "Senha inválida. Deve conter ao menos uma letra e uma número, e ao menos 7 caracters.",
  email: "E-mail já cadastrado.",
};
