"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const productSchema = (0, apollo_server_express_1.gql) `
  type Product {
    id: ID!
    imageUrl: String!
    price: Int!
    title: String!
    description: String
    createdAt: String
    reviewsCount: Int
  }

  extend type Query {
    products(cursor: ID!, showDeleted: Boolean): [Product!] #-->프론트 graphql 넘겨주기
    product(id: ID!): Product!
    allProducts: [Product]
  }

  extend type Mutation {
    addProduct(
      imageUrl: String!
      price: Int!
      title: String!
      description: String!
    ): Product!
    updateProduct(
      id: ID!
      imageUrl: String
      price: Int
      title: String
      description: String
    ): Product!
    deleteProduct(id: ID!): ID!
  }
`;
exports.default = productSchema;
/* const GET_PRODUCT = gql`
  query GET_PRODUCT($id: ID!) {
    id
    imageUrl
    price
    title
    description
    createdAt
    reviewsCount
  }
`; */
