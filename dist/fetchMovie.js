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
exports.addMovie = exports.editMovie = exports.deleteMovie = exports.movieInfo = exports.fetchMovies = void 0;
const express = require('express');
const server = express();
const path = require('path');
const ejsMate = require('ejs-mate');
server.set("view engine", "ejs");
server.set("views", path.join(__dirname, '..', "views"));
const firestore_1 = require("firebase/firestore");
const firebase_config_1 = require("./firebase-config");
const fetchMovies = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.fetchMovies = fetchMovies;
//
const movieInfo = (docId, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movieDocRef = (0, firestore_1.doc)(firebase_config_1.db, "movies", docId);
        const movieDoc = yield (0, firestore_1.getDoc)(movieDocRef);
        if (movieDoc.exists()) {
            console.log("Movie data:", movieDoc.data());
            res.render('movieInfo', {
                movie: Object.assign({ id: docId }, movieDoc.data()),
            });
        }
        else {
            console.log("No such document!");
            res.status(404).send("Movie not found");
        }
    }
    catch (error) {
        console.error("Error fetching movie:", error);
        res.status(500).send("Internal Server Error");
    }
});
exports.movieInfo = movieInfo;
//delete movie method
const deleteMovie = (docId, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docRef = (0, firestore_1.doc)(firebase_config_1.db, 'movies', docId);
        yield (0, firestore_1.deleteDoc)(docRef);
        console.log(`Movie with ID ${docId} successfully deleted`);
        // Redirect to /movies after successful deletion
        res.redirect('/movies');
    }
    catch (error) {
        console.error("Failed to delete the movie with error:", error);
        // Handle the error, perhaps with a 500 response
        res.status(500).send("Failed to delete movie");
    }
});
exports.deleteMovie = deleteMovie;
//edit movie
const editMovie = (docId, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, genre, releaseDate, image } = req.body;
    try {
        const movieDocRef = (0, firestore_1.doc)(firebase_config_1.db, "movies", docId);
        yield (0, firestore_1.updateDoc)(movieDocRef, {
            title,
            genre: genre.split(',').map((g) => g.trim()), // Assuming genre is a comma-separated string
            releaseDate,
            image
        });
        console.log(`Movie with ID ${docId} successfully updated`);
        res.redirect(`/${docId}/movie`); // Redirect to the movie info page after update
    }
    catch (error) {
        console.error("Error updating movie:", error);
        res.status(500).send("Failed to update movie");
    }
});
exports.editMovie = editMovie;
//add movie method
const addMovie = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, genre, releaseDate, image } = req.body;
    try {
        const movieData = {
            title,
            genre: genre.split(',').map((g) => g.trim()),
            releaseDate,
            image
        };
        const docRef = yield (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_config_1.db, "movies"), movieData);
        console.log("Document written with ID: ", docRef.id);
        res.redirect('/movies');
    }
    catch (error) {
        console.error("Error adding movie: ", error);
        res.status(500).json({ error: "Failed to add movie" });
    }
});
exports.addMovie = addMovie;
