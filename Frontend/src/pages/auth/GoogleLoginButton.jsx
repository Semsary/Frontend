// import { FcGoogle } from "react-icons/fc";
// import axiosInstance from "./../../config/api/axiosInstance";
// // import {
// //   auth,
// //   googleProvider,
// //   signInWithPopup,
// // } from "../../../config/firebaseConfig";
// import { useNavigate } from "react-router-dom";

// const GoogleLoginButton = () => {

//     const navigate = useNavigate()
//   const handleGoogleLogin = async () => {
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       const idToken = await result.user.getIdToken();

//       // إرسال التوكن إلى السيرفر للتحقق
//       const response = await axiosInstance.post("/auth/google-login", {
//         idToken,
//       });

//     //   console.log("User logged in:", response.data);
//         localStorage.setItem("token", response.data.token);

//         navigate("/");

//         window.location.reload();
        
//     } catch (error) {
//       console.error("Google Login Error:", error);
//     }
//   };

//   return (
//     <button
//       onClick={handleGoogleLogin}
//       className="flex mx-auto mt-8 items-center gap-2 px-4 py-2 text-black  rounded-lg shadow-md transition-all duration-300  active:scale-95"
//     >
//       <FcGoogle className="text-xl" />
//       تسجيل الدخول باستخدام Google
//     </button>
//   );
// };

// export default GoogleLoginButton;
