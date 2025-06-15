import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AppRouter from "./routes/AppRouter";
import { Toaster } from "sonner";
import { messaging, getToken, onMessage } from "./config/firebase";
import useNotificationStore from "./store/notification.store";

function App() {

  const { setFCMToken } = useNotificationStore()


  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: "BAx9SjKQ3hABSy-8RoR3GDxGEzJMeXdhJLZkR8j63mwodyleYltnwqNU3nWWTqtahLx_W0mADEGtLFQVJi3ThZ8",
        });
        // console.log("FCM Token:", token);
        setFCMToken(token); // Store the token in Zustand store

      } else {
        // console.log("Notification permission denied");
      }
    } catch (err) {
      console.log("An error occurred while getting token:", err);
    }
  };

  useEffect(() => {
    requestPermission();

    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      const title = payload?.data?.title || payload?.notification?.title || "New Notification";
      const body = payload?.data?.body || payload?.notification?.body || "You have a new message";
      alert(`📩 ${title}: ${body}`);
    });
  }, []);












  return (
    <>
      <AppRouter />
      <Toaster richColors position="top-center" />
    </>
  );
}

export default App;
