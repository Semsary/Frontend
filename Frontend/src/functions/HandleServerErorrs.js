const errorMessages = {
  "email already exists": "البريد الإلكتروني مستخدم من قبل",
  "invalid credentials": "بيانات الدخول غير صحيحة",
  "user not found": "المستخدم غير موجود",
  "something went wrong": "حدث خطأ ما",
  "invalid otp": "رمز التحقق غير صالح",
  "expired otp": "رمز التحقق منتهي الصلاحية",
  "email not found": "البريد الإلكتروني غير موجود",
  "password too weak": "كلمة المرور ضعيفة جداً",
  "password mismatch": "كلمة المرور غير متطابقة",
  "validation failed": "بيانات غير صالحة",
  "too many requests": "طلبات كثيرة جداً، يرجى المحاولة لاحقاً",
  "unauthorized": "غير مصرح بالدخول",
  "forbidden": "غير مسموح بالوصول",
  "network error": "خطأ في الاتصال بالخادم",
  "timeout": "انتهى وقت الانتظار، يرجى المحاولة مرة أخرى",
  "Email already exists.": "البريد الإلكتروني مستخدم من قبل",
};

const translateError = (error) => {
  
  if (!error) return "حدث خطأ غير متوقع";

  
  if (typeof error === "object") {
    
    const message = error.response?.data || error.message || error.toString();
    return translateError(message);
  }

  
  const lowerCaseMsg = error.toString().toLowerCase().trim();

  
  if (errorMessages[lowerCaseMsg]) {
    return errorMessages[lowerCaseMsg];
  }

  
  for (const [key, value] of Object.entries(errorMessages)) {
    if (lowerCaseMsg.includes(key)) {
      return value;
    }
  }

  
  return "حدث خطأ غير متوقع";
};

export { translateError };
