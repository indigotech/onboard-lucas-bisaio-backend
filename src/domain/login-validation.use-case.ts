import { getRepository } from "typeorm";
import { User } from "../entity";
import { LoginInput, LoginType } from "../schema/schema.types";
import { AuthError, NotFoundError } from "../core/error/error-messages";
import { CryptoService } from "../core/security/crypto";
import { JWTService } from "../core/security/jwt";

export async function validateLogin(arg: LoginInput): Promise<LoginType> {
  const { password, email, rememberMe } = arg;

  const user = await getRepository(User).findOne({ email });

  if (!user) {
    throw new NotFoundError();
  }

  if (user?.password !== CryptoService.encode(password)) {
    throw new AuthError();
  }

  const name = user.name;
  const token = JWTService.sign({ id: user.id, rememberMe });

  return {
    token,
    user,
  };
}
