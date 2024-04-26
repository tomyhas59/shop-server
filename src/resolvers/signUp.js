"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../../firebase");
const signUpResolver = {
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
            const userCollection = (0, firestore_1.collection)(firebase_1.db, "users");
            const existEmail = await (0, firestore_1.getDocs)((0, firestore_1.query)(userCollection, (0, firestore_1.where)("email", "==", email)));
            if (existEmail.docs.length > 0) {
                throw new Error("중복된 이메일입니다");
            }
            const existNickname = await (0, firestore_1.getDocs)((0, firestore_1.query)(userCollection, (0, firestore_1.where)("nickname", "==", nickname)));
            if (existNickname.docs.length > 0) {
                throw new Error("중복된 닉네임입니다");
            }
            const auth = (0, auth_1.getAuth)();
            const userCredential = await (0, auth_1.createUserWithEmailAndPassword)(auth, email, password);
            await (0, auth_1.updateProfile)(userCredential.user, {
                displayName: nickname,
            });
            console.log(userCredential.user);
            const newUser = {
                email,
                password,
                nickname,
            };
            const result = await (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, "users"), newUser);
            const snapshot = await (0, firestore_1.getDoc)(result);
            return {
                ...snapshot.data(),
            };
        },
        signIn: async (_, { email, password }) => {
            try {
                if (!email) {
                    throw new Error("이메일을 입력해주세요.");
                }
                const auth = (0, auth_1.getAuth)();
                const userCredential = await (0, auth_1.signInWithEmailAndPassword)(auth, email, password);
                const user = userCredential.user;
                return {
                    uid: user.uid,
                    email: user.email,
                };
            }
            catch (error) {
                throw new Error("이메일 또는 비밀번호가 다릅니다.");
            }
        },
        signOut: async () => {
            try {
                const auth = (0, auth_1.getAuth)();
                await (0, auth_1.signOut)(auth);
                return true;
            }
            catch (error) {
                console.error("로그아웃 실패");
                throw new Error("로그아웃 실패");
            }
        },
    },
};
exports.default = signUpResolver;
