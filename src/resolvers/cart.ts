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
import { Cart, Resolvers } from "./types";

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
    addCart: async (parent, { id }, info) => {
      if (!id) throw Error("상품 id가 없습니다");
      const productRef = doc(db, "products", id);
      const cartCollection = collection(db, "cart");
      const exist = (
        await getDocs(query(cartCollection, where("product", "==", productRef)))
      ).docs[0];
      //query 날리기 위해서 Docs로 함

      let cartRef;
      if (exist) {
        cartRef = doc(db, "cart", exist.id);
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

    updateCart: async (parent, { id, amount }, info) => {
      if (amount < 1) throw Error("1 이하로 바꿀 수 없습니다");
      if (!id) throw Error("상품 id가 없습니다");
      const productRef = doc(db, "products", id);
      const cartCollection = collection(db, "cart");
      const exist = (
        await getDocs(query(cartCollection, where("product", "==", productRef)))
      ).docs[0];
      //query 날리기 위해서 Docs로 함
      if (!exist) throw Error("등록된 장바구니가 없습니다");

      const cartRef = doc(db, "cart", exist.id);
      await updateDoc(cartRef, {
        amount,
      });

      const snapshot = await getDoc(cartRef);
      return {
        ...snapshot.data(),
        product: productRef,
        id: snapshot.id,
      };
    },
    deleteCart: async (parent, { id }, info) => {
      const cartRef = doc(db, "cart", id);
      if (!cartRef) throw new Error("없는 데이터입니다");
      await deleteDoc(cartRef);
      return id;
    },
    deleteAllCart: async (parent, args, info) => {
      const cart = collection(db, "cart");
      const cartSnap = await getDocs(cart);
      cartSnap.forEach(async (doc) => await deleteDoc(doc.ref));

      return "모든 장바구니 데이터가 성공적으로 삭제되었습니다.";
    },

    executePay: (parent, { ids }, { db }, info) => {
      const newCartData = db.cart.filter(
        (cartItem) => !ids.includes(cartItem.id)
      );
      const finalCartData = db.cart.filter((cartItem) =>
        ids.includes(cartItem.id)
      );
      if (
        finalCartData.some((item) => {
          const product = db.products.find((product) => product.id === item.id);
          return product?.createdAt === undefined;
        })
      )
        throw Error("삭제된 상품이 포함되어 결제를 진행할 수 없습니다.");
      db.cart = newCartData;
      setJSON(db.cart);
      return ids;
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
