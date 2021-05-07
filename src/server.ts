import { ApolloServer } from "apollo-server-express";
import { createServer } from "http";
import express from "express";
import dotenv from "dotenv";
import { typeDefs, resolvers } from "./schema";
import { Database } from "./database.config";
import { formatError } from "./core/error";

export const setup = async () => {
  dotenv.config({ path: process.env.TEST === "OK" ? "./.test.env" : "./.env" });

  const configs = {
    port: +process.env.DATABASE_PORT!,
    username: process.env.DATABASE_USERNAME!,
    password: process.env.DATABASE_PASSWORD!,
    database: process.env.DATABASE_NAME!,
  };

  await Database.config(configs);
  console.log("DB configured!");

  const app = express();
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    formatError,
  });

  server.applyMiddleware({ app, path: "/graphql" });

  const httpServer = createServer(app);

  const PORT = +(process.env.SERVER_PORT ?? 4000);

  httpServer.listen({ port: PORT }, (): void =>
    console.log(`Listenning at http://localhost:${PORT}/graphql`)
  );
};
