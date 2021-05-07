import { getRepository } from "typeorm";
import { User } from "../entity";
import { LoginInput, LoginType } from "../schema";
import { AuthError } from "../core/error/error-messages";
import { CryptoService } from "../core/security/crypto";

export async function validateLogin(arg: LoginInput): Promise<LoginType> {
  const { password, email } = arg;

  const repository = getRepository(User);
  const user = await repository.findOne({ email });

  if (!user) {
    throw new AuthError("Usuário não cadastrado.", 404, "User not found.");
  }
  if (user?.password !== CryptoService.encode(password)) {
    throw new AuthError("Senha inválida.", 421, "Unauthorized");
  }

  const token = "the_token";
  return {
    token,
    user,
  };
}
