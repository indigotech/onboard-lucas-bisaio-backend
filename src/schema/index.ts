import { gql } from "apollo-server";

interface UserResponse {
  id: number;
  name: string;
  email: string;
  birthDate?: string;
}

export const typeDefs = gql`
  input UserInput {
    name: String!
    email: String!
    password: String!
    birthDate: String
  }

  type User {
    id: ID!
    name: String!
    email: String!
    birthDate: String
  }

  type Mutation {
    createUser(user: UserInput): User
  }

  type Query {
    hello: String
  }
`;

export const resolvers = {
  Query: {
    hello: () => "Hello World!",
  },

  Mutation: {
    createUser: (_parent: any, { user: args }: { user: UserResponse }) => {
      const user = {
        id: Math.floor(Math.random() * 10000),
        name: args.name,
        email: args.email,
        birthDate: args.birthDate,
      };

      return user;
    },
  },
};
