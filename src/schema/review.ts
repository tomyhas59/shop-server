import { gql } from "apollo-server-express";

const reviewSchema = gql`
  type Review {
    id: ID!
    productId: ID!
    content: String!
    rating: Int!
    userId: String!
    createdAt: String!
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
      uid: ID!
      content: String!
      rating: Int!
    ): Review
    deleteReview(id: ID!, uid: ID!): ID!
  }
`;

export default reviewSchema;
