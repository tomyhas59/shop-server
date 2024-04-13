import {
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { DBField, writeDB } from "../dbController";
import { db } from "../../firebase";
import { Cart, Product, Resolvers } from "./types";

const setJSON = (data: Cart) => writeDB(DBField.CART, data);

const cartResolver: Resolvers = {
  Query: {
    cart: async (parent, args) => {
      const cart = collection(db, "cart");
      const cartSnap = await getDocs(cart);
      const data: DocumentData[] = [];
      cartSnap.forEach((doc) => {
        const d = doc.data();
        data.push({
          id: doc.id,
          ...d,
        });
      });

      return data;
    },
  },

  Mutation: {
    addCart: async (parent, { productId }, info) => {
      if (!productId) throw Error("상품 id가 없습니다");
      const productRef = doc(db, "products", productId);
      const cartCollection = collection(db, "cart");
      const exist = await getDocs(
        query(cartCollection, where("product", "==", productRef))
      );
      const existDocs = exist.docs;

      let cartRef;
      if (existDocs.length > 0) {
        cartRef = doc(db, "cart", existDocs[0].id);
        await updateDoc(cartRef, {
          amount: increment(1),
        });
      } else {
        cartRef = await addDoc(cartCollection, {
          amount: 1,
          product: productRef,
        });
      }

      const snapshot = await getDoc(cartRef);

      return {
        ...snapshot.data(),
        product: productRef,
        id: snapshot.id,
      };
    },

    updateCart: async (parent, { cartId, amount }, info) => {
      if (amount < 1) throw Error("1 이하로 바꿀 수 없습니다");
      const cartRef = doc(db, "cart", cartId);
      if (!cartRef) throw Error("장바구니 정보가 없습니다");

      await updateDoc(cartRef, {
        amount,
      });

      const snapshot = await getDoc(cartRef);
      return {
        ...snapshot.data(),
        id: snapshot.id,
      };
    },
    deleteCart: async (parent, { cartId }, info) => {
      const cartRef = doc(db, "cart", cartId);
      if (!cartRef) throw new Error("없는 데이터입니다");
      await deleteDoc(cartRef);
      return cartId;
    },
    deleteAllCart: async (parent, args, info) => {
      const cart = collection(db, "cart");
      const cartSnap = await getDocs(cart);
      cartSnap.forEach(async (doc) => await deleteDoc(doc.ref));

      return "모든 장바구니 데이터가 성공적으로 삭제되었습니다.";
    },

    executePay: async (parent, { ids }, info) => {
      const deleted = [];
      for (const id of ids) {
        const cartRef = doc(db, "cart", id);
        const cartSnapshot = await getDoc(cartRef);
        const cartData = cartSnapshot.data();
        const productRef = cartData?.product;
        if (!productRef) throw Error("상품 정보가 없습니다");
        const product = (await getDoc(productRef)).data() as Product;
        if (product.createdAt) {
          await deleteDoc(cartRef);
          deleted.push(id);
        } else {
        }
      }
      return deleted;
    },
  },
  CartItem: {
    product: async (cartItem, args, context) => {
      const product = await getDoc(cartItem.product);
      const data = product.data() as any;
      return {
        ...data,
        id: product.id,
      };
    },
  },
};

export default cartResolver;
