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
    reviews: async (parent, { productId }) => {
      const reviewsCollection = collection(db, "reviews");
      const reviewsQuery = query(
        reviewsCollection,
        where("productId", "==", productId)
      );
      const snapshot = await getDocs(reviewsQuery);
      const data: DocumentData[] = [];
      snapshot.forEach((doc) => {
        const d = doc.data();
        data.push({
          id: doc.id,
          ...d,
        });
      });
      console.log("리뷰 데이터", data);
      return data;
    },
  },
  Mutation: {
    addReview: async (parent, { productId, content, rating, uid }) => {
      if (!productId) throw Error("상품 id가 없습니다");
      const productRef = doc(db, "products", productId);

      const newReview = {
        product: productRef,
        uid: uid,
        content: content,
        rating: rating,
        createdAt: serverTimestamp(),
      };

      const result = await addDoc(collection(db, "reviews"), newReview);
      const snapshot = await getDoc(result);

      console.log("add review-------");

      return {
        ...snapshot.data(),
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
