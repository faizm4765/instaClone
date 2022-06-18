import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAEebclStlQGkIDNvLz9_xlFrW1iLLg5sw",
    authDomain: "insta-clone-8f011.firebaseapp.com",
    projectId: "insta-clone-8f011",
    storageBucket: "insta-clone-8f011.appspot.com",
    messagingSenderId: "194042763305",
    appId: "1:194042763305:web:082911a5d52484c2152438",
    measurementId: "G-3Q2QT5J8YH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export {db, storage}

