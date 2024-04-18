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
    cart: async (parent, { uid }) => {
      const cartCollection = collection(db, "cart");
      const userCartQuery = query(cartCollection, where("uid", "==", uid));

      const userCartSnapshot = await getDocs(userCartQuery);
      const data: DocumentData[] = [];

      userCartSnapshot.forEach((doc) => {
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
    addCart: async (parent, { uid, productId }, info) => {
      if (!productId) throw Error("상품 id가 없습니다");
      const productRef = doc(db, "products", productId);

      const newCart = {
        uid: uid,
        product: productRef,
        amount: 1,
      };

      const cartCollection = collection(db, "cart");
      const userCartQuery = query(cartCollection, where("uid", "==", uid));
      const userCartSnapshot = await getDocs(userCartQuery);
      const data: DocumentData = [];

      userCartSnapshot.docs.forEach((cartDoc) => {
        data.push(cartDoc.data().product.id);
      });

      if (data.includes(productId)) {
        return;
      }

      const result = await addDoc(cartCollection, newCart);
      const cartSnapshot = await getDoc(result);

      return {
        ...cartSnapshot.data(),
        product: productRef,
        id: cartSnapshot.id,
      };
    },

    updateCart: async (parent, { cartId, amount }, info) => {
      if (amount < 1) throw Error("1 이하로 바꿀 수 없습니다");
      const cartRef = doc(db, "cart", cartId);
      if (!cartRef) throw Error("장바구니 정보가 없습니다");

      await updateDoc(cartRef, {
        amount: amount,
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

    executePay: async (parent, { uid, ids }, info) => {
      const deleted: any = [];

      const cartCollection = collection(db, "cart");
      const userCartQuery = query(cartCollection, where("uid", "==", uid));
      const cartSnapshot = await getDocs(userCartQuery);

      cartSnapshot.forEach((cartDoc) => {
        if (ids.includes(cartDoc.id)) {
          deleteDoc(doc(db, "cart", cartDoc.id));
          deleted.push(cartDoc.id);
        }
      });

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
