'use client';

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBQLeE2PPVYDZkYl-cwOL2U_PrDKIQdeSc",
  authDomain: "crcusa-prod.firebaseapp.com",
  projectId: "crcusa-prod",
  storageBucket: "crcusa-prod.firebasestorage.app",
  messagingSenderId: "231208198711",
  appId: "1:231208198711:web:394be1f96ecda37ef3d5b2",
  measurementId: "G-J88KPZCH9V"
};

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
} else {
  app = getApps()[0];
  db = getFirestore(app);
  auth = getAuth(app);
}

export { app, db, auth };
