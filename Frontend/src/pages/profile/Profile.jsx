import React, { useEffect } from "react";
import useAuthStore from "./../../store/auth.store";

const Profile = () => {
  const { user, loadUserFromToken } = useAuthStore();

  useEffect(() => {
    loadUserFromToken();
  }, []);

  return (
    <div>
      <h1>Profile</h1>
      <h2>
        {user?.firstname}
        {user?.lastname}
      </h2>

      <h3>{user?.emails[0].email}</h3>
    </div>
  );
};

export default Profile;
