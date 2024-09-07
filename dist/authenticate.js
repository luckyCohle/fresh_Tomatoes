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
exports.signup = exports.login = void 0;
const express = require('express');
const server = express();
const path = require('path');
const ejsMate = require('ejs-mate');
server.set("view engine", "ejs");
server.set("views", path.join(__dirname, '..', "views"));
const login_1 = require("./login");
const signUp_1 = require("./signUp");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract email and password from request body
        const { email, password } = req.body;
        // Log the received credentials for debugging
        console.log('Received login request with email:', email);
        // Prepare credentials for the loginUser function
        const credentials = { email, password };
        // Log credentials object (beware of logging sensitive information in production)
        console.log('Prepared credentials:', credentials);
        // Call the loginUser function
        const result = yield (0, login_1.loginUser)(credentials);
        // Log the result of the login attempt
        console.log('Login attempt result:', result);
        if (result.success) {
            // Log successful login
            console.log('Login successful. Redirecting to home.');
            // Redirect to a dashboard or another page on success
            res.redirect('/');
        }
        else {
            // Log the error message received
            console.log('Login failed. Error message:', result.message);
            // Redirect back to login page with error message in query parameter
            res.redirect(`/login?error=${encodeURIComponent(result.message)}`);
        }
    }
    catch (error) {
        // Log any errors that occur during the process
        console.error('Error during login process:', error);
        // Redirect back to login page with a generic error message
        res.redirect(`/login?error=${encodeURIComponent('An unexpected error occurred. Please try again later.')}`);
    }
});
exports.login = login;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract the username, email, and password from the request body
        const { username, email, password } = req.body;
        // Check if all fields are provided
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Please provide username, email, and password.' });
        }
        // Call the signUpUser function to create the user and save data to Firestore
        yield (0, signUp_1.signUpUser)(username, email, password);
        // If everything went fine, send a success response
        res.status(201).redirect("/");
    }
    catch (error) {
        console.error('Error signing up user:', error);
        // Send the correct error response based on Firebase error code
        if (error.code === 'auth/email-already-in-use') {
            return res.status(400).json({ error: 'Email already in use. Please log in instead.' });
        }
        else if (error.code === 'auth/invalid-email') {
            return res.status(400).json({ error: 'Invalid email format. Please provide a valid email.' });
        }
        // If another error occurs, send a generic error response
        res.status(500).json({ error: 'Failed to sign up user. Please try again later.' });
    }
});
exports.signup = signup;
