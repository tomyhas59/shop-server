"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../../firebase");
const reviewResolver = {
    Query: {
        reviews: async (parent, { productId }) => {
            try {
                const reviewsCollection = (0, firestore_1.collection)(firebase_1.db, "reviews");
                const reviewsQuery = (0, firestore_1.query)(reviewsCollection, (0, firestore_1.where)("productId", "==", productId));
                const snapshot = await (0, firestore_1.getDocs)(reviewsQuery);
                // 데이터를 저장할 배열
                const data = [];
                // snapshot이 비어 있는 경우에도 빈 배열을 반환
                if (snapshot.empty) {
                    console.log("리뷰가 없습니다");
                    return data; // 빈 배열 반환
                }
                // snapshot이 있는 경우 데이터 수집
                snapshot.forEach((doc) => {
                    const d = doc.data();
                    data.push({
                        id: doc.id,
                        ...d,
                    });
                });
                console.log("리뷰 데이터", data);
                return data;
            }
            catch (error) {
                console.error("리뷰 데이터를 가져오는 중 오류 발생:", error);
                throw new Error("리뷰 데이터를 가져오는 중 문제가 발생했습니다.");
            }
        },
    },
    Mutation: {
        addReview: async (parent, { productId, content, rating, uid }) => {
            if (!productId)
                throw Error("상품 id가 없습니다");
            const productRef = (0, firestore_1.doc)(firebase_1.db, "products", productId);
            const newReview = {
                product: productRef,
                uid: uid,
                content: content,
                rating: rating,
                createdAt: (0, firestore_1.serverTimestamp)(),
            };
            const result = await (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, "reviews"), newReview);
            const snapshot = await (0, firestore_1.getDoc)(result);
            console.log("add review-------");
            return {
                ...snapshot.data(),
                id: snapshot.id,
            };
        },
        updateReview: async (parent, { id, ...data }) => {
            const reviewRef = (0, firestore_1.doc)(firebase_1.db, "reviews", id);
            if (!reviewRef)
                throw new Error("없는 데이터입니다");
            await (0, firestore_1.updateDoc)(reviewRef, {
                ...data,
                createdAt: (0, firestore_1.serverTimestamp)(),
            });
            const snapshot = await (0, firestore_1.getDoc)(reviewRef);
            return {
                ...snapshot.data(),
                id: snapshot.id,
            };
        },
        deleteReview: async (parent, { id }) => {
            const reviewRef = (0, firestore_1.doc)(firebase_1.db, "reviews", id);
            const snapshot = await (0, firestore_1.getDoc)(reviewRef);
            if (!snapshot.exists())
                throw new Error("없는 데이터입니다");
            await (0, firestore_1.updateDoc)(reviewRef, { createdAt: null });
            return id;
        },
    },
};
exports.default = reviewResolver;
