"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../../firebase");
const firestore_1 = require("firebase/firestore");
const PAGE_SIZE = 15;
const productResolver = {
    Query: {
        products: async (parent, 
        /**args */ { cursor = "", showDeleted = false }) => {
            const productsCollection = (0, firestore_1.collection)(firebase_1.db, "products");
            const queryOptions = [(0, firestore_1.orderBy)("createdAt", "desc")];
            if (cursor) {
                const snapshot = await (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, "products", cursor));
                queryOptions.push((0, firestore_1.startAfter)(snapshot));
            }
            if (!showDeleted)
                queryOptions.unshift((0, firestore_1.where)("createdAt", "!=", null));
            const q = (0, firestore_1.query)(productsCollection, ...queryOptions, (0, firestore_1.limit)(PAGE_SIZE));
            const snapshot = await (0, firestore_1.getDocs)(q);
            const data = [];
            for (const productDoc of snapshot.docs) {
                const productRef = (0, firestore_1.doc)(firebase_1.db, "products", productDoc.id);
                const reviewsCollection = (0, firestore_1.collection)(firebase_1.db, "reviews");
                const reviewsQuery = (0, firestore_1.query)(reviewsCollection, (0, firestore_1.where)("product", "==", productRef));
                // 비동기 작업 기다리기
                const reviewSnapshot = await (0, firestore_1.getDocs)(reviewsQuery);
                const reviewsCount = reviewSnapshot.size;
                data.push({
                    id: productDoc.id,
                    ...productDoc.data(),
                    reviewsCount,
                });
            }
            return data;
        },
        product: async (parent, { id }) => {
            const snapshot = await (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, "products", id));
            return {
                ...snapshot.data(),
                id: snapshot.id,
            };
        },
        allProducts: async () => {
            const products = (0, firestore_1.collection)(firebase_1.db, "products");
            const snapshot = await (0, firestore_1.getDocs)(products);
            const data = [];
            snapshot.forEach((doc) => {
                data.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            return data;
        },
    },
    Mutation: {
        addProduct: async (parent, { imageUrl, price, title, description }, info) => {
            const newProduct = {
                imageUrl,
                price,
                title,
                description,
                createdAt: (0, firestore_1.serverTimestamp)(),
            };
            const result = await (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, "products"), newProduct);
            const snapshot = await (0, firestore_1.getDoc)(result);
            return {
                ...snapshot.data(),
                id: snapshot.id,
            };
        },
        updateProduct: async (parent, { id, ...data }, info) => {
            const productRef = (0, firestore_1.doc)(firebase_1.db, "products", id);
            if (!productRef)
                throw new Error("없는 데이터입니다");
            await (0, firestore_1.updateDoc)(productRef, {
                ...data,
                createdAt: (0, firestore_1.serverTimestamp)(),
            });
            const snapshot = await (0, firestore_1.getDoc)(productRef);
            return {
                ...snapshot.data(),
                id: snapshot.id,
            };
        },
        deleteProduct: async (parent, { id }) => {
            const productRef = (0, firestore_1.doc)(firebase_1.db, "products", id);
            if (!productRef)
                throw new Error("없는 데이터입니다");
            await (0, firestore_1.updateDoc)(productRef, { createdAt: null });
            return id;
        },
    },
};
exports.default = productResolver;
