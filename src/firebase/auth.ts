import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import type { User } from '@/types/global';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface FirebaseAuthError {
  code: string;
  message: string;
}

/**
 * Convert Firebase user to our User type
 */
export const convertFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  // Get additional user data from Firestore
  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
  const userData = userDoc.data();

  return {
    id: firebaseUser.uid,
    name: userData?.name || firebaseUser.displayName || 'User',
    email: firebaseUser.email || '',
    loginTime: new Date().toISOString(),
    createdAt: userData?.createdAt || firebaseUser.metadata.creationTime,
    lastLoginAt: userData?.lastLoginAt || firebaseUser.metadata.lastSignInTime
  };
};

/**
 * Register a new user with email and password
 */
export const registerUser = async (data: RegisterData): Promise<User> => {
  try {
    // Create user account
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const firebaseUser = userCredential.user;

    // Update the user's display name
    await updateProfile(firebaseUser, {
      displayName: data.name
    });

    // Create user profile in Firestore
    const userProfile = {
      name: data.name,
      email: data.email,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      settings: {
        theme: 'light',
        notifications: true,
        emailUpdates: true
      }
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);

    // Initialize user progress
    const initialProgress = {
      completedModules: [],
      currentModule: 1,
      currentStep: 1,
      moduleProgress: {},
      lastActiveSession: serverTimestamp(),
      totalTimeSpent: 0
    };

    await setDoc(doc(db, 'users', firebaseUser.uid, 'progress', 'current'), initialProgress);

    return convertFirebaseUser(firebaseUser);
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error(getAuthErrorMessage(error as FirebaseAuthError));
  }
};

/**
 * Sign in user with email and password
 */
export const loginUser = async (data: LoginData): Promise<User> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const firebaseUser = userCredential.user;

    // Update last login time
    await updateDoc(doc(db, 'users', firebaseUser.uid), {
      lastLoginAt: serverTimestamp()
    });

    return convertFirebaseUser(firebaseUser);
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(getAuthErrorMessage(error as FirebaseAuthError));
  }
};

/**
 * Sign out current user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error('Failed to logout. Please try again.');
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      unsubscribe();
      if (firebaseUser) {
        try {
          const user = await convertFirebaseUser(firebaseUser);
          resolve(user);
        } catch (error) {
          console.error('Error converting Firebase user:', error);
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  });
};

/**
 * Listen to authentication state changes
 */
export const onAuthStateChange = (callback: (user: User | null) => void): (() => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const user = await convertFirebaseUser(firebaseUser);
        callback(user);
      } catch (error) {
        console.error('Error in auth state change:', error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

/**
 * Convert Firebase auth errors to user-friendly messages
 */
export const getAuthErrorMessage = (error: FirebaseAuthError): string => {
  switch (error.code) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
};