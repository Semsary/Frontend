import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Loader2,
  User,
  Mail,
  Phone,
  Lock,
  Image,
  FileText,
  MapPin,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "./../../config/api/axiosInstance";
import  { useNavigate } from "react-router-dom";
// import {
//   getStorage,
//   ref,
//   uploadBytesResumable,
//   getDownloadURL,
// } from "firebase/storage";
// import { getFirestore, collection, addDoc } from "firebase/firestore";
// import { app } from "../../../../src/config/firebaseConfig.js";
import { toast } from "sonner";

const SignUp = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState("no image");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const formData = {
        ...data,
        profileImage:profilePic,
      };

      console.log("بيانات التسجيل:", formData);
      const response = await axiosInstance.post("/auth/signup", formData);
      localStorage.setItem("token", response.data.token);
      console.log("تم التسجيل بنجاح:", response.data.data);
      toast.success("تم التسجيل بنجاح");
      navigate("/login");
    } catch (err) {
      console.error("خطأ:", err.message);
      setError("فشل التسجيل. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false); 
    }
  }; 

  const [imagePreview, setImagePreview] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    const storage = getStorage(app);
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error("Error uploading file:", error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at:", downloadURL);
          setProfilePic(downloadURL);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error(
            "Error getting download URL or saving to Firestore:",
            error
          );
        }
        setLoading(false);
      }
    );
    setLoading(false);
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-200 via-white to-blue-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl m-10 p-8 rounded-2xl shadow-2xl backdrop-blur-md bg-white/70"
        style={{
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        }}
      >
        <h2 className="text-3xl font-bold mb-6  text-gray-800   text-center">
          أنشئ حسابك
        </h2>
        <p className="text-gray-600 text-center mb-8">انضم إلينا وابدأ رحلتك</p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          style={{ direction: "rtl" }}
        >
          <div className="space-y-4 bg-sl ate-500 text-center flex justify-center flex-col items-center">
            <div className="">
              {/* <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                صورة الملف الشخصي
              </label> */}
              <div className="relative group">
                {/* Profile Image Preview */}
                <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg border-2 border-gray-200 hover:border-blue-500 transition-all duration-300">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                  )}
                </div>

                {/* Upload Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center w-24 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300 cursor-pointer">
                  <label
                    htmlFor="image"
                    className="flex items-center justify-center w-full h-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                  </label>
                </div>

                {/* Hidden File Input */}
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 text-right ">
              <Label htmlFor="name" className="text-gray-700 ">
                الاسم الكامل
              </Label>

              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  placeholder=""
                  {...register("name", { required: "الاسم مطلوب" })}
                  className={`pl-10 bg-white/50 border-gray-300 text-gray-800 pr-10 text-right ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
                <User
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700">
                اسم المستخدم
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  placeholder=""
                  {...register("username", { required: "اسم المستخدم مطلوب" })}
                  className={`pl-10 bg-white/50 border-gray-300 text-gray-800 pr-10 text-right${
                    errors.username ? "border-red-500" : ""
                  }`}
                />
                <User
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                البريد الإلكتروني
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  {...register("email", {
                    required: "البريد الإلكتروني مطلوب",
                  })}
                  className={`pl-10 bg-white/50 border-gray-300 text-gray-800 pr-10 text-right${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                <Mail
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700">
                رقم الهاتف
              </Label>
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (000) 123-4567"
                  {...register("phone", { required: "رقم الهاتف مطلوب" })}
                  className={`pl-10 bg-white/50 border-gray-300 text-gray-800 pr-10 text-right ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                />
                <Phone
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                كلمة المرور
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password", {
                    required: "كلمة المرور مطلوبة",
                    minLength: {
                      value: 8,
                      message: "يجب أن تكون كلمة المرور 8 أحرف على الأقل",
                    },
                  })}
                  className={`pl-10 bg-white/50 border-gray-300 text-gray-800 pr-10 text-right ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
                <Lock
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700">
                تأكيد كلمة المرور
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword", {
                    required: "يرجى تأكيد كلمة المرور",
                    validate: (value) =>
                      value === password || "كلمات المرور غير متطابقة",
                  })}
                  className={`pl-10 bg-white/50 border-gray-300 text-gray-800 pr-10 text-right ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                />
                <Lock
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="about" className="text-gray-700">
              معلومات عنك
            </Label>
            <div className="relative">
              <Textarea
                id="about"
                placeholder="أخبرنا عن نفسك"
                {...register("about")}
                className="pl-10 pt-2 bg-white/50 border-gray-300 text-gray-800 pr-10 text-right min-h-[100px]"
              />
              <FileText
                className="absolute right-3 top-3 text-gray-400"
                size={18}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-gray-700">
              العنوان
            </Label>
            <div className="relative">
              <Input
                id="address"
                type="text"
                placeholder="الامارات - دبي"
                {...register("address")}
                className="pl-10 bg-white/50 border-gray-300 text-gray-800 pr-10 text-right"
              />
              <MapPin
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-primary2 hover:bg-primary text-white transition-colors duration-300"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                التسجيل...
              </>
            ) : (
              <>
                تسجيل الحساب
                <ArrowLeft className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            لديك حساب؟{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              تسجيل الدخول
            </a>
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            من خلال التسجيل، فإنك توافق على{" "}
            {/* <a href="/terms" className="text-blue-600 hover:underline">
              شروط الخدمة
            </a>{" "} */}
            و{" "}
            <a href="/privacy-policy" className="text-blue-600 hover:underline">
              سياسة الخصوصية
            </a>
            .
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
