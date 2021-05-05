import { User } from "../entity";
import { UserResponse } from "../schema/typedefs";
import { Database } from "../database.config";
import { validatePassword } from "./password-validation.use-case";
import { AuthError, ErrorMessage } from "../core/error/error-messages";

export async function validateUser(user: UserResponse): Promise<void> {
  const { password, email } = user;

  const validPassword = validatePassword.check(password);

  if (!validPassword) {
    throw new AuthError(ErrorMessage.password);
  }
  const repository = Database.connection.getRepository(User);

  const hasAnotherUser = await repository.findOne({ email });
  if (hasAnotherUser) {
    throw new AuthError(ErrorMessage.email);
  }
}
