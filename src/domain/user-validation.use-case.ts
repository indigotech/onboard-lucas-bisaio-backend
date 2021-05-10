import { getRepository } from "typeorm";
import { User } from "../entity";
import { UserResponse } from "../schema/schema.types";
import { ValidatePasswordUseCase } from "./password-validation.use-case";
import { AuthError, ErrorMessage } from "../core/error/error-messages";

export async function validateUser(user: UserResponse): Promise<void> {
  const { password, email } = user;

  const validPassword = ValidatePasswordUseCase.exec(password);

  if (!validPassword) {
    throw new AuthError(ErrorMessage.badlyformattedPassword);
  }
  const repository = getRepository(User);

  const hasAnotherUser = await repository.findOne({ email });
  if (hasAnotherUser) {
    throw new AuthError(ErrorMessage.email);
  }
}
