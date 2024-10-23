import { Resolvers } from "./types";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
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
        password,
        nickname,
        uid: userCredential.user.uid,
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
      } catch (error: any) {
        throw new Error("이메일 또는 비밀번호가 다릅니다.");
      }
    },

    signOut: async () => {
      try {
        const auth = getAuth();
        await signOut(auth);
        return true;
      } catch (error) {
        console.error("로그아웃 실패");
        throw new Error("로그아웃 실패");
      }
    },
  },
};

export default signUpResolver;
