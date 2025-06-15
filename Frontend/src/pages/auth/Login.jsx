import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import useAuthStore from "../../store/auth.store.js";
import Loading from "../../components/loading/Loading.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function ArabicLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  useEffect(() => {
    if (email) {
      reset({ email });
    }
  }, [email, reset]);

  const { login, loading, error } = useAuthStore();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (data) => {
    try {
      const res = await login(data.email, data.password);
      if (res) {
        navigate("/profile");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  if (loading) return <Loading />;

  return (
    <>


      <main className="flex flex-col md:flex-row-reverse h-screen w-full overflow-hidden bg-gray-50">
        <section className="w-full md:w-1/2 bg-white p-4 sm:p-8 flex flex-col justify-center overflow-y-auto">
          <div className="max-w-md mx-auto w-full">
            <header className="text-right">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                تسجيل الدخول
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                مرحبًا بعودتك! يرجى تسجيل الدخول للوصول إلى حسابك
              </p>
            </header>

            <form
              onSubmit={handleSubmit(handleLogin)}
              className="space-y-4 sm:space-y-6"
              noValidate
              aria-label="نموذج تسجيل الدخول"
            >
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 text-right"
                >
                  البريد الإلكتروني <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    {...register("email", {
                      required: "البريد الإلكتروني مطلوب",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "البريد الإلكتروني غير صحيح"
                      }
                    })}
                    className={`block w-full rounded-lg border ${errors.email ? 'border-red-300' : 'border-gray-300'} px-4 py-2 sm:py-3 text-right pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                    placeholder="أدخل بريدك الإلكتروني"
                    dir="rtl"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                </div>
                {errors.email && (
                  <p id="email-error" className="text-red-600 text-sm text-right" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 text-right"
                >
                  كلمة المرور <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    aria-invalid={errors.password ? 'true' : 'false'}
                    aria-describedby={errors.password ? 'password-error' : 'password-help'}
                    {...register("password", {
                      required: "كلمة المرور مطلوبة",
                      minLength: {
                        value: 6,
                        message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
                      }
                    })}
                    className={`block w-full rounded-lg border ${errors.password ? 'border-red-300' : 'border-gray-300'} px-4 py-2 sm:py-3 text-right pr-10 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                    placeholder="أدخل كلمة المرور"
                    dir="rtl"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 left-0 flex items-center pl-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
                    aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="text-red-600 text-sm text-right" role="alert">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded underline"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
                  <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                aria-describedby="login-help"
              >
                {isSubmitting ? "جاري التحميل..." : "تسجيل الدخول"}
              </button>
              <p id="login-help" className="sr-only">
                اضغط للدخول إلى حسابك
              </p>
            </form>

            <footer className="mt-6 sm:mt-8 text-center">
              <p className="text-sm text-gray-600">
                ليس لديك حساب؟{" "}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded underline"
                >
                  إنشاء حساب جديد
                </Link>
              </p>
            </footer>
          </div>
        </section>

        <aside className="hidden md:flex md:w-1/2 bg-blue-600 items-center justify-center relative overflow-hidden" aria-label="معلومات عن المنصة">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-700 opacity-90"></div>
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-500 rounded-full opacity-50" aria-hidden="true"></div>
          <div className="absolute -top-8 -right-8 w-48 h-48 bg-blue-500 rounded-full opacity-50" aria-hidden="true"></div>
          <div className="relative z-10 text-center px-8">
            <div className="w-36 h-36 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <img
                src="/images/logo/white-square.png"
                alt="شعار سمساري"
                className="w-24 h-24"
                width="96"
                height="96"
                loading="eager"
              />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
              أهلا بك في سمساري
            </h2>
            <p className="text-lg sm:text-xl text-white opacity-90">
              منصة متكاملة لتسهيل تأجير الشقق والعقارات
            </p>
          </div>
        </aside>
      </main>
    </>
  );
}
