import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
    const navigate = useNavigate();
  const HandleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      console.log(result);

      // Extract Google-specific data
      const googleId = result.user.uid; // Use `uid` or another unique identifier from Firebase
      const username = result.user.displayName;
      const email = result.user.email;
      const photoURL = result.user.photoURL;

      // Send data to the backend
      const res = await fetch("/api/auth/google", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          photoURL,
          googleId, // Include the Google ID
        }),
      });

      const data = await res.json();
      

      if (res.ok) {
        // Handle successful authentication
        message.success(data.message);
        navigate("/products");
      } else {
          // Handle errors returned from the backend
          message.error(data.message);
        console.error("Authentication failed:", data.message);
      }
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    }
  };
  return (
    <button
      onClick={HandleGoogleClick}
      type="button"
      className="border rounded-xl w-1/2 py-1 bg-black text-white hover:opacity-80"
    >
      Continue with Google
    </button>
  );
};

export default OAuth;
