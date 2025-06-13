import React, { useEffect, useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  User,
  Home,
  Lock,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  ChevronLeft,
  LogOut,
  Settings,
  Bell,
  Calendar,
  Shield,
  PieChart,
  Award,
  ArrowRight,
  FileText,
  Edit,
  Plus,
  Eye,
  Save,
  Image,
  Ruler,
  Users,
  Car,
  Building,
  Navigation,
} from "lucide-react";
import useProfileStore from '../../../store/profile.store';

const ProfileData = ({ showSuccess, defaultValues }) => {

  // Fix 1: Use proper selector with shallow comparison
  const { user, updateProfile } = useProfileStore();
  const [userData, setUserData] = useState({});
  // Fix 2: Memoize default values to prevent re-initialization
  const memoizedDefaultValues = useMemo(() => defaultValues || {
    Firstname: '',
    Lastname: '',
    Address: {
      id: 0,
      _gover: 0,
      _city: '',
      street: 's'
    },
    profileImageUrl: '',
    height: 0,
    gender: 0,
    age: 0,
    isSmoker: false,
    needPublicService: false,
    needPublicTransportation: false,
    needNearUniversity: false,
    needNearVitalPlaces: false
  }, [defaultValues]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    defaultValues: memoizedDefaultValues
  });

  const onSubmit = useCallback((data) => {
    console.log('Profile Data:', data);
    // showSuccess && showSuccess();
    updateProfile(data)
      .then(() => {
        console.log('Profile updated successfully');
        showSuccess && showSuccess();
      }
    )
      .catch((error) => {
        console.error('Error updating profile:', error);
        // Handle error (e.g., show error message)
      }
    );



  }, [showSuccess]);



  const [valuesSet, setValuesSet] = React.useState(false);

  useEffect(() => {
    if (user && !valuesSet) {
      // Set all values at once and mark as set
      setValue('Firstname', user.firstName || '');
      setValue('Lastname', user.lastName || '');
      setValue('Address._gover', Number(user.address?._gover) || 0);
      setValue('Address._city', user.address?._city || '');
      setValue('Address.street', user.address?.street || '');
      setValue('profileImageUrl', user.picture || '');
      setValue('height', Number(user.otherData?.height) || 0);
      setValue('gender', user.gender || 0);
      setValue('age', Number(user.age) || 0);
      setValue('isSmoker', user.isSmoker || false);
      setValue('needPublicService', user.needPublicService || false);
      setValue('needPublicTransportation', user.needPublicTransportation || false);
      setValue('needNearUniversity', user.needNearUniversity || false);
      setValue('needNearVitalPlaces', user.needNearVitalPlaces || false);
      console.log('Profile data set from userData:', user);
      setValuesSet(true);
    }
  }, [userData, setValue, valuesSet]);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-200 hover:shadow-lg transition-shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-1   border-gray-200">
              <User className="h-5 w-5 text-indigo-600" />
              المعلومات الشخصية
            </h3>
            <p className="text-sm text-gray-600 mb-4 pb-2 border-b">
              تساعدنا هذة البيانات في اقتراح افضل الشقق المناسبة لك
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الأول</label>
                <input
                  {...register('Firstname', { required: 'الاسم الأول مطلوب' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="أدخل الاسم الأول"
                />
                {errors.Firstname && <p className="text-red-500 text-sm mt-1">{errors.Firstname.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الأخير</label>
                <input
                  {...register('Lastname', { required: 'الاسم الأخير مطلوب' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="أدخل الاسم الأخير"
                />
                {errors.Lastname && <p className="text-red-500 text-sm mt-1">{errors.Lastname.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">العمر</label>
                <input
                  type="number"
                  {...register('age', { required: 'العمر مطلوب', min: { value: 1, message: 'العمر يجب أن يكون أكبر من 0' } })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="العمر"
                />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الطول (سم)</label>
                <input
                  type="number"
                  {...register('height')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="الطول"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الجنس</label>
                <select
                  {...register('gender')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                >
                  <option value={0}>ذكر</option>
                  <option value={1}>أنثى</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">رابط الصورة الشخصية</label>
              <input
                {...register('profileImageUrl')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="رابط الصورة الشخصية"
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-200">
              <MapPin className="h-5 w-5 text-indigo-600" />
              معلومات العنوان
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المحافظة</label>
                <input
                  type="number"
                  {...register('address._gover')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="رقم المحافظة"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المدينة</label>
                <input
                  {...register('address._city')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="اسم المدينة"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الشارع</label>
                <input
                  {...register('address.street')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="اسم الشارع"
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-200">
              <Settings className="h-5 w-5 text-indigo-600" />
              التفضيلات
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">مدخن</h4>
                    <p className="text-sm text-gray-600">هل أنت مدخن؟</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('isSmoker')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Building className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">الخدمات العامة</h4>
                    <p className="text-sm text-gray-600">بحاجة للخدمات العامة</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('needPublicService')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Car className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">المواصلات العامة</h4>
                    <p className="text-sm text-gray-600">بحاجة للمواصلات العامة</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('needPublicTransportation')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Shield className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">قرب الجامعة</h4>
                    <p className="text-sm text-gray-600">بحاجة للسكن قرب الجامعة</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('needNearUniversity')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Navigation className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">الأماكن الحيوية</h4>
                    <p className="text-sm text-gray-600">بحاجة للسكن قرب الأماكن الحيوية</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('needNearVitalPlaces')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-indigo-200 flex items-center gap-2 font-medium"
            >
              <Save className="h-5 w-5" />
              حفظ التغييرات
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ProfileData;