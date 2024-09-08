export interface LoginCredentials {
    email: string;
    password: string;
}
export interface LoginResult {
    success: boolean;
    message: string;
    user?: any;
    idToken?: string;
}
export declare function loginUser({ email, password }: LoginCredentials): Promise<LoginResult>;
