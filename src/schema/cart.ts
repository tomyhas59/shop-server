import { gql } from "apollo-server-express";

const cartSchema = gql`
  type CartItem {
    id: ID!
    amount: Int!
    product: Product!
  }

  #GraphQL 스키마에서 Query 타입을 확장하여 새로운 필드를 추가
  extend type Query {
    cart: [CartItem!]
  }

  extend type Mutation {
    addCart(id: ID!): CartItem!
    updateCart(id: ID!, amount: Int!): CartItem!
    deleteCart(id: ID!): ID!
    deleteAllCart: ID!
    executePay(ids: [ID!]): [ID!]
  }
`;

export default cartSchema;
