import { getRepository } from "typeorm";
import { CryptoService } from "../core/security/crypto";
import { NotFoundError, InputError } from "../core/error/error-messages";
import { validateLogin } from "../domain/login-validation.use-case";
import { validateUser, verifyAuthOrFail } from "../domain/user-validation.use-case";
import { LoginInput, LoginType, CreateUserInput, UserType, UserInput, UsersInput, UsersType } from "./schema.types";
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
    users: async (_: any, { data: args }: { data: UsersInput }, context: any): Promise<UsersType> => {
      verifyAuthOrFail(context);
      const skip = args?.skip ?? 0;
      const take = args?.take ?? 10;

      if (skip && skip < 0) {
        throw new InputError(undefined, "`skip` should not be negative");
      }

      if (take && take <= 0) {
        throw new InputError(undefined, "`take` should be positive not null");
      }

      const count = await getRepository(User).count();
      const hasPreviousPage = skip > 0;
      const hasNextPage = skip + take < count;

      const users = await getRepository(User)
        .createQueryBuilder("user")
        .orderBy({ name: "ASC" })
        .take(take)
        .skip(skip)
        .getMany();

      return { users, count, hasNextPage, hasPreviousPage };
    },
  },

  Mutation: {
    createUser: async (_: any, { data: args }: { data: CreateUserInput }, context: any): Promise<UserType> => {
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

    login: (_: any, { data: args }: { data: LoginInput }): Promise<LoginType> => {
      return validateLogin(args);
    },
  },
};
