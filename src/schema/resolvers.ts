import { Database } from "../database.config";
import { User } from "../entity";

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

      const newUser = await Database.connection.manager.save(user);
      console.log("User has been saved. user id is", newUser.id);
      return newUser;
    },
  },
};
