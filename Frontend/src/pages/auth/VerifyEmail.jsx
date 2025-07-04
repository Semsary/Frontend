import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Building,
  MailCheck,
} from "lucide-react";
import { useForm } from "react-hook-form";
import Loading from "../../components/loading/Loading";
import Error from "../../components/errors/Error.jsx";
import useAuthStore from "../../store/auth.store.js";
import { isValidEmail } from "../../functions/CheckData.js";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const { register, handleSubmit } = useForm();
  const { verifyEmail, loading, error } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);

  useEffect(() => {
    let stored = localStorage.getItem("auth-storage");
    stored = JSON.parse(stored);
    const storedEmail = stored?.state?.email;


    if (storedEmail && isValidEmail(storedEmail)) {
      setEmail(storedEmail);
    } else {
      if (!isValidEmail(storedEmail)) alert("Hi haker, i handle this  :') ");
      setErrorMessage("No email found in local storage.");
    }
  }, []);

  const handleSignup = async (data) => {
    const success = await verifyEmail(email, data.code);
    // console.log("success "+success);
    if (success) {
      navigate("/login", { state: { email } });
    } else {
      setErrorMessage("Invalid code. Please try again.");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col md:flex-row-reverse h-screen w-full overflow-hidden bg-gray-50">
      <div className="w-full md:w-1/2 bg-white p-4 sm:p-8 flex flex-col justify-center overflow-y-auto">
        {errorMessage ? (
          <Error
            error={
              "تاكد من أنك قمت بالتسجيل باستخدام بريد إلكتروني صالح." +
              " إذا كنت بحاجة إلى المساعدة، يرجى التواصل مع الدعم الفني."
            }
          />
        ) : (
          <div className="max-w-md mx-auto w-full">
            <div className="text-right">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                تاكيد البريد الإلكتروني
              </h1>

              <p
                className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed"
                dir="rtl"
              >
                تم إرسال كود التفعيل إلى بريدك الإلكتروني
                <span className="font-semibold text-blue-600 mx-1">
                  {email}
                </span>
                يرجى التحقق من صندوق الوارد الخاص بك.
              </p>
            </div>

            {error && <Error error={error} />}

            <form
              onSubmit={handleSubmit(handleSignup)}
              className="space-y-4 sm:space-y-6"
            >
              <div className="space-y-2">
                <label
                  htmlFor="code"
                  className="block text-sm font-semibold text-gray-800 text-right"
                >
                  الكود
                </label>
                <div className="relative">
                  <input
                    id="code"
                    name="code"
                    required
                    inputMode="numeric"
                    pattern="[0-9]*"
                    {...register("code")}
                    className="tracking-widest  text-center text-3xl font-bold rounded-xl border border-gray-300 bg-white px-4 py-2 w-full shadow-sm focus:outline-none focus:ring-2  focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-400"
                    placeholder=". . . . . . "
                    dir="ltr"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
              >
                تأكيد البريد الإلكتروني
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
        )}
      </div>

      <div className="hidden md:flex md:w-1/2 bg-blue-600 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-700 opacity-90"></div>
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-500 rounded-full opacity-50"></div>
        <div className="absolute -top-8 -right-8 w-48 h-48 bg-blue-500 rounded-full opacity-50"></div>

        <div className="relative z-10 text-center px-8 max-w-lg">
          <div className="w-20 h-20 mx-auto bg-white/10 p-4 rounded-full flex items-center justify-center backdrop-blur-sm mb-6">
            <MailCheck className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
            تم إرسال كود التفعيل إلى بريدك الإلكتروني
          </h2>
          <div className="space-y-4 text-right">
            <div className="flex items-center justify-end bg-white/10 p-3 rounded-lg backdrop-blur-sm">
              <p className="text-white mr-3">
                تأكد من التحقق من صندوق الوارد الخاص بك
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
                تحقق من مجلد البريد العشوائي أو غير المرغوب فيه
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
                إذا لم تتلق البريد الإلكتروني، يمكنك إعادة إرساله
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

export default VerifyEmail;
