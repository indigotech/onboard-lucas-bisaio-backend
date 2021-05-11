import { getRepository } from "typeorm";
import { CryptoService } from "../core/security/crypto";
import { NotFoundError } from "../core/error/error-messages";
import { validateLogin } from "../domain/login-validation.use-case";
import { validateUser, verifyAuthOrFail } from "../domain/user-validation.use-case";
import { LoginInput, LoginType, CreateUserInput, UserType, UserInput } from "./schema.types";
import { User } from "../entity";

export const resolvers = {
  Query: {
    hello: () => "Hello World!",
    user: async (_: any, { data: args }: { data: UserInput }, context: any): Promise<UserType> => {
      verifyAuthOrFail(context);

      const user = await getRepository(User).findOne({ id: args.id });
      if (!user) {
        throw new NotFoundError();
      }

      return user;
    },
  },

  Mutation: {
    createUser: async (_: any, { user: args }: { user: CreateUserInput }, context: any): Promise<UserType> => {
      verifyAuthOrFail(context);

      const user = new User();
      user.name = args.name;
      user.email = args.email;
      user.password = args.password;
      user.birthDate = args.birthDate;

      await validateUser(user);
      user.password = CryptoService.encode(args.password);

      return getRepository(User).save(user);
    },

    login: async (_: any, { data: args }: { data: LoginInput }): Promise<LoginType> => {
      return await validateLogin(args);
    },
  },
};
