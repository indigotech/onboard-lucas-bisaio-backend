import { User } from "../entity";
import { getRepository } from "typeorm";

interface UserResponse {
  id: number;
  name: string;
  email: string;
  password: string;
  birthDate?: string;
}

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

      const newUser = await getRepository(User).save(user);
      return newUser;
    },
  },
};
