const errorMessages = {
  "Email already exists.": "البريد الإلكتروني مستخدم من قبل",
  "Invalid credentials": "بيانات الدخول غير صحيحة",
  "User not found": "المستخدم غير موجود",
  "Something went wrong": "حدث خطأ ما",
  "Invalid OTP or OTP has expired.": "رمز التحقق غير صالح أو منتهي الصلاحية",
};

const translateError = (englishMsg) => {
  return errorMessages[englishMsg] || "حدث خطأ غير متوقع";
};

export { translateError };
