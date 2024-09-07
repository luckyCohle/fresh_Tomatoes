"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseConfig = exports.db = exports.auth = void 0;
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
const firebaseConfig = {
    apiKey: "AIzaSyAMRYDl4vY6JQ4lwZmtEEzAxnCIgXhF1sM",
    authDomain: "fresh-tomatoes-1b804.firebaseapp.com",
    projectId: "fresh-tomatoes-1b804",
    storageBucket: "fresh-tomatoes-1b804.appspot.com",
    messagingSenderId: "1088203048732",
    appId: "1:1088203048732:web:79495279a8acc6cae79cd9",
    measurementId: "G-XQE06S0HKR"
};
exports.firebaseConfig = firebaseConfig;
// Initialize Firebase
const app = (0, app_1.initializeApp)(firebaseConfig);
// Initialize Firebase Authentication and export it
const db = (0, firestore_1.getFirestore)(app);
exports.db = db;
const auth = (0, auth_1.getAuth)(app);
exports.auth = auth;
