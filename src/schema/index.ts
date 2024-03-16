import { gql } from "apollo-server-express";
import productSchema from "./product";
import cartSchema from "./cart";

const linckSchema = gql`
  type Query {
    _: Boolean #임시 쿼리
  }
  type Mutation {
    _: Boolean
  }
`;

export default [linckSchema, productSchema, cartSchema];
