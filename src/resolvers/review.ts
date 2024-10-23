import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { Resolvers } from "./types";
import { db } from "../../firebase";

const reviewResolver: Resolvers = {
  Query: {
    reviews: async (parent, { productId }) => {
      try {
        const productRef = doc(db, "products", productId);

        const reviewsCollection = collection(db, "reviews");
        const reviewsQuery = query(
          reviewsCollection,
          where("product", "==", productRef)
        );
        const reviewSnapshot = await getDocs(reviewsQuery);

        const reviewPromises = reviewSnapshot.docs.map(async (doc) => {
          const d = doc.data();
          console.log(d);
          return {
            id: doc.id,
            ...d,
            createdAt:
              d.createdAt instanceof Timestamp ? d.createdAt.toDate() : null,
          };
        });

        // 모든 리뷰 데이터가 준비될 때까지 기다립니다.
        const reviewsData = await Promise.all(reviewPromises);

        return reviewsData;
      } catch (error) {
        console.error("리뷰 데이터를 가져오는 중 오류 발생:", error);
        throw new Error("리뷰 데이터를 가져오는 중 문제가 발생했습니다.");
      }
    },
  },
  Mutation: {
    addReview: async (parent, { productId, content, rating, uid }) => {
      if (!productId) throw Error("상품 id가 없습니다");
      const productRef = doc(db, "products", productId);

      const usersCollection = collection(db, "users");
      const usersQuery = query(usersCollection, where("uid", "==", uid));
      const usersSnapshot = await getDocs(usersQuery);
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
        createdAt: serverTimestamp(),
      };

      const result = await addDoc(collection(db, "reviews"), newReview);
      const snapshot = await getDoc(result);
      const d = snapshot.data();
      console.log("add review-------", newReview);

      return {
        createdAt:
          d && d.createdAt instanceof Timestamp ? d.createdAt.toDate() : null,
        user: user,
        content,
        rating,
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
    deleteReview: async (parent, { reviewId }) => {
      const reviewRef = doc(db, "reviews", reviewId);
      const snapshot = await getDoc(reviewRef);
      if (!snapshot.exists()) throw new Error("없는 데이터입니다");
      await deleteDoc(reviewRef);
      return reviewId;
    },
  },
};

export default reviewResolver;
