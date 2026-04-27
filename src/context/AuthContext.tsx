import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db, isFirebaseConfigured } from '../firebase/config';

export interface UserProfile {
  fullName: string;
  age: number;
  voterId: string;
  state: string;
  language: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isConfigured: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  saveProfile: (uid: string, profile: UserProfile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setUser(firebaseUser);
        if (firebaseUser && isFirebaseConfigured) {
          try {
            const docSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (docSnap.exists()) {
              setProfile(docSnap.data() as UserProfile);
            } else {
              const initialProfile: UserProfile = {
                fullName: firebaseUser.displayName || 'User',
                age: 0,
                voterId: '',
                state: '',
                language: 'en',
                createdAt: new Date().toISOString()
              };
              await setDoc(doc(db, 'users', firebaseUser.uid), initialProfile);
              setProfile(initialProfile);
            }
          } catch (e) {
            console.warn('Error fetching profile:', e);
          }
        } else {
          setProfile(null);
        }
        setLoading(false);
      });
    } catch (e) {
      console.warn('Auth listener failed:', e);
      setLoading(false);
    }
    
    // If Firebase is not configured, stop loading immediately
    if (!isFirebaseConfigured) {
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    }
    
    return () => unsubscribe?.();
  }, []);

  const login = async (email: string, password: string) => {
    if (!isFirebaseConfigured) throw new Error('Firebase is not configured. Please set up your .env file.');
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string) => {
    if (!isFirebaseConfigured) throw new Error('Firebase is not configured. Please set up your .env file.');
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    return cred.user;
  };

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured) throw new Error('Firebase is not configured. Please set up your .env file.');
    const cred = await signInWithPopup(auth, googleProvider);
    
    // Check if profile exists, if not create one using Google info
    if (isFirebaseConfigured && cred.user) {
      try {
        const docRef = doc(db, 'users', cred.user.uid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          const initialProfile: UserProfile = {
            fullName: cred.user.displayName || 'User',
            age: 0,
            voterId: '',
            state: '',
            language: 'en',
            createdAt: new Date().toISOString()
          };
          await setDoc(docRef, initialProfile);
          setProfile(initialProfile);
        } else {
          setProfile(docSnap.data() as UserProfile);
        }
      } catch (e) {
        console.warn('Could not initialize Google user profile', e);
      }
    }
    
    return cred.user;
  };

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
  };

  const saveProfile = async (uid: string, profileData: UserProfile) => {
    if (isFirebaseConfigured) {
      await setDoc(doc(db, 'users', uid), profileData);
    }
    setProfile(profileData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isConfigured: isFirebaseConfigured,
        login,
        register,
        loginWithGoogle,
        logout,
        saveProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
