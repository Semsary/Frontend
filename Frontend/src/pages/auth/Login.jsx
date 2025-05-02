import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";

export default function ArabicLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handelLogin = (data) => {
    console.log("Form submitted:", data);
    // Handle login logic here
  };

  return (
    <div className="flex flex-col md:flex-row-reverse h-screen w-full overflow-hidden bg-gray-50">
      {/* Right side - Login Form (now on top on mobile) */}
      <div className="w-full md:w-1/2 bg-white p-4 sm:p-8 flex flex-col justify-center overflow-y-auto">
        <div className="max-w-md mx-auto w-full">
          <div className="text-right">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              تسجيل الدخول
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
              مرحبًا بعودتك! يرجى تسجيل الدخول للوصول إلى حسابك
            </p>
          </div>

          <form
            onSubmit={handleSubmit(handelLogin)}
            className="space-y-4 sm:space-y-6"
          >
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 text-right"
              >
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  required
                  {...register("email")}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2 sm:py-3 text-right pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="أدخل بريدك الإلكتروني"
                  dir="rtl"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 text-right"
              >
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  {...register("password")}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2 sm:py-3 text-right pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="أدخل كلمة المرور"
                  dir="rtl"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 left-0 flex items-center pl-3 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
                >
                  نسيت كلمة المرور؟
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
            >
              تسجيل الدخول
            </button>
          </form>

          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-sm text-gray-600">
              ليس لديك حساب؟{" "}
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
              >
                إنشاء حساب جديد
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden md:flex md:w-1/2 bg-blue-600 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-700 opacity-90"></div>
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-500 rounded-full opacity-50"></div>
        <div className="absolute -top-8 -right-8 w-48 h-48 bg-blue-500 rounded-full opacity-50"></div>
        <div className="relative z-10 text-center px-8">
          <div className="w-36 h-36 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
            <img
              src="/public/images/logo/white-square.png"
              alt="Logo"
              className="w-24 h-24"
            />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
            أهلا بك في سمساري
          </h2>
          <p className="text-lg sm:text-xl text-white opacity-90">
            منصة متكاملة لتسهيل تأجير الشقق والعقارات
          </p>
        </div>
      </div>
    </div>
  );
}
