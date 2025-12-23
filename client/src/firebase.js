import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "ApIKey--- IGNORE ---",
    authDomain: "movie-app-capstone.firebaseapp.com",
    projectId: "movie-app-capstone",
    storageBucket: "movie-app-capstone.firebasestorage.app",
    messagingSenderId: "SenderId--- IGNORE ---",
    appId: "AppId--- IGNORE ---"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Login Function
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error("Login failed:", error);
    }
};

// Logout Function
export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout failed:", error);
    }
};