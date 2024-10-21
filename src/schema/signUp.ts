import { gql } from "apollo-server-express";

const signUpSchema = gql`
  type User {
    uid: ID!
    email: String!
    nickname: String!
    reviews: [Review]!
  }

  type Review {
    id: ID!
    productId: ID!
    content: String!
    rating: Int!
    userId: String!
    createdAt: String!
    user: User!
  }

  type SignUp {
    uid: ID
    email: String
    nickname: String
  }

  type SignIn {
    uid: ID!
    email: String!
  }
  extend type Query {
    user: User
  }

  extend type Mutation {
    signUp(email: String, password: String, nickname: String): SignUp
    signIn(email: String!, password: String!): SignIn!
    signOut: Boolean
  }
`;

export default signUpSchema;
