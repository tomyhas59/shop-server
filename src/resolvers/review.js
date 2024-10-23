"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../../firebase");
const reviewResolver = {
    Query: {
        reviews: async (parent, { productId }) => {
            try {
                const productRef = (0, firestore_1.doc)(firebase_1.db, "products", productId);
                const reviewsCollection = (0, firestore_1.collection)(firebase_1.db, "reviews");
                const reviewsQuery = (0, firestore_1.query)(reviewsCollection, (0, firestore_1.where)("product", "==", productRef));
                const reviewSnapshot = await (0, firestore_1.getDocs)(reviewsQuery);
                const reviewPromises = reviewSnapshot.docs.map(async (doc) => {
                    const d = doc.data();
                    console.log(d);
                    return {
                        id: doc.id,
                        ...d,
                        createdAt: d.createdAt instanceof firestore_1.Timestamp ? d.createdAt.toDate() : null,
                    };
                });
                // 모든 리뷰 데이터가 준비될 때까지 기다립니다.
                const reviewsData = await Promise.all(reviewPromises);
                return reviewsData;
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
            const usersCollection = (0, firestore_1.collection)(firebase_1.db, "users");
            const usersQuery = (0, firestore_1.query)(usersCollection, (0, firestore_1.where)("uid", "==", uid));
            const usersSnapshot = await (0, firestore_1.getDocs)(usersQuery);
            const users = usersSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            const user = users[0];
            const newReview = {
                uid,
                product: productRef,
                user: user,
                content,
                rating,
                createdAt: (0, firestore_1.serverTimestamp)(),
            };
            const result = await (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, "reviews"), newReview);
            const snapshot = await (0, firestore_1.getDoc)(result);
            const d = snapshot.data();
            console.log("add review-------", newReview);
            return {
                createdAt: d && d.createdAt instanceof firestore_1.Timestamp ? d.createdAt.toDate() : null,
                user: user,
                content,
                rating,
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
        deleteReview: async (parent, { reviewId }) => {
            const reviewRef = (0, firestore_1.doc)(firebase_1.db, "reviews", reviewId);
            const snapshot = await (0, firestore_1.getDoc)(reviewRef);
            if (!snapshot.exists())
                throw new Error("없는 데이터입니다");
            await (0, firestore_1.deleteDoc)(reviewRef);
            return reviewId;
        },
    },
};
exports.default = reviewResolver;
