// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6JryDpCDgFH54vonLcvzsd4cqZha3ZBw",
  authDomain: "to-do-app-3acf3.firebaseapp.com",
  projectId: "to-do-app-3acf3",
  storageBucket: "to-do-app-3acf3.appspot.com",
  messagingSenderId: "420720275933",
  appId: "1:420720275933:web:520ed62928b834b52b0634"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export {app,db}