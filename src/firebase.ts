import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user exists
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    const now = new Date().toISOString();
    
    if (!userSnap.exists()) {
      // Create new user with professional fields
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: user.email === 'muhammadusmanray@gmail.com' ? 'admin' : 'user',
        status: 'active',
        theme: 'dark',
        isDeleted: false,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now
      });
    } else {
      // Update last login
      await setDoc(userRef, {
        lastLoginAt: now,
        updatedAt: now
      }, { merge: true });
    }
    
    return user;
  } catch (error) {
    console.error("Error logging in with Google", error);
    throw error;
  }
};

export const logout = () => signOut(auth);
