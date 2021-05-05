import { Database } from "../database.config";
import { User } from "../entity";

interface TypeUser {
  id: number;
  name: string;
  email: string;
  birthDate?: string;
}

export const resolvers = {
  Query: {
    hello: () => "Hello World!",
  },

  Mutation: {
    createUser: async (_parent: any, { user: args }: { user: TypeUser }) => {
      const user = new User();
      user.name = args.name;
      user.email = args.email;
      user.birthDate = args.birthDate;

      const newUser = await Database.connection.manager.save(user);
      console.log("User has been saved. user id is", newUser.id);
      return newUser;
    },
  },
};
