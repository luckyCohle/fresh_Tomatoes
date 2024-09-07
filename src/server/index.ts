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
import { login , signup } from "./authenticate";

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
server.get('/movies', async (req: any, res: any, next: any) => {
  try {
    console.log('Fetching movies...');
    const searchTerm = req.query.search ? (req.query.search as string).toLowerCase() : '';
    console.log('Search term:', searchTerm);

    const moviesRef = collection(db, 'movies');
    console.log('Getting documents...');
    const snapshot = await getDocs(moviesRef);
    console.log('Documents fetched. Count:', snapshot.size);

    const movies: Movie[] = [];

    snapshot.forEach((doc) => {
      const movieData = doc.data() as Omit<Movie, 'id'>;
      const movie: Movie = { id: doc.id, ...movieData };
      
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
  } catch (error) {
    console.error('Error fetching movies:', error);
    next(error); // Pass the error to the error handling middleware
  }
});



server.listen(3000,()=>{
    console.log("Server started on port 3000");
})