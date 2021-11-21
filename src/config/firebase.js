import {initializeApp, getApps, getApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import {getStorage} from 'firebase/storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA703ZWwzFJ3WtQGzmScw21gqH5AdIvfoY',
  authDomain: 'newtinder-70196.firebaseapp.com',
  projectId: 'newtinder-70196',
  storageBucket: 'newtinder-70196.appspot.com',
  messagingSenderId: '410865254909',
  appId: '1:410865254909:web:708175b99909a930805994',
  measurementId: 'G-NP4099JSLL',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

export {app, db, auth, storage};
