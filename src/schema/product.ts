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
    products(cursor: ID!): [Product!]
    product(id: ID!): Product!
  }
`;

export default productSchema;

/* const GET_PRODUCT = gql`
  query GET_PRODUCT($id: string) {
    id
    imageUrl
    price
    title
    description
    createAt
  }
`; */
