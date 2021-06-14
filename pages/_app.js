import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase";
import "../styles/globals.css";

const firebaseConfig = {
  apiKey: "AIzaSyC2zb82HvBH7LaqdiE1V241XXacTLIQjm0",
  authDomain: "tapv0-1360d.firebaseapp.com",
  projectId: "tapv0-1360d",
  storageBucket: "tapv0-1360d.appspot.com",
  messagingSenderId: "477032704340",
  appId: "1:477032704340:web:c683e6737990d3526340c1",
  measurementId: "G-47H8QYCR4C",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
