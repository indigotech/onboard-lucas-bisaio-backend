import { userValidator } from "../domain/user-validation.use-case";
import { UserResponse } from "./typedefs";
import { User } from "../entity";
import { getRepository } from "typeorm";

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

      const isValid = await userValidator(user);

      if (!isValid) {
        throw new Error("Tratar isso aqui! - Usuario inválido");
      }

      const newUser = await getRepository(User).save(user);
      console.log("User has been saved. user id is", newUser.id);
      return newUser;
    },
  },
};
