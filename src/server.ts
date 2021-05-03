import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema';
 
// The root provides a resolver function for each API endpoint
const resolvers = {
  Query: {
    hello: () => "Hello World!",
  },
};

const server = new ApolloServer({
  resolvers, typeDefs,
});

server
  .listen()
  .then(({ url }) => {
      console.log(`Running a GraphQL API server at ${url}`);
  });
