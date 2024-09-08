const express = require('express');
const server = express();
const path = require('path');
const ejsMate = require('ejs-mate');

server.set("view engine", "ejs");
server.set("views", path.join(__dirname,'..',"views"));

import { collection, getDocs,doc,getDoc,deleteDoc, updateDoc, addDoc } from "firebase/firestore";
import { loginUser,LoginCredentials,LoginResult } from "./login";
import { signUpUser } from "./signUp";
import { db } from "./firebase-config";
import { NextFunction } from "express";

interface Movie {
  id: string;
  title: string;
  genre: string[];
  releaseDate: string;
  image: string;
}

export const fetchMovies = async (req: any, res: any, next: any) => {
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
  };
   //
   export const movieInfo = async (docId: string, req: any, res: any, next: any) => {
    try {
      const movieDocRef = doc(db, "movies", docId);
      const movieDoc = await getDoc(movieDocRef);
      
      if (movieDoc.exists()) {
        console.log("Movie data:", movieDoc.data());
        res.render('movieInfo', { 
          movie: { id: docId, ...movieDoc.data() },
        });
      } else {
        console.log("No such document!");
        res.status(404).send("Movie not found");
      }
    } catch (error) {
      console.error("Error fetching movie:", error);
      res.status(500).send("Internal Server Error");
    }
  };
  
  //delete movie method
  export const deleteMovie = async (docId: string, req: any, res: any, next: any) => {
    try {
      const docRef = doc(db, 'movies', docId);
      await deleteDoc(docRef);
      
      console.log(`Movie with ID ${docId} successfully deleted`);
      
      // Redirect to /movies after successful deletion
      res.redirect('/movies');
    } catch (error) {
      console.error("Failed to delete the movie with error:", error);
      
      // Handle the error, perhaps with a 500 response
      res.status(500).send("Failed to delete movie");
    }
  };

  //edit movie
  export const editMovie = async(docId:string,req: any,res: any,next: any)=>{
    const { title, genre, releaseDate, image } = req.body;
  
    try {
      const movieDocRef = doc(db, "movies", docId);
      
      await updateDoc(movieDocRef, {
        title,
        genre: genre.split(',').map((g: string) => g.trim()), // Assuming genre is a comma-separated string
        releaseDate,
        image
      });
  
      console.log(`Movie with ID ${docId} successfully updated`);
      res.redirect(`/${docId}/movie`); // Redirect to the movie info page after update
    } catch (error) {
      console.error("Error updating movie:", error);
      res.status(500).send("Failed to update movie");
    }
  }


  //add movie method

  export const addMovie = async (req: any, res: any, next: NextFunction) => {
    const { title, genre, releaseDate, image } = req.body;
  
    try {
      const movieData = {
        title,
        genre: genre.split(',').map((g: string) => g.trim()),
        releaseDate,
        image
      };
  
      const docRef = await addDoc(collection(db, "movies"), movieData)
  
      console.log("Document written with ID: ", docRef.id);
      res.redirect('/movies');
      
    } catch (error) {
      console.error("Error adding movie: ", error);
      res.status(500).json({ error: "Failed to add movie" });
    }
  };
  