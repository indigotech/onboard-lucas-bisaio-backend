"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = exports.typeDefs = void 0;
var apollo_server_1 = require("apollo-server");
exports.typeDefs = apollo_server_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  input UserInput {\n    name: String!\n    email: String!\n    password: String!\n    birthDate: String\n  }\n\n  type User {\n    id: ID!\n    name: String!\n    email: String!\n    birthDate: String\n  }\n\n  type Mutation {\n    createUser(user: UserInput): User\n  }\n\n  type Query {\n    hello: String\n  }\n"], ["\n  input UserInput {\n    name: String!\n    email: String!\n    password: String!\n    birthDate: String\n  }\n\n  type User {\n    id: ID!\n    name: String!\n    email: String!\n    birthDate: String\n  }\n\n  type Mutation {\n    createUser(user: UserInput): User\n  }\n\n  type Query {\n    hello: String\n  }\n"])));
exports.resolvers = {
    Query: {
        hello: function () { return "Hello World!"; },
    },
    Mutation: {
        createUser: function (_parent, _a) {
            var args = _a.user;
            var user = {
                id: Math.floor(Math.random() * 10000),
                name: args.name,
                email: args.email,
                birthDate: args.birthDate,
            };
            return user;
        },
    },
};
var templateObject_1;
