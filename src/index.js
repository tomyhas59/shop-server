"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const schema_1 = __importDefault(require("./schema"));
const resolvers_1 = __importDefault(require("./resolvers"));
const cors_1 = __importDefault(require("cors"));
const isProduction = process.env.NODE_ENV === "production";
const server = new apollo_server_express_1.ApolloServer({
    typeDefs: schema_1.default,
    resolvers: resolvers_1.default,
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: isProduction
        ? ["https://tmshop.vercel.app", "https://studio.apollographql.com"]
        : ["http://localhost:3000", "https://studio.apollographql.com"],
    credentials: true,
}));
(async () => {
    await server.start();
    server.applyMiddleware({
        app,
        path: "/graphql",
    });
    const port = isProduction ? 8000 : 7000;
    app.listen({ port }, () => {
        console.log("Server running at port", port);
    });
})();
