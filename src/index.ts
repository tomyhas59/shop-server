const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const schema = require("./schema");
const resolvers = require("./resolvers");
const cors = require("cors");

const isProduction = process.env.NODE_ENV === "production";

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const app = express();

// Enable CORS middleware
app.use(
  cors({
    origin: isProduction
      ? ["https://tmshop.vercel.app", "https://studio.apollographql.com"]
      : ["http://localhost:3000", "https://studio.apollographql.com"],
    credentials: true,
  })
);

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
