import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Building } from "lucide-react";
import { useForm } from "react-hook-form";
import useAuthStore from "../../../store/auth.store.js";
import Loading from "../../../components/loading/Loading";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { register_tenant, loading, error } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {

    if (error) {
      setErrorMessage(
        error === "Email already exists"
          ? "البريد الإلكتروني مستخدم بالفعل."
          : "حدث خطأ أثناء إنشاء الحساب."
      );
    }


  }, [error]);



  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignup = async (data) => {
    console.log("Form submitted:", data);
    const signupData = {
      firstName: data.firstname,
      lastName: data.lastname,
      email: data.email,
      password: data.password,
    };

    const success = await register_tenant(signupData);
    if (success) {
      navigate("/verify-email", { state: { email: data.email } });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col md:flex-row-reverse h-screen w-full overflow-hidden bg-gray-50">
      <div className="w-full md:w-1/2 bg-white p-4 sm:p-8 flex flex-col justify-center overflow-y-auto">
        <div className="max-w-md mx-auto w-full">
          <div className="text-right">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              إنشاء حساب جديد
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
              انضم إلينا اليوم واستمتع بخدماتنا المميزة
            </p>
          </div>

          {errorMessage && <Error error={errorMessage} />}

          <form
            onSubmit={handleSubmit(handleSignup)}
            className="space-y-4 sm:space-y-6"
          >
            <div className="space-y-2">
              <label
                htmlFor="firstname"
                className="block text-sm font-medium text-gray-700 text-right"
              >
                الاسم الأول
              </label>
              <div className="relative">
                <input
                  id="firstname"
                  name="firstname"
                  required
                  {...register("firstname")}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2 sm:py-3 text-right pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="أدخل اسمك الأول"
                  dir="rtl"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="lastname"
                className="block text-sm font-medium text-gray-700 text-right"
              >
                اسم العائلة
              </label>
              <div className="relative">
                <input
                  id="lastname"
                  name="lastname"
                  required
                  {...register("lastname")}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2 sm:py-3 text-right pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="أدخل اسم عائلتك"
                  dir="rtl"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

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
                  // type="email"
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
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
            >
              إنشاء حساب
            </button>
          </form>

          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-sm text-gray-600">
              لديك حساب بالفعل؟{" "}
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
              >
                تسجيل الدخول
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden md:flex md:w-1/2 bg-blue-600 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-700 opacity-90"></div>
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-500 rounded-full opacity-50"></div>
        <div className="absolute -top-8 -right-8 w-48 h-48 bg-blue-500 rounded-full opacity-50"></div>

        <div className="relative z-10 text-center px-8 max-w-lg">
          <div className="w-20 h-20 mx-auto bg-white/10 p-4 rounded-full flex items-center justify-center backdrop-blur-sm mb-6">
            <Building className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
            سجل وتصفح كل العقارات
          </h2>
          <div className="space-y-4 text-right">
            <div className="flex items-center justify-end bg-white/10 p-3 rounded-lg backdrop-blur-sm">
              <p className="text-white mr-3">
                تصفح مئات الشقق بسهولة وفي مكان واحد
              </p>
              <div className="bg-emerald-400 rounded-full p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-center justify-end bg-white/10 p-3 rounded-lg backdrop-blur-sm">
              <p className="text-white mr-3">
                قراءة تقييمات وآراء مستأجرين سابقين قبل اتخاذ القرار
              </p>
              <div className="bg-emerald-400 rounded-full p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-center justify-end bg-white/10 p-3 rounded-lg backdrop-blur-sm">
              <p className="text-white mr-3">
                تواصل مباشر مع المالك وحجز الشقة بسهولة
              </p>
              <div className="bg-emerald-400 rounded-full p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
