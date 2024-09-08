const express = require('express');
const server = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

server.set("view engine", "ejs");
server.set("views", path.join(__dirname,'..',"views"));

import { collection, getDocs } from "firebase/firestore";
import { signUpUser } from "./signUp";
import { db } from "./firebase-config";
import { login , signup , isLoggedInMiddleware, logout } from "./authenticate";
import { addMovie, deleteMovie, editMovie, fetchMovies, movieInfo } from "./fetchMovie";
import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  // If you're using other Firebase services, you might need to add their config here
});

interface Movie {
  id: string;
  title: string;
  genre: string[];
  releaseDate: string;
  image: string;
}

//serve static file
server.use(express.static(path.join(__dirname,'..', 'public')));
server.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
server.use(express.json()); // for parsing application/json
server.use(methodOverride("_method"));


server.get('/',(req:any,res:any)=>{
    res.sendFile(path.join(__dirname, '..','./public', 'index.html'));

})
//login route
server.get('/login',(req:any,res:any)=>{
    res.sendFile(path.join(__dirname, '..','./public', 'login.html'));
});

server.post('/login',login);



//signup route
server.get('/signup',(req:any,res:any)=>{
  res.sendFile(path.join(__dirname, '..','./public', 'signup.html'));
})

server.post('/signup',signup);
//movies route
server.get('/movies',fetchMovies);

server.get('/:movieId/movie', (req: { params: { movieId: string; }; }, res: any, next: any) => {
  movieInfo(req.params.movieId,req, res, next,);
});
//delete Movie
server.delete('/:movieId/movie',(req: { params: { movieId: string; }; },res: any,next: any)=>{
  deleteMovie(req.params.movieId,req,res,next);
})
//edit movie
server.put('/:movieId/movie',(req: { params: { movieId: string; }; },res: any,next: any)=>{
  const id = req.params.movieId;
  editMovie(id,req,res,next);
})
//logout
server.post('/logout',logout)
//render add form
server.get('/add',(req: any,res: { sendFile: (arg0: any) => void; },next: any)=>{
  res.sendFile(path.join(__dirname, '..','./public', 'add.html'));
})
server.post('/add',addMovie);
server.listen(3000,()=>{
    console.log("Server started on port 3000");
})