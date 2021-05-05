import { User } from "../entity";
import { UserResponse } from "../schema/typedefs";
import { Database } from "../database.config";
import { validatePassword } from "./password-validation.use-case";
import { ErrorMessege } from "../core/error/error-messages";

export async function userValidator(user: UserResponse): Promise<boolean> {
  const { password, email } = user;

  const validPassword = validatePassword.check(password);

  if (!validPassword) {
    throw new Error(ErrorMessege.password);
  }

  const repository = Database.connection.getRepository(User);

  const hasAnotherUser = await repository.findOne({ email });
  if (hasAnotherUser) {
    throw new Error(ErrorMessege.email);
  }

  return validPassword && !hasAnotherUser;
}
