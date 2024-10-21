import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { Resolvers } from "./types";
import { db } from "../../firebase";

const reviewResolver: Resolvers = {
  Query: {
    reviews: async (parent, { productId, userId }) => {
      try {
        const reviewsCollection = collection(db, "reviews");
        const reviewsQuery = query(
          reviewsCollection,
          where("productId", "==", productId)
        );
        const snapshot = await getDocs(reviewsQuery);

        // 데이터를 저장할 배열
        const data: DocumentData[] = [];

        // snapshot이 비어 있는 경우에도 빈 배열을 반환
        if (snapshot.empty) {
          console.log("리뷰가 없습니다");
          return data; // 빈 배열 반환
        }

        // snapshot이 있는 경우 데이터 수집
        snapshot.forEach(async (doc) => {
          const d = doc.data();
          data.push({
            id: doc.id,
            ...d,
            user: await getUserById(userId),
          });
        });

        console.log("리뷰 데이터", data);
        return data;
      } catch (error) {
        console.error("리뷰 데이터를 가져오는 중 오류 발생:", error);
        throw new Error("리뷰 데이터를 가져오는 중 문제가 발생했습니다.");
      }
    },
  },
  Mutation: {
    addReview: async (parent, { productId, content, rating, userId }) => {
      if (!productId) throw Error("상품 id가 없습니다");
      const productRef = doc(db, "products", productId);

      const newReview = {
        userId: userId,
        product: productRef,
        content: content,
        rating: rating,
        createdAt: serverTimestamp(),
      };

      const result = await addDoc(collection(db, "reviews"), newReview);
      const snapshot = await getDoc(result);

      console.log("add review-------", newReview);

      return {
        ...snapshot.data(),
        product: productRef,
        content: content,
        createdAt: serverTimestamp(),
        rating: rating,
        id: snapshot.id,
      };
    },
    updateReview: async (parent, { id, ...data }) => {
      const reviewRef = doc(db, "reviews", id);

      if (!reviewRef) throw new Error("없는 데이터입니다");
      await updateDoc(reviewRef, {
        ...data,
        createdAt: serverTimestamp(),
      });
      const snapshot = await getDoc(reviewRef);
      return {
        ...snapshot.data(),
        id: snapshot.id,
      };
    },
    deleteReview: async (parent, { id }) => {
      const reviewRef = doc(db, "reviews", id);
      const snapshot = await getDoc(reviewRef);
      if (!snapshot.exists()) throw new Error("없는 데이터입니다");
      await updateDoc(reviewRef, { createdAt: null });
      return id;
    },
  },
};

export default reviewResolver;

const getUserById = async (userId: string) => {
  const userDocRef = doc(db, "users", userId);
  const userDoc = await getDoc(userDocRef);
  return { id: userDoc.id, ...userDoc.data() };
};
