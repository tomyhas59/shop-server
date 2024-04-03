import { DBField, writeDB } from "../dbController";
import { Cart, Product, Resolvers } from "./types";

const setJSON = (data: Cart) => writeDB(DBField.CART, data);

const cartResolver: Resolvers = {
  Query: {
    cartList: (parent, args, context, info) => {
      return context.db.cart;
    },
  },

  Mutation: {
    addCart: (parent, { id }, { db }, info) => {
      if (!id) throw Error("상품 id가 없습니다");
      const product = db.products.find((product) => product.id === id);
      if (!product) {
        throw new Error("상품이 없습니다");
      }

      const existCartIndex = db.cart.findIndex((item) => item.id === id);
      if (existCartIndex > -1) {
        const newCartItem = {
          id,
          amount: db.cart[existCartIndex].amount + 1,
        };
        db.cart.splice(existCartIndex, 1, newCartItem);
        setJSON(db.cart);
        return newCartItem;
      }
      const newItem = {
        id,
        amount: 1,
      };
      db.cart.push(newItem);
      setJSON(db.cart);
      return newItem;
    },

    updateCart: (parent, { id, amount }, { db }, info) => {
      const existCartIndex = db.cart.findIndex((item) => item.id === id);

      if (existCartIndex < 0) {
        throw new Error("없는 데이터입니다");
      }
      if (existCartIndex > -1) {
        const newCartItem = {
          id,
          amount,
        };
        db.cart.splice(existCartIndex, 1, newCartItem);
        setJSON(db.cart);
        return newCartItem;
      }
    },
    deleteCart: (parent, { id }, { db }, info) => {
      const existCartIndex = db.cart.findIndex((item) => item.id === id);
      if (existCartIndex < 0) {
        throw new Error("없는 데이터입니다");
      }
      if (existCartIndex > -1) {
        db.cart.splice(existCartIndex, 1);
        setJSON(db.cart);
        return id;
      }
    },
    deleteAllCart: (parent, args, { db }, info) => {
      db.cart = [];
      setJSON(db.cart);
      return db.cart;
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
          const product = db.products.find(
            (product: Product) => product.id === item.id
          );
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
    product: (cartItem, args, context) =>
      context.db.products.find(
        (product: Product) => product.id === cartItem.id
      ),
  },
};

export default cartResolver;
