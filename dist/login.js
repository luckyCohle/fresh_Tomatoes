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
exports.loginUser = loginUser;
// Firebase imports and initialization
const auth_1 = require("firebase/auth");
const app_1 = require("firebase/app");
const firebase_config_1 = require("./firebase-config");
// Initialize Firebase
const app = (0, app_1.initializeApp)(firebase_config_1.firebaseConfig);
const auth = (0, auth_1.getAuth)(app);
// Firebase login function
function loginUser(_a) {
    return __awaiter(this, arguments, void 0, function* ({ email, password }) {
        try {
            const userCredential = yield (0, auth_1.signInWithEmailAndPassword)(auth, email, password);
            return {
                success: true,
                message: 'Login successful',
                user: userCredential.user
            };
        }
        catch (error) {
            let errorMessage = 'Login failed';
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No user found with this email';
            }
            else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password';
            }
            return {
                success: false,
                message: errorMessage
            };
        }
    });
}
