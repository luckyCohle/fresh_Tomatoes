"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpUser = signUpUser;
const firebase_config_1 = require("./firebase-config");
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
function signUpUser(username, email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Attempt to create user
            const userCredential = yield (0, auth_1.createUserWithEmailAndPassword)(firebase_config_1.auth, email, password);
            const user = userCredential.user;
            // Add user data to Firestore
            yield (0, firestore_1.setDoc)((0, firestore_1.doc)(firebase_config_1.db, 'users', user.uid), {
                username,
                email,
                reviews: [],
                watchlist: []
            });
            console.log('User signed up and data saved to Firestore');
        }
        catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                console.error('Email is already in use, please log in instead.');
                // Optional: You can also send an error response or handle it in the UI
            }
            else {
                console.error('Error signing up:', error);
            }
        }
    });
}
