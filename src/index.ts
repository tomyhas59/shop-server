import express from "express";
import { ApolloServer } from "apollo-server-express";
import schema from "./schema";
import resolvers from "./resolvers";

(async () => {
  const isProduction = process.env.NODE_ENV === "production";

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
