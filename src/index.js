"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const schema_1 = __importDefault(require("./schema"));
const resolvers_1 = __importDefault(require("./resolvers"));
(async () => {
    const isProduction = process.env.NODE_ENV === "production";
    const server = new apollo_server_express_1.ApolloServer({
        typeDefs: schema_1.default,
        resolvers: resolvers_1.default,
    });
    const app = (0, express_1.default)();
    await server.start();
    server.applyMiddleware({
        app,
        path: "/graphql",
        cors: {
            origin: isProduction
                ? ["https://tmshop.vercel.app", "https://studio.apollographql.com"]
                : ["http://localhost:3000", "https://studio.apollographql.com"], //프론트 url
            credentials: true,
        },
    });
    const port = isProduction ? 8000 : 7000;
    await app.listen({ port: port });
    console.log("server 실행 중", port);
})();
