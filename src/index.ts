import express from "express";
import { ApolloServer } from "apollo-server-express";
import schema from "./schema";
import resolvers from "./resolvers";

(async () => {
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: null,
  });

  const app = express();
  await server.start();
  server.applyMiddleware({
    app,
    path: "/graphql",
    cors: {
      origin: ["http://localhost:3000"],
      credentials: true,
    },
  });
  await app.listen({ port: 8000 });
  console.log("server 실행 중");
})();
