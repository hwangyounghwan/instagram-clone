import firebase from "firebase"

const firebaseApp =
    firebase.initializeApp({
    apiKey: "AIzaSyC3vKftWVr2QCqHxlUCSuAgcdmyBGWQiLk",
    authDomain: "instagram-clone-f497c.firebaseapp.com",
    databaseURL: "https://instagram-clone-f497c-default-rtdb.firebaseio.com",
    projectId: "instagram-clone-f497c",
    storageBucket: "instagram-clone-f497c.appspot.com",
    messagingSenderId: "779005905961",
    appId: "1:779005905961:web:e1199934adda18e28da038",
    measurementId: "G-1D5D7F5VND"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
