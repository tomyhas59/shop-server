"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const cartSchema = (0, apollo_server_express_1.gql) `
  type CartItem {
    id: ID!
    amount: Int!
    product: Product!
  }

  #GraphQL 스키마에서 Query 타입을 확장하여 새로운 필드를 추가
  extend type Query {
    cart(uid: ID!): [CartItem!]
    orders(uid: ID!): [CartItem!]
  }

  extend type Mutation {
    addCart(uid: ID!, productId: ID!): CartItem!
    updateCart(cartId: ID!, amount: Int!): CartItem!
    deleteCart(cartId: ID!): ID!
    deleteAllCart: ID!
    executePay(uid: ID!, ids: [ID!]): [ID!]
    deleteOrders(ordersId: ID!): ID!
    deleteAllOrders: ID!
  }
`;
exports.default = cartSchema;
