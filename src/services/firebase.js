import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB9zLM8eEXK-sFlkQ3F_o_Nc7IENbyx1dU",
    authDomain: "secret-santa-f22e7.firebaseapp.com",
    projectId: "secret-santa-f22e7",
    storageBucket: "secret-santa-f22e7.firebasestorage.app",
    messagingSenderId: "167199168253",
    appId: "1:167199168253:web:b2da7b7609f35c672d1094",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
