// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore();

export {auth, db};
