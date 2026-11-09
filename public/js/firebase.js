import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyDRqimUTGm96xEuyx_T_-C68GCMqmUmaf8",
    authDomain: "inovatech-db3fc.firebaseapp.com",
    databaseURL: "https://inovatech-db3fc-default-rtdb.firebaseio.com",
    projectId: "inovatech-db3fc",
    storageBucket: "inovatech-db3fc.firebasestorage.app",
    messagingSenderId: "84103960256",
    appId: "1:84103960256:web:4ea0948770f8d0271e7f25",
    measurementId: "G-ZJFB6CYQPX"
};


const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const db = getDatabase(app);
const auth = getAuth(app);


export { db, auth };