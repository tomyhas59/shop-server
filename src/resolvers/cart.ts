import {
  DocumentData,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { CartItem, Resolvers } from "./types";

const cartResolver: Resolvers = {
  Query: {
    cart: async (parent, { uid }) => {
      const cartCollection = collection(db, "cart");
      const CartQuery = query(cartCollection, where("uid", "==", uid));

      const CartSnapshot = await getDocs(CartQuery);
      const data: DocumentData[] = [];

      CartSnapshot.forEach((doc) => {
        const d = doc.data();
        data.push({
          id: doc.id,
          ...d,
        });
      });

      return data;
    },
    orders: async (parent, { uid }) => {
      const ordersCollection = collection(db, "orders");
      const OrdersQuery = query(ordersCollection, where("uid", "==", uid));

      const ordersSnapshot = await getDocs(OrdersQuery);
      const data: DocumentData[] = [];

      ordersSnapshot.forEach((doc) => {
        const d = doc.data();
        data.push({
          id: doc.id,
          ...d,
          createdAt:
            d.createdAt instanceof Timestamp ? d.createdAt.toDate() : null,
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

      //이미 카트에 존재하는지 체크
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
      const cartCollection = collection(db, "cart");
      const cartSnap = await getDocs(cartCollection);
      cartSnap.forEach(async (doc) => await deleteDoc(doc.ref));

      return "모든 장바구니 데이터가 성공적으로 삭제되었습니다.";
    },

    executePay: async (parent, { uid, ids }, info) => {
      const deleted: string[] = [];
      const orderItems: CartItem[] = [];

      const cartCollection = collection(db, "cart");
      const userCartQuery = query(cartCollection, where("uid", "==", uid));
      const cartSnapshot = await getDocs(userCartQuery);

      // 주문 내역에 추가할 데이터 수집
      cartSnapshot.forEach((cartDoc) => {
        if (ids.includes(cartDoc.id)) {
          const cartData = cartDoc.data() as CartItem;
          orderItems.push({
            amount: cartData.amount,
            product: cartData.product,
          });
          deleted.push(cartDoc.id);
        }
      });

      // 새로운 주문 내역 컬렉션에 추가
      const ordersCollection = collection(db, "orders");
      const orderPromises = orderItems.map((item) =>
        addDoc(ordersCollection, { uid, ...item, createdAt: serverTimestamp() })
      );
      await Promise.all(orderPromises);

      // 카트에서 삭제
      const deletePromises = deleted.map((id) =>
        deleteDoc(doc(db, "cart", id))
      );
      await Promise.all(deletePromises);

      return deleted;
    },
    deleteOrders: async (parent, { ordersId }, info) => {
      const ordersRef = doc(db, "orders", ordersId);
      if (!ordersRef) throw new Error("없는 데이터입니다");
      await deleteDoc(ordersRef);
      return ordersId;
    },
    deleteAllOrders: async (parent, args, info) => {
      const ordersCollection = collection(db, "orders");
      const orderSnap = await getDocs(ordersCollection);
      orderSnap.forEach(async (doc) => await deleteDoc(doc.ref));

      return "모든 주문 내역이 성공적으로 삭제되었습니다.";
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
