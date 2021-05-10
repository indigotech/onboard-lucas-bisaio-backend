import { gql } from "apollo-server";

export const typeDefs = gql`
  input UserInput {
    name: String!
    email: String!
    password: String!
    birthDate: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type UserType {
    id: ID!
    name: String!
    email: String!
    birthDate: String
  }

  type LoginType {
    token: String!
    user: UserType!
  }

  type Mutation {
    createUser(user: UserInput!): UserType
    login(data: LoginInput!): LoginType
  }

  type Query {
    hello: String
  }
`;
