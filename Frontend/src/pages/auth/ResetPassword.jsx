import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import axiosInstance from "./../../config/api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axiosInstance.post("/auth/resetpassword", data);
      toast.success("تم إعادة تعيين كلمة المرور بنجاح");
      navigate("/login");
    } catch (err) {
      console.log("Error:", err);
      toast.error("حدث خطأ. يرجى المحاولة مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-teal-300 via-white to-teal-500 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-10 rounded-3xl shadow-2xl backdrop-blur-md bg-white/80 border border-gray-200"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
          إعادة تعيين كلمة المرور
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 text-right"
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 text-lg">
              البريد الإلكتروني
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                {...register("email", { required: "البريد الإلكتروني مطلوب" })}
                className="pr-12 bg-white/70 border-gray-300 text-gray-900 text-right rounded-xl py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-300"
              />
              <Mail
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={20}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 text-lg">
              كلمة المرور الجديدة
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="أدخل كلمة المرور الجديدة"
                {...register("password", { required: "كلمة المرور مطلوبة" })}
                className="pr-12 bg-white/70 border-gray-300 text-gray-900 text-right rounded-xl py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-300"
              />
              <Lock
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={20}
              />
              <button
                type="button"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-700 text-lg">
              تأكيد كلمة المرور
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="أدخل تأكيد كلمة المرور"
                {...register("confirmPassword", {
                  required: "تأكيد كلمة المرور مطلوب",
                })}
                className="pr-12 bg-white/70 border-gray-300 text-gray-900 text-right rounded-xl py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-300"
              />
              <Lock
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={20}
              />
              <button
                type="button"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1 font-medium">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white text-lg py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                جاري إعادة تعيين...
              </>
            ) : (
              "إعادة تعيين كلمة المرور"
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
