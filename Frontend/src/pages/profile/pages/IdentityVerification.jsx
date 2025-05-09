import { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Upload,
  Check,
  AlertCircle,
  User,
  CreditCard,
} from "lucide-react";
import axiosInstance, { axiosInstanceFile } from "../../../config/api/axiosInstance";

// Main component
export default function IdentityVerificationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [files, setFiles] = useState({
    idFront: null,
    idBack: null,
    selfie: null,
  });
  const [previewUrls, setPreviewUrls] = useState({
    idFront: null,
    idBack: null,
    selfie: null,
  });
  const [errors, setErrors] = useState({
    idFront: null,
    idBack: null,
    selfie: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const steps = [
    {
      title: "بطاقة الهوية (الوجه)",
      description: "قم برفع صورة واضحة للوجه الأمامي من بطاقة الهوية الشخصية",
      fieldName: "idFront",
      icon: <CreditCard className="w-6 h-6" />,
    },
    {
      title: "بطاقة الهوية (الظهر)",
      description: "قم برفع صورة واضحة للوجه الخلفي من بطاقة الهوية الشخصية",
      fieldName: "idBack",
      icon: <CreditCard className="w-6 h-6" />,
    },
    {
      title: "الصورة الشخصية",
      description: "قم برفع صورة شخصية واضحة لوجهك",
      fieldName: "selfie",
      icon: <User className="w-6 h-6" />,
    },
  ];

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, [fieldName]: "يرجى رفع ملف صورة فقط" }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB max
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "حجم الصورة يجب أن يكون أقل من 5 ميجابايت",
      }));
      return;
    }

    // Clear error and set file
    setErrors((prev) => ({ ...prev, [fieldName]: null }));
    setFiles((prev) => ({ ...prev, [fieldName]: file }));

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrls((prev) => ({ ...prev, [fieldName]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    const currentField = steps[currentStep].fieldName;

    if (!files[currentField]) {
      setErrors((prev) => ({ ...prev, [currentField]: "هذا الحقل مطلوب" }));
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    const saveFiles = async () => {
      const res = await axiosInstance.post(
        "/Auth/SubmitIdentity",
        {
          IdentityFront: files.idFront,
          IdentityBack: files.idBack,
          UserImage: files.selfie,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response from server:", res);
    };
    saveFiles();
      setIsSubmitting(false);

    // Simulate API call
    // setTimeout(() => {
    //   setIsSubmitted(true);
    // }, 2000);
  };

  if (isSubmitted) {
    return (
      <div
        className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md"
        dir="rtl"
      >
        <div className="text-center" dir="rtl">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="mt-3 text-lg font-medium text-gray-900">
            تم إرسال البيانات بنجاح
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            شكراً لك، تم استلام بياناتك وسيتم مراجعتها في أقرب وقت ممكن.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md"
      dir="rtl"
    >
      <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
        توثيق الهوية
      </h1>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  index < currentStep
                    ? "bg-blue-600 text-white"
                    : index === currentStep
                    ? "bg-blue-100 text-blue-600 border-2 border-blue-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {index < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className="text-xs mt-1 text-gray-500">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="relative">
          <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 rounded"></div>
          <div
            className="absolute top-1/2 transform -translate-y-1/2 h-1 bg-blue-600 rounded transition-all duration-300"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Current step content */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <div className="mr-2 text-blue-600">{steps[currentStep].icon}</div>
          <h2 className="text-xl font-semibold text-gray-800">
            {steps[currentStep].title}
          </h2>
        </div>
        <p className="text-gray-600 mb-4">{steps[currentStep].description}</p>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors relative">
          <input
            type="file"
            id={`file-${currentStep}`}
            onChange={(e) => handleFileChange(e, steps[currentStep].fieldName)}
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {previewUrls[steps[currentStep].fieldName] ? (
            <div>
              <img
                src={previewUrls[steps[currentStep].fieldName]}
                alt="Preview"
                className="max-h-64 mx-auto rounded"
              />
              <p className="mt-2 text-sm text-gray-500">انقر لتغيير الصورة</p>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm font-medium text-gray-900">
                انقر لرفع صورة
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PNG، JPG، GIF حتى 5 ميجابايت
              </p>
            </div>
          )}
        </div>

        {errors[steps[currentStep].fieldName] && (
          <div className="mt-2 text-red-600 text-sm flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            <span>{errors[steps[currentStep].fieldName]}</span>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className={`px-4 py-2 flex items-center rounded-md ${
            currentStep === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <ChevronRight className="w-5 h-5 ml-1" />
          السابق
        </button>

        <button
          onClick={handleNext}
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          {isSubmitting ? (
            <span>جاري الإرسال...</span>
          ) : (
            <>
              {currentStep === steps.length - 1 ? "إرسال" : "التالي"}
              <ChevronLeft className="w-5 h-5 mr-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
