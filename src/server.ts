import { ApolloServer } from "apollo-server-express";
import { createServer } from "http";
import express from "express";
import { typeDefs, resolvers } from "./schema";
import { Database } from "./database.config";

Database.config()
  .then(() => {
    console.log("DB configured!");
  })
  .catch(console.log);

const app = express();
const server = new ApolloServer({
  resolvers,
  typeDefs,
});

server.applyMiddleware({ app, path: "/graphql" });

const httpServer = createServer(app);
const PORT = 4000;

httpServer.listen({ port: PORT }, (): void =>
  console.log(`Listenning at http://localhost:${PORT}/graphql`)
);
