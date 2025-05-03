import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Building, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import Loading from "../../../components/loading/Loading";
import useAuthStore from "../../../store/auth.store.js";

export default function ArabicSignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signup, loading, error } = useAuthStore();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignup = (data) => {
    console.log("Form submitted:", data);
    const signupData = {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: data.password,
    };
    signup(signupData);
  };

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden bg-gray-50">
      <div className="w-full lg:w-3/5 bg-white p-4 sm:p-6 md:p-8 flex flex-col justify-center overflow-y-auto">
        <div className="max-w-md mx-auto w-full px-4">
          <div className="text-right mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              إنشاء حساب مالك عقار
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              سجل كمالك عقار واعرض عقاراتك للإيجار بكل سهولة
            </p>
          </div>

          <form onSubmit={handleSubmit(handleSignup)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-right pr-10 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
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
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-right pr-10 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    placeholder="أدخل اسم عائلتك"
                    dir="rtl"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
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
                  type="email"
                  required
                  {...register("email")}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-right pr-10 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
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
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 text-right"
              >
                رقم الهاتف
              </label>
              <div className="relative">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  {...register("phone")}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-right pr-10 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                  placeholder="أدخل رقم هاتفك"
                  dir="rtl"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
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
                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-right pr-10 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
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

            <div className="flex items-center justify-end">
              <div className="flex items-center">
                <label
                  htmlFor="terms"
                  className="mr-2 block text-sm text-gray-700 text-right"
                >
                  أوافق على{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    الشروط والأحكام
                  </a>
                </label>
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-right">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
            >
              إنشاء حساب
            </button>
          </form>

          <div className="mt-8 text-center">
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

      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-blue-500 to-blue-700 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-20 bg-white/5"></div>
        <div className="absolute bottom-0 right-0 w-full h-20 bg-black/5"></div>

        <div className="relative z-10 text-center px-8 max-w-lg">
          <div className="w-20 h-20 mx-auto bg-white/10 p-4 rounded-full flex items-center justify-center backdrop-blur-sm mb-6">
            <Building className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
            مزايا مالكي العقارات
          </h2>
          <div className="space-y-4 text-right">
            <div className="flex items-center justify-end bg-white/10 p-3 rounded-lg backdrop-blur-sm">
              <p className="text-white mr-3">
                عرض عقاراتك لآلاف المستأجرين المحتملين
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
                تحقق من خلفية المستأجرين المحتملين
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
                إدارة عقاراتك ومدفوعاتك من منصة واحدة
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
}
