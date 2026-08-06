import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTE4OPpmtdZJ-qLLvviSR5_kBGYfGUMm0",
  authDomain: "hum-4bb7f.firebaseapp.com",
  databaseURL: "https://hum-4bb7f-default-rtdb.firebaseio.com",
  projectId: "hum-4bb7f",
  storageBucket: "hum-4bb7f.firebasestorage.app",
  messagingSenderId: "271720743741",
  appId: "1:271720743741:web:528fe157b28b6559c4fb54",
  measurementId: "G-RTCG7XKJV3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, googleProvider };
