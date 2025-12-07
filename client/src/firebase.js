import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCvT3KDv6FxmvJ0M_Qzt3A-GVJ4-weVd6k",
    authDomain: "movie-app-capstone.firebaseapp.com",
    projectId: "movie-app-capstone",
    storageBucket: "movie-app-capstone.firebasestorage.app",
    messagingSenderId: "720121930210",
    appId: "1:720121930210:web:72155347d16429cd7ad9bb"
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