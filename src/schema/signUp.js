"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const signUpSchema = (0, apollo_server_express_1.gql) `
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
exports.default = signUpSchema;
