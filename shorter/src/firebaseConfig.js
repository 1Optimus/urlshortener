import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const FIREBASE_APKEY = process.env.REACT_APP_FIREBASE_APKEY
const FIREBASE_AUTHDOMAIN = process.env.REACT_APP_FIREBASE_AUTHDOMAIN
const FIREBASE_DATABASEURL = process.env.REACT_APP_FIREBASE_DATABASEURL
const FIREBASE_PROJECTID = process.env.REACT_APP_FIREBASE_PROJECTID
const FIREBASE_STORAGEBUCKET = process.env.REACT_APP_FIREBASE_STORAGEBUCKET
const FIREBASE_MESSAGINGSENDERIDmessagingSenderId = process.env.REACT_APP_FIREBASE_MESSAGINGSENDERIDmessagingSenderId
const FIREBASE_APPID = process.env.REACT_APP_FIREBASE_APPID
const FIREBASE_MEASUREMENTID = process.env.REACT_APP_FIREBASE_MEASUREMENTID

const firebaseConfig = {
    apiKey:FIREBASE_APKEY,
    authDomain:FIREBASE_AUTHDOMAIN,
    databaseURL:FIREBASE_DATABASEURL,
    projectId: FIREBASE_PROJECTID,
    storageBucket:FIREBASE_STORAGEBUCKET,
    messagingSenderId:FIREBASE_MESSAGINGSENDERIDmessagingSenderId,
    appId:FIREBASE_APPID,
    measurementId:FIREBASE_MEASUREMENTID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
