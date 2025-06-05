import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {

    apiKey: "AIzaSyCg44e8uy9kcrWX6GnZWn90o5RKZTf3_5E",
    authDomain: "pushnotifications-42121.firebaseapp.com",
    projectId: "pushnotifications-42121",
    storageBucket: "pushnotifications-42121.firebasestorage.app",
    messagingSenderId: "631086307984",
    appId: "1:631086307984:web:75928ffde1415884b25615"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
