import { gql } from "apollo-server";

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
