import { gql } from "apollo-server-express";

const reviewSchema = gql`
  type Review {
    id: ID!
    productId: ID!
    userId: String!
    content: String!
    rating: Int!
    createdAt: String!
  }

  extend type Query {
    reviews(productId: ID!): [Review!]
  }

  extend type Mutation {
    addReview(productId: ID!, content: String!, rating: Int!): Review!
    updateReview(
      id: ID!
      productId: ID!
      content: String!
      rating: Int!
    ): Review
    deleteReview(id: ID!): ID!
  }
`;

export default reviewSchema;
