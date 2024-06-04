"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../../firebase");
const cartResolver = {
    Query: {
        cart: async (parent, { uid }) => {
            const cartCollection = (0, firestore_1.collection)(firebase_1.db, "cart");
            const userCartQuery = (0, firestore_1.query)(cartCollection, (0, firestore_1.where)("uid", "==", uid));
            const userCartSnapshot = await (0, firestore_1.getDocs)(userCartQuery);
            const data = [];
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
            if (!productId)
                throw Error("상품 id가 없습니다");
            const productRef = (0, firestore_1.doc)(firebase_1.db, "products", productId);
            const newCart = {
                uid: uid,
                product: productRef,
                amount: 1,
            };
            const cartCollection = (0, firestore_1.collection)(firebase_1.db, "cart");
            const userCartQuery = (0, firestore_1.query)(cartCollection, (0, firestore_1.where)("uid", "==", uid));
            const userCartSnapshot = await (0, firestore_1.getDocs)(userCartQuery);
            const data = [];
            userCartSnapshot.docs.forEach((cartDoc) => {
                data.push(cartDoc.data().product.id);
            });
            if (data.includes(productId)) {
                return;
            }
            const result = await (0, firestore_1.addDoc)(cartCollection, newCart);
            const cartSnapshot = await (0, firestore_1.getDoc)(result);
            console.log(cartSnapshot.data());
            return {
                ...cartSnapshot.data(),
                product: productRef,
                id: cartSnapshot.id,
            };
        },
        updateCart: async (parent, { cartId, amount }, info) => {
            if (amount < 1)
                throw Error("1 이하로 바꿀 수 없습니다");
            const cartRef = (0, firestore_1.doc)(firebase_1.db, "cart", cartId);
            if (!cartRef)
                throw Error("장바구니 정보가 없습니다");
            await (0, firestore_1.updateDoc)(cartRef, {
                amount: amount,
            });
            const snapshot = await (0, firestore_1.getDoc)(cartRef);
            return {
                ...snapshot.data(),
                id: snapshot.id,
            };
        },
        deleteCart: async (parent, { cartId }, info) => {
            const cartRef = (0, firestore_1.doc)(firebase_1.db, "cart", cartId);
            if (!cartRef)
                throw new Error("없는 데이터입니다");
            await (0, firestore_1.deleteDoc)(cartRef);
            return cartId;
        },
        deleteAllCart: async (parent, args, info) => {
            const cart = (0, firestore_1.collection)(firebase_1.db, "cart");
            const cartSnap = await (0, firestore_1.getDocs)(cart);
            cartSnap.forEach(async (doc) => await (0, firestore_1.deleteDoc)(doc.ref));
            return "모든 장바구니 데이터가 성공적으로 삭제되었습니다.";
        },
        executePay: async (parent, { uid, ids }, info) => {
            const deleted = [];
            const cartCollection = (0, firestore_1.collection)(firebase_1.db, "cart");
            const userCartQuery = (0, firestore_1.query)(cartCollection, (0, firestore_1.where)("uid", "==", uid));
            const cartSnapshot = await (0, firestore_1.getDocs)(userCartQuery);
            cartSnapshot.forEach((cartDoc) => {
                if (ids.includes(cartDoc.id)) {
                    (0, firestore_1.deleteDoc)((0, firestore_1.doc)(firebase_1.db, "cart", cartDoc.id));
                    deleted.push(cartDoc.id);
                }
            });
            return deleted;
        },
    },
    CartItem: {
        product: async (cartItem, args, context) => {
            const product = await (0, firestore_1.getDoc)(cartItem.product);
            const data = product.data();
            return {
                ...data,
                id: product.id,
            };
        },
    },
};
exports.default = cartResolver;
