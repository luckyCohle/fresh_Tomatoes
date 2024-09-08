"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const server = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
server.set("view engine", "ejs");
server.set("views", path.join(__dirname, '..', "views"));
const authenticate_1 = require("./authenticate");
const fetchMovie_1 = require("./fetchMovie");
const admin = __importStar(require("firebase-admin"));
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    // If you're using other Firebase services, you might need to add their config here
});
//serve static file
server.use(express.static(path.join(__dirname, '..', 'public')));
server.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
server.use(express.json()); // for parsing application/json
server.use(methodOverride("_method"));
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
server.get('/movies', fetchMovie_1.fetchMovies);
server.get('/:movieId/movie', (req, res, next) => {
    (0, fetchMovie_1.movieInfo)(req.params.movieId, req, res, next);
});
//delete Movie
server.delete('/:movieId/movie', (req, res, next) => {
    (0, fetchMovie_1.deleteMovie)(req.params.movieId, req, res, next);
});
//edit movie
server.put('/:movieId/movie', (req, res, next) => {
    const id = req.params.movieId;
    (0, fetchMovie_1.editMovie)(id, req, res, next);
});
//logout
server.post('/logout', authenticate_1.logout);
//render add form
server.get('/add', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', './public', 'add.html'));
});
server.post('/add', fetchMovie_1.addMovie);
server.listen(3000, () => {
    console.log("Server started on port 3000");
});
