import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA4j0zPiDtrZBU2I2OGTFRDvFDA2wG5vH8",
    authDomain: "law-firm-app-aff0b.firebaseapp.com",
    projectId: "law-firm-app-aff0b",
    storageBucket: "law-firm-app-aff0b.appspot.com",
    messagingSenderId: "145452547914",
    appId: "1:145452547914:web:8cd445bd37cd2c03ffcbb3",
    measurementId: "G-4LCLXHCVJJ"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };
