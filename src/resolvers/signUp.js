"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../../firebase");
const signUpResolver = {
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
            console.log(userCredential.user.uid);
            const newUser = {
                email,
                nickname,
                uid: userCredential.user.uid,
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
        changePassword: async (_, { oldPassword, newPassword }) => {
            try {
                const auth = (0, auth_1.getAuth)();
                const user = auth.currentUser;
                console.log("-------------", oldPassword, newPassword, user);
                if (!user || !user.email) {
                    throw new Error("사용자가 로그인되지 않았거나 이메일이 없습니다.");
                }
                // 기존 비밀번호로 인증을 위한 Credential 생성
                const credential = auth_1.EmailAuthProvider.credential(user.email, oldPassword);
                // 사용자 재인증
                console.log("재인증 중...");
                await (0, auth_1.reauthenticateWithCredential)(user, credential);
                console.log("재인증 성공, 비밀번호 변경 중...");
                await (0, auth_1.updatePassword)(user, newPassword);
                console.log("비밀번호 변경 성공");
                return true;
            }
            catch (error) {
                if (error.code === "auth/wrong-password") {
                    throw new Error("기존 비밀번호가 틀립니다.");
                }
                throw new Error("비밀번호 변경에 실패했습니다.");
            }
        },
    },
};
exports.default = signUpResolver;
