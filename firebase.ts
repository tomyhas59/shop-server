import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Import other Firebase SDKs as needed
// For example, if you need Firebase Auth, import it here

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.fb_apiKey,
  authDomain: process.env.fb_authDomain,
  projectId: process.env.fb_projectId,
  storageBucket: process.env.fb_storageBucket,
  messagingSenderId: process.env.fb_messagingSenderId,
  appId: process.env.fb_appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase app and Firestore instance
export default app;
export const db = getFirestore(app);
