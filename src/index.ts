import express from "express";
import { ApolloServer } from "apollo-server-express";
import schema from "./schema";
import resolvers from "./resolvers";
import { DBField, readDB } from "./dbController";

(async () => {
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
  });

  const app: any = express();
  await server.start();
  server.applyMiddleware({
    app,
    path: "/graphql",
    cors: {
      origin: ["http://localhost:3000", "https://studio.apollographql.com"],
      credentials: true,
    },
  });
  await app.listen({ port: 8000 });

  readDB(DBField.PRODUCTS);
  console.log("server 실행 중");
})();
