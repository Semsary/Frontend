import React, { useEffect, useState } from 'react'
import {
  Home,
  Plus,
  X,
} from "lucide-react";
import HomesGrid from '../components/HomesGrid';
import { getAllGovernorates, getCitiesByGovernorateId } from 'egylist';
import { useForm } from 'react-hook-form';
import useHouseStore from '../../../store/house.store';
import { toast } from 'sonner';
import InspectModal from '../components/InspectModal';

const AddHomeTab = () => {

  const GovernorateList = getAllGovernorates();
  const { createHouse } = useHouseStore()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGovern, setSelectedGovern] = useState(null);
  const [cities, setCities] = useState([]);


  useEffect(() => {
    const handelCities = async () => {
      if (selectedGovern) {
        const citiesData = await getCitiesByGovernorateId(selectedGovern);
        setCities(citiesData);
      } else {
        setCities([]);
      }
    }
    handelCities();
  }, [selectedGovern]);

  const {
    register,
    handleSubmit,
    reset,
  } = useForm();


  const Submit = async (data) => {
    console.log("Form Data:", data);

    if (!data.governorate || !data.city || !data.location) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    const save = await createHouse({
      governorate: data.governorate,
      city: data.city,
      location: data.location,
    });
    if (save) {
      closeModal();
      toast.success("تم إضافة العقار بنجاح");
      reset();
    } else {
      toast.error("حدث خطأ أثناء إضافة العقار");
    }
  };

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
          <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-800">
            <Home className="h-5 w-5 text-indigo-600" />
            <span>

              إضافة عقار جديد (طلب معاينة)
            </span>
          </h2>
          <button
            onClick={openModal}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-indigo-200"
          >
            <Plus className="h-4 w-4" />
            <span>إضافة عقار</span>
          </button>
        </div>

        <HomesGrid />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
            لا توجد عقارات لعرضها
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Home className="h-5 w-5 text-indigo-600" />
                إضافة عقار جديد
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form className="space-y-4"
              onSubmit={handleSubmit(Submit)}
            >

              <div className="p-6">
                <div className="space-y-4">
                  {/* Property Type Select */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اسم المحافظة
                    </label>
                    <select
                      name="governorate"
                      {...register("governorate")}
                      onChange={(e) => setSelectedGovern(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      required
                    >
                      <option value="" disabled selected>
                        اختر المحافظة
                      </option>
                      {
                        GovernorateList.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name_ar}
                          </option>
                        ))
                      }
                    </select>
                  </div>
                  {
                    selectedGovern && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          اسم المدينة
                        </label>
                        <select
                          name="city"
                          {...register("city")}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          required
                        >
                          {
                            cities.map((city) => (
                              <option key={city.id} value={city.name_ar}>
                                {city.name_ar}
                              </option>
                            ))
                          }
                        </select>
                      </div>)}

                  {/* Property Name Input */}

                  {/* Location Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الموقع
                    </label>
                    <input
                      type="text"
                      name="location"
                      {...register("location")}

                      placeholder="أدخل موقع العقار"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-indigo-200"
                  >
                    إضافة العقار
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddHomeTab