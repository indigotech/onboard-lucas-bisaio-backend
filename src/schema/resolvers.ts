import { validateUser } from "../domain/user-validation.use-case";
import { UserResponse } from "./typedefs";
import { User } from "../entity";
import { getRepository } from "typeorm";
import { CryptoService } from "../core/security/crypto";

export const resolvers = {
  Query: {
    hello: () => "Hello World!",
  },

  Mutation: {
    createUser: async (_: any, { user: args }: { user: UserResponse }) => {
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
  },
};
