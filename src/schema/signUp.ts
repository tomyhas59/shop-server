import { gql } from "apollo-server-express";

const signUpSchema = gql`
  type User {
    uid: ID!
    email: String!
    nickname: String!
  }

  type SignUp {
    uid: ID
    email: String
    nickname: String
  }

  type LogIn {
    uid: ID!
    email: String!
  }
  extend type Query {
    user: User
  }

  extend type Mutation {
    signUp(email: String, password: String, nickname: String): SignUp
    signIn(email: String!, password: String!): LogIn!
    signOut(uid: ID!): Boolean
  }
`;

export default signUpSchema;
