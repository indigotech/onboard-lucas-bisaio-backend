import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './schema';
import { createServer } from 'http'; 
import express from 'express';

// The root provides a resolver function for each API endpoint
const resolvers = {
  Query: {
    hello: () => "Hello World!",
  },
};

const app = express();
const server = new ApolloServer({
  resolvers, typeDefs,
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = createServer(app);
const PORT = 4000

httpServer
  .listen({port: PORT}, (): void => console.log(`Listenning at http://localhost:${PORT}/graphql`))
