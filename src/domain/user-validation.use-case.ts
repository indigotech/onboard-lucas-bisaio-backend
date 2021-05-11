import { getRepository } from "typeorm";
import { User } from "../entity";
import { UserInput } from "../schema";
import { ValidatePasswordUseCase } from "./password-validation.use-case";
import { AuthError, ErrorMessage } from "../core/error/error-messages";
import { JWTService } from "../core/security/jwt";

export async function validateUser(user: UserInput): Promise<void> {
  const { password, email } = user;

  const validPassword = ValidatePasswordUseCase.exec(password);

  if (!validPassword) {
    throw new AuthError(ErrorMessage.badlyFormattedPassword);
  }
  const repository = getRepository(User);

  const hasAnotherUser = await repository.findOne({ email });
  if (hasAnotherUser) {
    throw new AuthError(ErrorMessage.email);
  }
}

export function verifyAuthOrFail(context: any): boolean {
  if (!context.token) {
    throw new AuthError(ErrorMessage.token.invalid, "Token not found");
  }

  const isValid = JWTService.verify(context.token);
  return !!isValid;
}
