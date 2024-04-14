import { gql } from "apollo-server-express";
import productSchema from "./product";
import cartSchema from "./cart";
import signUpSchema from "./signUp";

const linkSchema = gql`
  type Query {
    _: Boolean #임시 쿼리
  }
  type Mutation {
    _: Boolean
  }
`;

export default [linkSchema, productSchema, cartSchema, signUpSchema];
