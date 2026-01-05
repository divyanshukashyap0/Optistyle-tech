
import { initializeApp, getApp, getApps } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB11hf4drvfY8qPi-cn9WBUK3zgwFKjGIM",
  authDomain: "optistyle-c4c81.firebaseapp.com",
  projectId: "optistyle-c4c81",
  storageBucket: "optistyle-c4c81.firebasestorage.app",
  messagingSenderId: "597360683228",
  appId: "1:597360683228:web:eb7a354068a525d594ac19",
  measurementId: "G-XE44P3QSBC"
};

// Singleton pattern for Firebase initialization
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { 
  app,
  auth, 
  db,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
};
