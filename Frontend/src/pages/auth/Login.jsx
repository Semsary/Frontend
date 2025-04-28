import { useState } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Loader2, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react'
// import axiosInstance from "../config/axiosInstance"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axiosInstance from "./../../config/api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
// import GoogleLoginButton from "./GoogleLoginButton"
 
const Login = () => {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth();
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    setError("")

    try {
      const response = await axiosInstance.post("/auth/signin", data);
      
      console.log("Login successful:", data)
      localStorage.setItem("token", response.data.token);
      console.log("token", response.data.token);
      login(response.data.data);
      toast.success("تم تسجيل الدخول بنجاح");
      navigate("/");
      
    } catch (err) {
      console.log(err)

      if (err.response?.data?.message === "Your account is blocked") {
        setError("حسابك محظور. يرجى الاتصال بالدعم.")
        return
      }

      if (err.response?.data?.message) {
        console.log("Backend error:", err.response.data.message)
      } else {
        console.log("Error:", err.message)
      }


      setError("فشل تسجيل الدخول.   يرجى التحقق من بياناتك البريد وكلمة المرور.")
      // setError( JSON.stringify(err) )
      toast.error("فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-200 via-white to-blue-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-md bg-white/70"
        style={{
          directioin: "rtl",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          مرحباً بك
        </h2>
        <p className="text-gray-600 text-center mb-8">تسجيل الدخول الى حسابك</p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 text-right"
          style={{ direction: "rtl" }} 
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">
              البريد
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="ادخل بريدك الالكتروني"
                {...register("email", { required: "Email is required" })}
                className={`pr-10 bg-white/50 border-gray-300 text-gray-800 text-right ${
                  errors.email ? "border-red-500" : ""
                }`} // Changed padding to 'pr-10' for RTL
              />
              <Mail
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />{" "}
              {/* Changed to 'right-3' */}
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
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
                placeholder="ادخل كلمة المرور"
                {...register("password", { required: "Password is required" })}
                className={`pr-10 bg-white/50 border-gray-300 text-gray-800 text-right ${
                  errors.password ? "border-red-500" : ""
                }`} // Changed padding to 'pr-10' for RTL
              />
              <Lock
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />{" "}
              {/* Changed to 'right-3' */}
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary2 text-white transition-colors duration-300"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جاري تسجيل الدخول...
              </>
            ) : (
              <>
                <ArrowLeft className="ml-2 h-4 w-4" />
                تسجيل الدخول
              </>
            )}
          </Button>
        </form>

        {/* <GoogleLoginButton /> */}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 ">
            ليس لديك حساب؟
            <a href="/signup" className="text-blue-600 hover:underline px-1">
              سجل الان
            </a>
          </p>
        </div>
        <div className="mt- text-center">
          <p className="text-sm text-gray-600">
            هل نسيت كلمة المرور ؟
            <a
              href="/forgot-password"
              className="text-blue-600 hover:underline px-1"
            >
              تغير كلمة المرور
            </a>
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            عند تسجيل الدخول، فأنت توافق على{" "}
            <a href="/privacy-policy" className="text-blue-600 hover:underline">
              شروط الخدمة
            </a>{" "}
            .
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login

