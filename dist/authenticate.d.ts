import { Request, Response, NextFunction } from "express";
export declare const login: (req: any, res: any) => Promise<void>;
export declare const signup: (req: any, res: any) => Promise<any>;
export declare const isLoggedInMiddleware: (app: any) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const logout: () => void;
