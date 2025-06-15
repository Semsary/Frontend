import React from 'react';
import { DollarSign, Brain, Shield, BarChart3, Info } from 'lucide-react';

const EstematedPriceComponent = ({ houseData }) => {
    return (
        <div className="relative">
            {houseData?.house?.estimated_Price && (
                <div className="bg-blue-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4 mb-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                    السعر المقدر للعقار
                                </h4>

                            </div>
                        </div>

                        <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md">
                            <Shield className="w-4 h-4 text-green-600" />
                            <span className="text-xs font-medium text-green-700">موثوق</span>
                        </div>
                    </div>

                    {/* Price Display */}
                    <div className="bg-white rounded-md p-3 mb-3">
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-2xl font-bold text-gray-900">
                                {houseData.house.estimated_Price.toLocaleString('en-EG')}
                            </span>
                            <span className="text-sm font-medium text-gray-600">جنيه مصري</span>
                        </div>

                        {/* Market Position Indicator */}
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <BarChart3 className="w-3 h-3" />
                            <span>ضمن المتوسط السوقي للمنطقة</span>
                        </div>
                    </div>

                    {/* Key Information */}
                    <div className="space-y-3 mb-5">
                        <div className="flex items-start gap-3 text-sm">
                            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-gray-700 leading-relaxed">
                                    يمكن استخدام هذا التقدير كمرجع أساسي لتحديد أسعار التأجير والبيع المناسبة للعقار
                                </p>
                            </div>
                        </div>
                    </div>


                </div>
            )}
        </div>
    );
};

export default EstematedPriceComponent;