"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const reviewSchema = (0, apollo_server_express_1.gql) `
  type Review {
    id: ID!
    content: String!
    rating: Int!
    createdAt: String!
    uid: ID!
    user: User!
  }

  extend type Query {
    reviews(productId: ID!): [Review]
  }

  extend type Mutation {
    addReview(productId: ID!, content: String!, rating: Int!, uid: ID!): Review!
    updateReview(
      id: ID!
      productId: ID!
      content: String!
      rating: Int!
    ): Review
    deleteReview(reviewId: ID!): ID!
  }
`;
exports.default = reviewSchema;
