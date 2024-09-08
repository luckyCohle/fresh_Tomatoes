import { NextFunction } from "express";
export declare const fetchMovies: (req: any, res: any, next: any) => Promise<void>;
export declare const movieInfo: (docId: string, req: any, res: any, next: any) => Promise<void>;
export declare const deleteMovie: (docId: string, req: any, res: any, next: any) => Promise<void>;
export declare const editMovie: (docId: string, req: any, res: any, next: any) => Promise<void>;
export declare const addMovie: (req: any, res: any, next: NextFunction) => Promise<void>;
