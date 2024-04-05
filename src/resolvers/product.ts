import { DBField, writeDB } from "../dbController";
import { db } from "../firebase";
import { Products, Resolvers } from "./types";
import { v4 as uuid } from "uuid";
import {
  collection,
  getDoc,
  limit,
  orderBy,
  query,
  doc,
  DocumentData,
  getDocs,
  where,
  startAfter,
} from "firebase/firestore";

const setJSON = (data: Products) => writeDB(DBField.PRODUCTS, data);

const PAGE_SIZE = 15;

const productResolver: Resolvers = {
  Query: {
    products: async (
      parent,
      /**args */ { cursor = "", showDeleted = false }
    ) => {
      const products = collection(db, "products");
      let queryOptions: any[] = [orderBy("createdAt", "desc")];
      if (!showDeleted) queryOptions.unshift(where("createdAt", "!=", null));
      if (cursor) queryOptions.push(startAfter(cursor));

      const q = query(products, ...queryOptions, limit(PAGE_SIZE));
      const snapshot = await getDocs(q);
      const data: DocumentData[] = [];
      snapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      return data;
    },
    product: async (parent, { id }) => {
      const snapshot = await getDoc(doc(db, "products", id));
      return {
        ...snapshot.data(),
        id: snapshot.id,
      };
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

      db.products[existProductIndex].createdAt = undefined;
      setJSON(db.products);
      return id;
    },
  },
};

export default productResolver;
