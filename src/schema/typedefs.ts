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
    take: Int = 10
    skip: Int = 0
  }

  type UserType {
    id: ID!
    name: String!
    email: String!
    address: [AddressType!]
    birthDate: String
  }

  type LoginType {
    token: String!
    user: UserType!
  }

  type UsersType {
    users: [UserType!]
    count: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type AddressType {
    id: Int!
    state: String!
    city: String!
    neighborhood: String!
    street: String!
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
