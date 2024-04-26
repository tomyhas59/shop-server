"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
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
const app = (0, app_1.initializeApp)(firebaseConfig);
// Export Firebase app and Firestore instance
exports.default = app;
exports.db = (0, firestore_1.getFirestore)(app);
