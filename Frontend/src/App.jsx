import { useState } from "react";
import { Button } from "@/components/ui/button";
import AppRouter from "./routes/AppRouter";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <AppRouter />
      <Toaster richColors position="top-center" />
    </>
  );
}

export default App;
