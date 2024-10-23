import { gql } from "apollo-server-express";

const reviewSchema = gql`
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

export default reviewSchema;
