// public/firebase-messaging-sw.js
/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.3.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.3.1/firebase-messaging-compat.js');

firebase.initializeApp({

  
    apiKey: "AIzaSyCg44e8uy9kcrWX6GnZWn90o5RKZTf3_5E",
    authDomain: "pushnotifications-42121.firebaseapp.com",
    projectId: "pushnotifications-42121",
    storageBucket: "pushnotifications-42121.firebasestorage.app",
    messagingSenderId: "631086307984",
    appId: "1:631086307984:web:75928ffde1415884b25615"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
