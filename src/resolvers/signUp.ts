import { Resolvers } from "./types";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import admin from "firebase-admin";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { FirebaseError } from "firebase/app";

const signUpResolver: Resolvers = {
  Query: {
    user: (parent, { email, id }) => {
      // Retrieve user logic
      // Here, you would implement logic to retrieve user data based on the provided email or id
      // For this example, we'll simply return the provided id
      return id;
    },
  },

  Mutation: {
    signUp: async (parent, { email, password, nickname }) => {
      const userCollection = collection(db, "users");
      const existEmail = await getDocs(
        query(userCollection, where("email", "==", email))
      );

      if (existEmail.docs.length > 0) {
        throw new Error("중복된 이메일입니다");
      }

      const existNickname = await getDocs(
        query(userCollection, where("nickname", "==", nickname))
      );

      if (existNickname.docs.length > 0) {
        throw new Error("중복된 닉네임입니다");
      }

      const auth = getAuth();
      // Create a new user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: nickname,
      });

      // Save user data to Firestore
      const newUser = {
        email,
        password,
        nickname,
      };

      const result = await addDoc(collection(db, "users"), newUser);
      const snapshot = await getDoc(result);

      return {
        ...snapshot.data(),
      };
    },

    signIn: async (_, { email, password }) => {
      try {
        if (!email) {
          throw new Error("이메일을 입력해주세요.");
        }

        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        return {
          uid: user.uid,
          email: user.email,
        };
      } catch (error) {
        console.error("Error signing in:", error);

        if (
          error instanceof FirebaseError &&
          error.code === "auth/user-not-found"
        ) {
          throw new Error("가입되지 않은 이메일입니다.");
        } else {
          throw new Error("Failed to sign in");
        }
      }
    },

    signOut: async () => {
      try {
        // Sign out user with Firebase Authentication
        const auth = getAuth();
        await signOut(auth);

        // Return true upon successful sign out
        return true;
      } catch (error) {
        console.error("Error signing out:", error);
        throw new Error("Failed to sign out");
      }
    },
  },
};

export default signUpResolver;
