"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_express_1 = require("apollo-server-express");
var schema_1 = require("./schema");
var http_1 = require("http");
var express_1 = __importDefault(require("express"));
var database_config_1 = require("./database.config");
database_config_1.configDatabase()
    .then(function (database) {
    console.log("DB configured");
})
    .catch(console.log);
var app = express_1.default();
var server = new apollo_server_express_1.ApolloServer({
    resolvers: schema_1.resolvers,
    typeDefs: schema_1.typeDefs,
});
server.applyMiddleware({ app: app, path: "/graphql" });
var httpServer = http_1.createServer(app);
var PORT = 4000;
httpServer.listen({ port: PORT }, function () {
    return console.log("Listenning at http://localhost:" + PORT + "/graphql");
});
