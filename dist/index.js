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
const express = require('express');
const server = express();
const path = require('path');
const ejsMate = require('ejs-mate');
server.set("view engine", "ejs");
server.set("views", path.join(__dirname, '..', "views"));
const firestore_1 = require("firebase/firestore");
const firebase_config_1 = require("./firebase-config");
const authenticate_1 = require("./authenticate");
//serve static file
server.use(express.static(path.join(__dirname, '..', 'public')));
server.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
server.use(express.json()); // for parsing application/json
server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', './public', 'index.html'));
});
//login route
server.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', './public', 'login.html'));
});
server.post('/login', authenticate_1.login);
//signup route
server.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '..', './public', 'signup.html'));
});
server.post('/signup', authenticate_1.signup);
//movies route
server.get('/movies', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Fetching movies...');
        const searchTerm = req.query.search ? req.query.search.toLowerCase() : '';
        console.log('Search term:', searchTerm);
        const moviesRef = (0, firestore_1.collection)(firebase_config_1.db, 'movies');
        console.log('Getting documents...');
        const snapshot = yield (0, firestore_1.getDocs)(moviesRef);
        console.log('Documents fetched. Count:', snapshot.size);
        const movies = [];
        snapshot.forEach((doc) => {
            const movieData = doc.data();
            const movie = Object.assign({ id: doc.id }, movieData);
            console.log('Processing movie:', movie.id);
            // Perform case-insensitive, partial match search on multiple fields
            if (!searchTerm ||
                (movie.title && movie.title.toLowerCase().includes(searchTerm)) ||
                (movie.genre && movie.genre.some(g => g && g.toLowerCase().includes(searchTerm))) ||
                (movie.releaseDate && movie.releaseDate.toLowerCase().includes(searchTerm))) {
                movies.push(movie);
            }
        });
        console.log('Filtered movies count:', movies.length);
        res.render('movies', { movies, searchTerm });
    }
    catch (error) {
        console.error('Error fetching movies:', error);
        next(error); // Pass the error to the error handling middleware
    }
}));
server.listen(3000, () => {
    console.log("Server started on port 3000");
});
