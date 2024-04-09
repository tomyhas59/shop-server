import { DBField, writeDB } from "../dbController";
import { db } from "../../firebase";
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
  serverTimestamp,
  addDoc,
  updateDoc,
  deleteDoc,
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
      const queryOptions: any[] = [orderBy("createdAt", "desc")];
      if (cursor) queryOptions.push(startAfter(cursor));
      if (!showDeleted) queryOptions.unshift(where("createdAt", "!=", null));
      const q = query(products, ...queryOptions, limit(PAGE_SIZE));
      const snapshot = await getDocs(q);
      const data: DocumentData[] = [];
      snapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      console.log(data);
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
    addProduct: async (
      parent,
      { imageUrl, price, title, description },
      info
    ) => {
      const newProduct = {
        imageUrl,
        price,
        title,
        description,
        createdAt: serverTimestamp(),
      };
      const result = await addDoc(collection(db, "products"), newProduct);
      const snapshot = await getDoc(result);
      return {
        ...snapshot.data(),
        id: snapshot.id,
      };
    },
    updateProduct: async (parent, { id, ...data }, info) => {
      const productRef = doc(db, "products", id);

      if (!productRef) throw new Error("없는 데이터입니다");
      await updateDoc(productRef, data);
      const snap = await getDoc(productRef);

      return {
        ...snap.data(),
        id: snap.id,
      };
    },
    deleteProduct: async (parent, { id }) => {
      const productRef = doc(db, "products", id);
      if (!productRef) throw new Error("없는 데이터입니다");
      await updateDoc(productRef, { createdAt: null });
      return id;
    },
  },
};

export default productResolver;
