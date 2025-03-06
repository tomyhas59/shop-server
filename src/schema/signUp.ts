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

  extend type Query {
    user: User
  }

  extend type Mutation {
    signUp(email: String, password: String, nickname: String): SignUp
  }
`;

export default signUpSchema;
