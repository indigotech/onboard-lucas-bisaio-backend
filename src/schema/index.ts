import { gql } from 'apollo-server';

// Construct a schema, using GraphQL schema language
export const typeDefs = gql`
  type Query {
    hello: String
  }
`;


