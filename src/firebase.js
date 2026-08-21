import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsF2dkwtwiR3ziHFy90MJHR301BokyQAI",
  authDomain: "lumaai45.firebaseapp.com",
  projectId: "lumaai45",
  storageBucket: "lumaai45.firebasestorage.app",
  messagingSenderId: "968326449451",
  appId: "1:968326449451:web:ab1c980a830911ecee5d6e",
  measurementId: "G-B5DYKM7NFZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error("Persistence setup failed:", err);
});

export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export default app;
