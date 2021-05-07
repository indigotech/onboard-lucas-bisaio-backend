import { getRepository } from "typeorm";
import { CryptoService } from "../core/security/crypto";
import { validateLogin } from "../domain/login-validation.use-case";
import { validateUser } from "../domain/user-validation.use-case";
import { LoginInput, LoginType, UserInput, UserType } from "./schema.types";
import { User } from "../entity";

export const resolvers = {
  Query: {
    hello: () => "Hello World!",
  },

  Mutation: {
    createUser: async (_: any, { user: args }: { user: UserInput }): Promise<UserType> => {
      const user = new User();
      user.name = args.name;
      user.email = args.email;
      user.password = args.password;
      user.birthDate = args.birthDate;

      await validateUser(user);

      user.password = CryptoService.encode(args.password);

      const newUser = await getRepository(User).save(user);
      return newUser;
    },

    login: async (_: any, { data: args }: { data: LoginInput }) => {
      const { token, user } = await validateLogin(args);

      return { token, user };
    },
  },
};
