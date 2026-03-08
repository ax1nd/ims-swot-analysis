import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

export const RIT_EMAIL_DOMAIN = 'ritchennai.edu.in';

export function isAllowedEmail(email) {
  if (!email) return false;
  const domain = email.split('@')[1]?.toLowerCase();
  return domain === RIT_EMAIL_DOMAIN;
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const hasFirebaseConfig = firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.authDomain;

let app;
let auth;

if (hasFirebaseConfig) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
}

export const isFirebaseConfigured = () => !!hasFirebaseConfig;

const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  if (!auth) throw new Error('Google sign-in is not configured. Add Firebase env variables.');
  return signInWithPopup(auth, googleProvider);
}

export async function signOutFirebase() {
  if (!auth) return;
  return signOut(auth);
}
