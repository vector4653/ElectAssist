import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

/** Whether Firebase is configured with real credentials */
export const isFirebaseConfigured = !!(apiKey && authDomain && projectId);

const firebaseConfig = {
  apiKey: apiKey || 'AIzaSyDEMO_KEY_NOT_REAL',
  authDomain: authDomain || 'demo.firebaseapp.com',
  projectId: projectId || 'demo-project-id',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:0:web:0',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Initialize Analytics (only in browser environments that support it)
export const analytics = isSupported().then((supported) =>
  supported ? getAnalytics(app) : null
);

export default app;
