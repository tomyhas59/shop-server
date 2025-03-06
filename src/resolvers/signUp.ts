import { Resolvers } from "./types";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

const signUpResolver: Resolvers = {
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

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: nickname,
      });

      console.log(userCredential.user.uid);
      const newUser = {
        email,
        nickname,
        uid: userCredential.user.uid,
      };

      const result = await addDoc(collection(db, "users"), newUser);
      const snapshot = await getDoc(result);

      return {
        ...snapshot.data(),
      };
    },
  },
};

export default signUpResolver;
