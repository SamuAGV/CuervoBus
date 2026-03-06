import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAlTJ49VHnVgb_9bdGFiRwBX9hbMi_u-Ss",
  authDomain: "cuervobus-6d0cf.firebaseapp.com",
  projectId: "cuervobus-6d0cf",
  storageBucket: "cuervobus-6d0cf.appspot.com",
  messagingSenderId: "1007660078108",
  appId: "1:1007660078108:android:85b8d1b90af19607493bd9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);