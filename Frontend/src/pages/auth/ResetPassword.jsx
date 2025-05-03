import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FileDigit, Mail } from "lucide-react";
import useAuthStore from "../../store/auth.store.js";
import Loading from "../../components/loading/Loading.jsx";
import { Link, useNavigate } from "react-router-dom";
import Error from "../../components/errors/Error.jsx";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Lock } from "lucide-react";
import { isValidEmail } from "../../functions/CheckData.js";

// Define the validation schema
const resetPasswordSchema = z.object({
  code: z.string()
    .length(6, "الكود يجب أن يتكون من 6 أرقام")
    .regex(/^\d+$/, "يجب أن يحتوي الكود على أرقام فقط"),
  password: z.string()
    .min(8, "كلمة المرور يجب أن تكون على الأقل 8 أحرف")
    .regex(/[A-Z]/, "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل")
    .regex(/[0-9]/, "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل")
    .regex(/[^A-Za-z0-9]/, "يجب أن تحتوي كلمة المرور على حرف خاص واحد على الأقل"),
  "confirm-password": z.string()
}).refine(data => data.password === data["confirm-password"], {
  message: "كلمات المرور غير متطابقة",
  path: ["confirm-password"]
});

const ForgotPassword = () => {
  const { 
    register, 
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(resetPasswordSchema)
  });
  
  const navigate = useNavigate();
  const { loading, error, resetPassword } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    let stored = localStorage.getItem("auth-storage");
    stored = JSON.parse(stored);
    const storedEmail = stored?.state?.rest_pass_email;

    if (storedEmail && isValidEmail(storedEmail)) {
      setEmail(storedEmail);
    } else {
      if (!isValidEmail(storedEmail)) alert("Hi haker, i handle this  :') ");
      setErrorMessage("No email found in local storage.");
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleResetPassword = async (data) => {
    console.log("Reset password submitted:", data);
    const res = await resetPassword(email, data.code, data.password);
    if (res) navigate("/profile");
  };

  if (loading) return <Loading />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 text-center">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              كلمة المرور الجديدة
            </h1>
           
          {email && (
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              تم إرسال كود التفعيل إلى بريدك الإلكتروني
              <span className="font-semibold text-blue-600 mx-1">{email}</span>
              يرجى التحقق من صندوق الوارد الخاص بك.
            </p>
          )}
          </div>

          {errorMessage && <Error error={errorMessage} />}
          {error && <Error error={error} />}

          <form
            onSubmit={handleSubmit(handleResetPassword)}
            className="space-y-4 sm:space-y-6"
          >
            <div className="space-y-2">
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700 text-right"
              >
                كود التحقق
              </label>
              <div className="relative">
                <input
                  id="code"
                  name="code"
                  required
                  {...register("code")}
                  className={`block w-full rounded-lg border ${errors.code ? "border-red-500" : "border-gray-300"} px-4 py-2 sm:py-3 text-right pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                  placeholder="أدخل كود التحقق"
                  dir="rtl"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FileDigit className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              {errors.code && (
                <p className="text-red-500 text-sm text-right">{errors.code.message}</p>
              )}
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
                  className={`block w-full rounded-lg border ${errors.password ? "border-red-500" : "border-gray-300"} px-4 py-2 sm:py-3 text-right pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
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
              {errors.password && (
                <p className="text-red-500 text-sm text-right">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 text-right"
              >
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showPassword ? "text" : "password"}
                  required
                  {...register("confirm-password")}
                  className={`block w-full rounded-lg border ${errors["confirm-password"] ? "border-red-500" : "border-gray-300"} px-4 py-2 sm:py-3 text-right pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                  placeholder="أعد إدخال كلمة المرور"
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
              {errors["confirm-password"] && (
                <p className="text-red-500 text-sm text-right">{errors["confirm-password"].message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
            >
              تغيير كلمة المرور
            </button>
          </form>

          <div className="mt-6 text-sm text-gray-600">
            تذكرت كلمة المرور؟{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              العودة لتسجيل الدخول
            </Link>
          </div>
        </div>

        <div className="bg-blue-600 p-6 text-center text-white">
          <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm mb-4">
            <img
              src="/public/images/logo/white-square.png"
              alt="Logo"
              className="w-12 h-12"
            />
          </div>
          <h2 className="text-xl font-bold mb-2"> سمساري</h2>
          <p className="text-sm opacity-90">
            منصة متكاملة لتسهيل تأجير الشقق والعقارات
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;