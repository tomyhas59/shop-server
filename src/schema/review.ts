import { gql } from "apollo-server-express";

const reviewSchema = gql`
  type Review {
    id: ID!
    content: String!
    rating: Int!
    createdAt: String!
    user: User
  }

  extend type Query {
    reviews(productId: ID!, userId: ID!): [Review]
  }

  extend type Mutation {
    addReview(
      productId: ID!
      content: String!
      rating: Int!
      userId: ID!
    ): Review!
    updateReview(
      id: ID!
      productId: ID!
      content: String!
      rating: Int!
      user: User
    ): Review
    deleteReview(id: ID!, userId: ID!): ID!
  }
`;

export default reviewSchema;
