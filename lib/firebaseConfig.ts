import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCt9gOOy0LErLOiqLHrHYHEn0LCfYOcCaE",
    authDomain: "zanstein-solution.firebaseapp.com",
    projectId: "zanstein-solution",
    storageBucket: "zanstein-solution.firebasestorage.app",
    messagingSenderId: "660423275281",
    appId: "1:660423275281:web:c80b8f99de45c7afc492b0",
    measurementId: "G-LRZR50TGW3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
