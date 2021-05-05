import { validateUser } from "../domain/user-validation.use-case";
import { UserResponse } from "./typedefs";
import { Database } from "../database.config";
import { User } from "../entity";

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

      const newUser = await Database.connection.manager.save(user);
      return newUser;
    },
  },
};
