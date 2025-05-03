import { useForm } from "react-hook-form";
import { Mail } from "lucide-react";
import useAuthStore from "../../store/auth.store.js";
import Loading from "../../components/loading/Loading.jsx";
import { Link, useNavigate } from "react-router-dom";
import Error from "../../components/errors/Error.jsx";

const ForgotPassword = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { loading, error, forgotPassword } = useAuthStore();

  const handleResetPassword = async (data) => {
    console.log("Reset password submitted:", data);
    const res = await forgotPassword(data.email);
    console.log("Response from forgot password:", res);
    if (res) {

      navigate("/reset-password", { state: { email: data.email } });
    }
    
  };

  if (loading) return <Loading />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 text-center">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              إعادة تعيين كلمة المرور
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور
            </p>
          </div>

          {error && ( 
            <Error 
              error={error}
              title="خطأ في إعادة تعيين كلمة المرور"
            />
          )}

          <form
            onSubmit={handleSubmit(handleResetPassword)}
            className="space-y-6"
          >
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                {...register("email")}
                className="block w-full px-10 rounded-lg border border-gray-300   py-3 pl-10 text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="أدخل بريدك الإلكتروني"
                dir="rtl"
              />
            </div>


            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
            >
              إرسال كود إعادة تعيين
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
