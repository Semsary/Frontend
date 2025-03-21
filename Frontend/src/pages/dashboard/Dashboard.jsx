import React from "react";
import { toast } from "sonner";

const Dashboard = () => {
  return (
    <div>
      <button
        onClick={() => {
          toast.success("This is a success message");
        }}
      >
        Success
      </button>
      <button
        onClick={() => {
          toast.error("This is an error message");
        }}
      >
        Error
      </button>
      <button
        onClick={() => {
          toast.info("This is an info message");
        }}
      >
        Info
      </button>
      <button
        onClick={() => {
          toast.warning("This is a warning message");
        }}
      >
        Warning
      </button>

      <h1>Dashboard</h1>
    </div>
  );
};

export default Dashboard;
