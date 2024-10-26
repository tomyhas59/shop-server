"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../../firebase");
const cartResolver = {
    Query: {
        cart: async (parent, { uid }) => {
            const cartCollection = (0, firestore_1.collection)(firebase_1.db, "cart");
            const CartQuery = (0, firestore_1.query)(cartCollection, (0, firestore_1.where)("uid", "==", uid));
            const CartSnapshot = await (0, firestore_1.getDocs)(CartQuery);
            const data = [];
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
            const ordersCollection = (0, firestore_1.collection)(firebase_1.db, "orders");
            const OrdersQuery = (0, firestore_1.query)(ordersCollection, (0, firestore_1.where)("uid", "==", uid));
            const ordersSnapshot = await (0, firestore_1.getDocs)(OrdersQuery);
            const data = [];
            ordersSnapshot.forEach((doc) => {
                const d = doc.data();
                data.push({
                    id: doc.id,
                    ...d,
                    createdAt: d.createdAt instanceof firestore_1.Timestamp ? d.createdAt.toDate() : null,
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
            //이미 카트에 존재하는지 체크
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
            const cartCollection = (0, firestore_1.collection)(firebase_1.db, "cart");
            const cartSnap = await (0, firestore_1.getDocs)(cartCollection);
            cartSnap.forEach(async (doc) => await (0, firestore_1.deleteDoc)(doc.ref));
            return "모든 장바구니 데이터가 성공적으로 삭제되었습니다.";
        },
        executePay: async (parent, { uid, ids }, info) => {
            const deleted = [];
            const orderItems = [];
            const cartCollection = (0, firestore_1.collection)(firebase_1.db, "cart");
            const userCartQuery = (0, firestore_1.query)(cartCollection, (0, firestore_1.where)("uid", "==", uid));
            const cartSnapshot = await (0, firestore_1.getDocs)(userCartQuery);
            // 주문 내역에 추가할 데이터 수집
            cartSnapshot.forEach((cartDoc) => {
                if (ids.includes(cartDoc.id)) {
                    const cartData = cartDoc.data();
                    orderItems.push({
                        amount: cartData.amount,
                        product: cartData.product,
                    });
                    deleted.push(cartDoc.id);
                }
            });
            // 새로운 주문 내역 컬렉션에 추가
            const ordersCollection = (0, firestore_1.collection)(firebase_1.db, "orders");
            const orderPromises = orderItems.map((item) => (0, firestore_1.addDoc)(ordersCollection, { uid, ...item, createdAt: (0, firestore_1.serverTimestamp)() }));
            await Promise.all(orderPromises);
            // 카트에서 삭제
            const deletePromises = deleted.map((id) => (0, firestore_1.deleteDoc)((0, firestore_1.doc)(firebase_1.db, "cart", id)));
            await Promise.all(deletePromises);
            return deleted;
        },
        deleteOrders: async (parent, { ordersId }, info) => {
            const ordersRef = (0, firestore_1.doc)(firebase_1.db, "orders", ordersId);
            if (!ordersRef)
                throw new Error("없는 데이터입니다");
            await (0, firestore_1.deleteDoc)(ordersRef);
            return ordersId;
        },
        deleteAllOrders: async (parent, args, info) => {
            const ordersCollection = (0, firestore_1.collection)(firebase_1.db, "orders");
            const orderSnap = await (0, firestore_1.getDocs)(ordersCollection);
            orderSnap.forEach(async (doc) => await (0, firestore_1.deleteDoc)(doc.ref));
            return "모든 주문 내역이 성공적으로 삭제되었습니다.";
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
