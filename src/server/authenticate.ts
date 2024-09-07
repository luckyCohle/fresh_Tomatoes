const express = require('express');
const server = express();
const path = require('path');
const ejsMate = require('ejs-mate');

server.set("view engine", "ejs");
server.set("views", path.join(__dirname,'..',"views"));

import { collection, getDocs } from "firebase/firestore";
import { loginUser,LoginCredentials,LoginResult } from "./login";
import { signUpUser } from "./signUp";
import { db } from "./firebase-config";

interface Movie {
  id: string;
  title: string;
  genre: string[];
  releaseDate: string;
  image: string;
}
export const login = async (req: any, res: any) => {
  try {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Log the received credentials for debugging
    console.log('Received login request with email:', email);

    // Prepare credentials for the loginUser function
    const credentials: LoginCredentials = { email, password };
    
    // Log credentials object (beware of logging sensitive information in production)
    console.log('Prepared credentials:', credentials);

    // Call the loginUser function
    const result: LoginResult = await loginUser(credentials);

    // Log the result of the login attempt
    console.log('Login attempt result:', result);

    if (result.success) {
      // Log successful login
      console.log('Login successful. Redirecting to home.');
      // Redirect to a dashboard or another page on success
      res.redirect('/');
    } else {
      // Log the error message received
      console.log('Login failed. Error message:', result.message);
      // Redirect back to login page with error message in query parameter
      res.redirect(`/login?error=${encodeURIComponent(result.message)}`);
    }
  } catch (error) {
    // Log any errors that occur during the process
    console.error('Error during login process:', error);
    // Redirect back to login page with a generic error message
    res.redirect(`/login?error=${encodeURIComponent('An unexpected error occurred. Please try again later.')}`);
  }
}
export const signup =  async (req: any, res: any) => {
  try {
    // Extract the username, email, and password from the request body
    const { username, email, password } = req.body;

    // Check if all fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Please provide username, email, and password.' });
    }

    // Call the signUpUser function to create the user and save data to Firestore
    await signUpUser(username, email, password);

    // If everything went fine, send a success response
    res.status(201).redirect("/");
  } catch (error: any) {
    console.error('Error signing up user:', error);

    // Send the correct error response based on Firebase error code
    if (error.code === 'auth/email-already-in-use') {
      return res.status(400).json({ error: 'Email already in use. Please log in instead.' });
    } else if (error.code === 'auth/invalid-email') {
      return res.status(400).json({ error: 'Invalid email format. Please provide a valid email.' });
    }

    // If another error occurs, send a generic error response
    res.status(500).json({ error: 'Failed to sign up user. Please try again later.' });
  }
}