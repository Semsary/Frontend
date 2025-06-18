import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Home } from "lucide-react";
import { useForm } from "react-hook-form";
import useAuthStore from "../../store/auth.store.js";
import Loading from "../../components/loading/Loading.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function ArabicLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("tenant"); // Default to tenant
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
      <main className="flex flex-col md:flex-row-reverse min-h-screen w-full overflow-hidden bg-gradient-to-b from-gray-50 to-blue-50/30">
        {/* Mobile Header with Logo - Only visible on small screens */}
        <div className="md:hidden bg-white shadow-sm border-b border-gray-100">
          <div className="flex items-center justify-center py-6 px-4">
            <Link
              to="/"
              aria-label="سمساري - الصفحة الرئيسية"
              className="flex items-center space-x-3 space-x-reverse">
              <div className="text-right mr-3">
                <h1 className="text-xl font-bold text-gray-900">سمساري</h1>
                <p className="text-xs text-gray-500">منصة العقارات الذكية</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <img
                  src="/images/logo/white-square.png"
                  alt="شعار سمساري"
                  className="w-8 h-8"
                  width="32"
                  height="32"
                  loading="eager"
                />
              </div>
            </Link>
          </div>
        </div>

        <section className="w-full md:w-1/2 bg-white md:bg-white p-4 sm:p-8 flex flex-col justify-center overflow-y-auto min-h-screen md:min-h-auto">
          <div className="max-w-md mx-auto w-full">
            {/* Mobile-optimized header */}
            <header className="text-right mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                مرحباً بعودتك
              </h1>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                سجّل دخولك للوصول إلى حسابك والاستمتاع بخدماتنا
              </p>
            </header>

            {/* User Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 text-right mb-3">
                نوع الحساب
              </label>
              <div className="bg-gray-100 rounded-xl p-1 flex">
                <button
                  type="button"
                  onClick={() => setUserType("tenant")}
                  className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    userType === "tenant"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  مستأجر
                  <User className="w-4 h-4 ml-2" />
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("landlord")}
                  className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    userType === "landlord"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  مالك عقار
                  <Home className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>

            {/* Enhanced form container */}
            <div className="bg-white md:bg-transparent rounded-2xl md:rounded-none shadow-lg md:shadow-none border border-gray-100 md:border-none p-6 md:p-0 -mx-2 md:mx-0">
              <form
                onSubmit={handleSubmit(handleLogin)}
                className="space-y-5 md:space-y-6"
                noValidate
                aria-label="نموذج تسجيل الدخول"
              >
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 text-right mb-2"
                  >
                    البريد الإلكتروني{" "}
                    <span className="text-red-500" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <div className="relative group">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      {...register("email", {
                        required: "البريد الإلكتروني مطلوب",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "البريد الإلكتروني غير صحيح"
                        }
                      })}
                      className={`block w-full rounded-xl border-2 ${errors.email
                          ? "border-red-300 bg-red-50/30"
                          : "border-gray-200 bg-gray-50/50"
                        } px-4 py-4 md:py-3 text-right pr-12 focus:ring-0 focus:border-blue-500 focus:bg-white transition-all duration-200 text-base md:text-sm placeholder:text-gray-400`}
                      placeholder="example@email.com"
                      dir="rtl"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <Mail
                        className={`h-5 w-5 transition-colors ${errors.email
                            ? "text-red-400"
                            : "text-gray-400 group-focus-within:text-blue-500"
                          }`}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  {errors.email && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                      <p
                        id="email-error"
                        className="text-red-600 text-sm text-right font-medium"
                        role="alert"
                      >
                        {errors.email.message}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 text-right mb-2"
                  >
                    كلمة المرور{" "}
                    <span className="text-red-500" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <div className="relative group">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      aria-invalid={errors.password ? "true" : "false"}
                      aria-describedby={
                        errors.password ? "password-error" : "password-help"
                      }
                      {...register("password", {
                        required: "كلمة المرور مطلوبة",
                        minLength: {
                          value: 6,
                          message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
                        }
                      })}
                      className={`block w-full rounded-xl border-2 ${errors.password
                          ? "border-red-300 bg-red-50/30"
                          : "border-gray-200 bg-gray-50/50"
                        } px-4 py-4 md:py-3 text-right pr-12 pl-12 focus:ring-0 focus:border-blue-500 focus:bg-white transition-all duration-200 text-base md:text-sm placeholder:text-gray-400`}
                      placeholder="••••••••"
                      dir="rtl"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <Lock
                        className={`h-5 w-5 transition-colors ${errors.password
                            ? "text-red-400"
                            : "text-gray-400 group-focus-within:text-blue-500"
                          }`}
                        aria-hidden="true"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 left-0 flex items-center pl-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-xl transition-colors duration-200 hover:bg-gray-50"
                      aria-label={
                        showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                      <p
                        id="password-error"
                        className="text-red-600 text-sm text-right font-medium"
                        role="alert"
                      >
                        {errors.password.message}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center pt-2">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-blue-50"
                  >
                    هل نسيت كلمة المرور؟
                  </Link>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
                    <p className="text-red-600 text-sm text-center font-medium">
                      {error}
                    </p>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="w-full flex justify-center items-center py-4 md:py-3 px-4 border border-transparent rounded-xl shadow-sm text-base md:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                    aria-describedby="login-help"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin ml-2"></div>
                        جاري التحميل...
                      </>
                    ) : (
                      "تسجيل الدخول"
                    )}
                  </button>
                  <p id="login-help" className="sr-only">
                    اضغط للدخول إلى حسابك
                  </p>
                </div>
              </form>
            </div>

            <footer className="mt-8 text-center">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-sm text-gray-600">
                  ليس لديك حساب؟{" "}
                  <Link
                    to={userType === "landlord" ? "/signup/landlord" : "/signup"}
                    className="font-semibold text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded px-1 transition-colors duration-200"
                  >
                    إنشاء حساب {userType === "landlord" ? "مالك عقار" : "مستأجر"}
                  </Link>
                </p>
              </div>
            </footer>

            {/* Mobile bottom spacing */}
            <div className="h-8 md:hidden"></div>
          </div>
        </section>

        {/* Desktop sidebar - unchanged */}
        <aside
          className="hidden md:flex md:w-1/2 bg-blue-600 items-center justify-center relative overflow-hidden"
          aria-label="معلومات عن المنصة"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-700 opacity-90"></div>
          <div
            className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-500 rounded-full opacity-50"
            aria-hidden="true"
          ></div>
          <div
            className="absolute -top-8 -right-8 w-48 h-48 bg-blue-500 rounded-full opacity-50"
            aria-hidden="true"
          ></div>
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
