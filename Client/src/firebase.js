import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, query, orderBy } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

let app = null;
let auth = null;
let db = null;

export function getFirebaseApp() {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) return null;
  if (!app) app = initializeApp(firebaseConfig);
  return app;
}

export function getFirebaseAuth() {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  if (!auth) auth = getAuth(firebaseApp);
  return auth;
}

export function getFirestoreDb() {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  if (!db) db = getFirestore(firebaseApp);
  return db;
}

export function isFirebaseConfigured() {
  return !!(process.env.REACT_APP_FIREBASE_API_KEY && process.env.REACT_APP_FIREBASE_PROJECT_ID);
}

export async function signInWithGoogle() {
  const authInstance = getFirebaseAuth();
  if (!authInstance) throw new Error("Firebase is not configured");
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(authInstance, provider);
  return result.user;
}

export async function signUpWithEmail(email, password) {
  const authInstance = getFirebaseAuth();
  if (!authInstance) throw new Error("Firebase is not configured");
  const result = await createUserWithEmailAndPassword(authInstance, email, password);
  return result.user;
}

export async function signInWithEmail(email, password) {
  const authInstance = getFirebaseAuth();
  if (!authInstance) throw new Error("Firebase is not configured");
  const result = await signInWithEmailAndPassword(authInstance, email, password);
  return result.user;
}

export async function signOut() {
  const authInstance = getFirebaseAuth();
  if (authInstance) await firebaseSignOut(authInstance);
}

// Firestore: channels
export async function getChannelsFromFirestore() {
  const firestoreDb = getFirestoreDb();
  if (!firestoreDb) return null;
  const snapshot = await getDocs(collection(firestoreDb, "channels"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Firestore: pricing plans
export async function getPricingFromFirestore() {
  const firestoreDb = getFirestoreDb();
  if (!firestoreDb) return null;
  const snapshot = await getDocs(query(collection(firestoreDb, "pricing"), orderBy("sortOrder", "asc")));
  return snapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() }));
}

// Firestore: submit contact
export async function submitContactToFirestore(name, email, message) {
  const firestoreDb = getFirestoreDb();
  if (!firestoreDb) throw new Error("Firebase is not configured");
  const docRef = await addDoc(collection(firestoreDb, "contacts"), {
    name,
    email: email.trim().toLowerCase(),
    message,
    status: "pending",
    createdAt: new Date(),
  });
  return docRef.id;
}
