import { DBField, writeDB } from "../dbController";
import { Products, Resolvers } from "./types";
import { v4 as uuid } from "uuid";

const setJSON = (data: Products) => writeDB(DBField.PRODUCTS, data);

const productResolver: Resolvers = {
  Query: {
    products: (
      parent,
      /**args */ { cursor = "", showDeleted = false },
      context
    ) => {
      const [hasCreatedAt, noCreatedAt] = [
        context.db.products
          .filter((product) => !!product.createdAt)
          .sort((a, b) => b.createdAt! - a.createdAt!),
        context.db.products.filter((product) => !product.createdAt),
      ];
      const filteredDB = showDeleted
        ? [...hasCreatedAt, ...noCreatedAt]
        : hasCreatedAt;

      const fromIndex =
        filteredDB.findIndex((product) => product.id === cursor) + 1;
      return filteredDB.slice(fromIndex, fromIndex + 15) || [];
    },
    product: (parent, { id }, { db }) => {
      const found = db.products.find((item) => item.id === id);
      if (found) return found;
      return null;
    },
  },

  Mutation: {
    addProduct: (
      parent,
      { imageUrl, price, title, description },
      { db },
      info
    ) => {
      const newProduct = {
        id: uuid(),
        imageUrl,
        price,
        title,
        description,
        createdAt: Date.now(),
      };
      db.products.push(newProduct);
      setJSON(db.products);
      return newProduct;
    },
    updateProduct: (parent, { id, ...data }, { db }, info) => {
      const existProductIndex = db.products.findIndex((item) => item.id === id);

      if (existProductIndex < 0) {
        throw new Error("없는 데이터입니다");
      }
      const updatedProduct = { ...db.products[existProductIndex], ...data };

      db.products.splice(existProductIndex, 1, updatedProduct);
      setJSON(db.products);
      return updatedProduct;
    },
    deleteProduct: (parent, { id }, { db }) => {
      const existProductIndex = db.products.findIndex((item) => item.id === id);
      if (existProductIndex < 0) {
        throw new Error("없는 데이터입니다");
      }
      if (existProductIndex > -1) {
        db.products.splice(existProductIndex, 1);
        setJSON(db.products);
        return id;
      }
    },
  },
};

export default productResolver;
