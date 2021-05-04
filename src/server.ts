import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema";
import { createServer } from "http";
import express from "express";
import { configDatabase } from "./database.config";
import { createUser } from "./entity";

configDatabase()
  .then(async (database) => {
    console.log("DB configured");
    await createUser(database);
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
