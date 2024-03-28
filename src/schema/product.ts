import { gql } from "apollo-server-express";

const productSchema = gql`
  type Product {
    id: ID!
    imageUrl: String!
    price: Int!
    title: String!
    description: String
    createAt: String
  }

  extend type Query {
    products(cursor: ID!): [Product!] #-->프론트 graphql 넘겨주기
    product(id: ID!): Product!
  }
`;

export default productSchema;

/* const GET_PRODUCT = gql`
  query GET_PRODUCT($id: ID!) {
    id
    imageUrl
    price
    title
    description
    createAt
  }
`; */
