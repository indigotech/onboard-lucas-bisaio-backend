import { validateUser } from "../domain/user-validation.use-case";
import { LoginInput, LoginType, UserInput, UserType } from "./schema.types";
import { User } from "../entity";
import { getRepository } from "typeorm";
import { CryptoService } from "../core/security/crypto";

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

    login: async (_: any, { data: args }: { data: LoginInput }): Promise<LoginType> => {
      const user = {
        id: 12,
        name: "User Name",
        email: args.email,
        birthDate: "04-25-1990",
      };
      const token = "the_token";
      return { token, user };
    },
  },
};
