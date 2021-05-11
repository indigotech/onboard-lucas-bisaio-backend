import { gql } from "apollo-server";

export const typeDefs = gql`
  input CreateUserInput {
    name: String!
    email: String!
    password: String!
    birthDate: String
  }

  input LoginInput {
    email: String!
    password: String!
    rememberMe: Boolean
  }

  input UserInput {
    id: ID!
  }

  input UsersInput {
    take: ID
    skip: ID
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

  type UsersType {
    users: [UserType]!
    count: ID!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type Mutation {
    createUser(data: CreateUserInput!): UserType!
    login(data: LoginInput!): LoginType!
  }

  type Query {
    hello: String!
    user(data: UserInput!): UserType!
    users(data: UsersInput): UsersType!
  }
`;
