import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Loader2, LockKeyhole } from "lucide-react";
// import axiosInstance from "../../../config/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { useNavigate } from "react-router-dom";
import axiosInstance from './../../config/api/axiosInstance';

const VerifyCode = () => {
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

    const navigate = useNavigate();
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axiosInstance.post("/auth/verifypasswordresetcode", data);
      toast.success("تم التحقق من الكود بنجاح");
        navigate("/reset-password");
    } catch (err) {
        console.log("Error:", err)
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
          تحقق من الكود
        </h2>
        <p className="text-gray-700 text-center mb8 text-lg">
          تم إرسال كود التحقق إلى بريدك الإلكتروني
        </p>
        <p className="text-gray-700 text-center mb-8 text-lg">
           سينتهي خلال {minutes}:
          {seconds < 10 ? `0${seconds}` : seconds} دقيقة
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 text-right"
        >
          <div className="space-y-2">
            <Label htmlFor="resetCode" className="text-gray-700 text-lg">
              كود التحقق
            </Label>
            <div className="relative">
              <Input
                id="resetCode"
                type="text"
                placeholder="أدخل الكود المرسل"
                {...register("resetCode", { required: "كود التحقق مطلوب" })}
                className={`pr-12 bg-white/70 border-gray-300 text-gray-900 text-right rounded-xl py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-300 ${
                  errors.resetCode ? "border-red-500" : ""
                }`}
              />
              <LockKeyhole
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={20}
              />
            </div>
            {errors.resetCode && (
              <p className="text-red-500 text-sm mt-1 font-medium">
                {errors.resetCode.message}
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
                جاري التحقق...
              </>
            ) : (
              "تحقق"
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default VerifyCode;
