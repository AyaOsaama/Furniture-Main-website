import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../../../axios/axios';
import { useSelector } from 'react-redux';
import i18n from '../../../../i18n';

function ProductRatings({ productId }) {
  const { t } = useTranslation('productdetails');
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState({ en: '', ar: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentLang = i18n.language;
  
  const user = useSelector((state) => state?.auth?.user);

  useEffect(() => {
    if (productId) {
      fetchRatings();
    }
  }, [productId]);

  const fetchRatings = async () => {
    try {
      const response = await api.get(`/ratings`);

      if (response.data && Array.isArray(response.data.ratings)) {
        // تصفية التقييمات حسب المنتج المعروض
        const productRatings = response.data.ratings.filter(rating => {
          // التحقق من وجود productId و _id
          if (!rating.productId || !rating.productId._id) {
            return false;
          }

          // مقارنة معرف المنتج من الكائن
          const ratingProductId = String(rating.productId._id);
          const currentProductId = String(productId);
          
          const isMatch = ratingProductId === currentProductId;
     
          
          return isMatch;
        });
        
        setRatings(productRatings);
      } else {
        setRatings([]);
      }
    } catch (err) {
      console.error('Error fetching ratings:', err);
      setError(t('errorLoadingRatings'));
      setRatings([]);
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError(t('loginRequired'));
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/ratings', {
        productId,
        value: userRating,
        comment: {
          en: comment.en,
          ar: comment.ar
        }
      });

      if (response.data) {
        await fetchRatings();
        setUserRating(0);
        setComment({ en: '', ar: '' });
        setError(null);
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
      setError(t('errorSubmittingRating'));
    } finally {
      setLoading(false);
    }
  };

  const averageRating = useMemo(() => {
    if (!ratings.length) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.value, 0);
    return sum / ratings.length;
  }, [ratings]);

  // Render stars with support for half-stars
  const renderStars = (rating, size = 'md') => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
    const totalStars = 5;
    // اختر الحجم المناسب
    const sizeClass = size === 'sm' ? 'w-5 h-5' : size === 'sm' ? 'w-3 h-3' : 'w-3 h-3';

    return (
      <div className={`rating rating-half flex`}>
        {[...Array(totalStars)].map((_, i) => {
          if (i < fullStars) {
            return (
              <input
                key={i}
                type="radio"
                className={`mask mask-star-2 bg-yellow-400 ${sizeClass}`}
                checked
                readOnly
              />
            );
          }
          if (i === fullStars && hasHalf) {
            return (
              <input
                key={i}
                type="radio"
                className={`mask mask-star-2 mask-half-1 bg-yellow-400 ${sizeClass}`}
                checked
                readOnly
              />
            );
          }
          return (
            <input
              key={i}
              type="radio"
              className={`mask mask-star-2 bg-gray-300 ${sizeClass}`}
              readOnly
            />
          );
        })}
      </div>
    );
  };

  // إزالة التكرار بناءً على _id
  const uniqueRatings = ratings.filter((rating, idx, arr) =>
    arr.findIndex(r => r._id === rating._id) === idx
  );

  if (!ratings.length && !user) {
    return null;
  }

  return (
    <div className="card bg-base-100 shadow-xl mt-8 w-full">
      <div className="card-body p-4 md:p-6">
        <h2 className="card-title text-2xl font-bold mb-6 text-gray-500">{t('ratingsAndReviews')}</h2>
        
        {/* عرض متوسط التقييم فقط إذا كان هناك تقييمات */}
        {uniqueRatings.length > 0 && (
          <div className="flex flex-col md:flex-row items-center gap-4 mb-8 bg-base-200 p-4 rounded-lg">
            <div className="text-5xl font-bold text-gray-600">{averageRating.toFixed(1)}</div>
            <div className="flex flex-col items-center md:items-start">
              {renderStars(averageRating)}
              <span className="text-sm text-gray-500 mt-2">
                {uniqueRatings.length} {t('reviews')}
              </span>
            </div>
          </div>
        )}

        {user && (
          <form onSubmit={handleRatingSubmit} className="mb-8 bg-base-200 p-4 rounded-lg">
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-lg font-semibold">{t('yourRating')}</span>
              </label>
              <div className="rating rating-lg">
                {[1, 2, 3, 4, 5].map((star) => (
                  <input
                    key={star}
                    type="radio"
                    name="rating"
                    className="mask mask-star-2 bg-orange-400 hover:bg-orange-500 transition-colors"
                    checked={star === userRating}
                    onChange={() => setUserRating(star)}
                  />
                ))}
              </div>
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-lg font-semibold">{t('yourComment')}</span>
              </label>
              <textarea
                value={comment[currentLang] ||comment.ar||comment.en}
                onChange={(e) => setComment(prev => ({
                  ...prev,
                  [currentLang]: e.target.value
                }))}
                className="textarea textarea-bordered h-24 focus:border-primary focus:outline-none transition-colors"
                placeholder={t('writeYourReview')}
              />
            </div>

            {error && (
              <div className="alert alert-error mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || userRating === 0}
              className={`btn btn-primary w-full md:w-auto ${loading ? 'loading' : ''}`}
            >
              {loading ? t('submitting') : t('submitReview')}
            </button>
          </form>
        )}

        {/* عرض التقييمات المطابقة فقط */}
        {uniqueRatings.length > 0 ? (
          <div className="space-y-4">
            {uniqueRatings.map((rating) => (
              <div key={rating._id} className="card bg-base-200 hover:bg-base-300 transition-colors">
                <div className="card-body p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-10">
                          <span className="text-lg">
                            <img src={rating.userId?.image} alt="User Avatar" />
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold">
                          {rating.userId?.userName?.[currentLang] || t('anonymous')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStars(rating.value, 'sm')}
                      <span className="text-sm font-medium">{rating.value}/5</span>
                    </div>
                  </div>
                  {rating.comment?.[currentLang]||rating.comment.ar||rating.comment.en && (
                    <p className="text-base-content mt-2 leading-relaxed">
                      {rating.comment[currentLang]||rating.comment.ar||rating.comment.en}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 bg-base-200 p-8 rounded-lg">
            {t('noRatings')}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductRatings; 