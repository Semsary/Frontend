import React, { useState } from 'react';
import { Star, X, Send } from 'lucide-react';

const RatingModal = ({ request, closeModal, onRatingSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleStarClick = (starValue) => {
        setRating(starValue);
    };

    const handleStarHover = (starValue) => {
        setHoveredRating(starValue);
    };

    const handleStarLeave = () => {
        setHoveredRating(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            alert('يرجى اختيار تقييم');
            return;
        }


        setLoading(true);
        try {
            await onRatingSubmit(request.rentalId, rating, comment, request.houseId);
            // console.log('Rating submitted:', {
            //     request
            // })
            
            closeModal();
        } catch (error) {
            console.error('Error submitting rating:', error);
            alert('حدث خطأ أثناء إرسال التقييم');
        } finally {
            setLoading(false);
        }
    };

    const getRatingText = (ratingValue) => {
        switch (ratingValue) {
            case 1: return 'سيء جداً';
            case 2: return 'سيء';
            case 3: return 'متوسط';
            case 4: return 'جيد';
            case 5: return 'ممتاز';
            default: return '  ';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">قيم تجربتك</h2>
                    <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Request Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-2">
                            طلب رقم #{request.rentalId}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {request.firstname} {request.lastname}
                        </p>
                    </div>

                    {/* Star Rating */}
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            كيف كانت تجربتك؟
                        </h3>

                        <div className="flex justify-center gap-2 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleStarClick(star)}
                                    onMouseEnter={() => handleStarHover(star)}
                                    onMouseLeave={handleStarLeave}
                                    className="transition-all duration-200 transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-10 h-10 ${star <= (hoveredRating || rating)
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>


                        <p className="text-sm font-medium h-5 text-gray-700">
                            {getRatingText(hoveredRating || rating)}
                        </p>

                    </div>

                    {/* Comment */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            أضف تعليق 
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="شاركنا رأيك حول تجربتك..."
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            maxLength={500}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {comment.length}/500 حرف
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={loading}
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={rating === 0 || loading}
                            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    <span>إرسال التقييم</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RatingModal;
