import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../../../axios/axios';
import i18n from '../../../../i18n';

function ProductRatings({ productId }) {
  const { t } = useTranslation('productdetails');
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentLang = i18n.language;

  useEffect(() => {
    if (productId) {
      fetchRatings();
    }
  }, [productId]);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${productId}/ratings`);
      if (Array.isArray(response.data)) {
        setRatings(response.data);
      } else {
        setRatings([]);
      }
    } catch (err) {
      console.error('Error fetching ratings:', err);
      setError(t('errorLoadingRatings'));
      setRatings([]);
    } finally {
      setLoading(false);
    }
  };

  const averageRating = useMemo(() => {
    if (!ratings.length) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.value, 0);
    return sum / ratings.length;
  }, [ratings]);

  const renderStars = (rating, size = 'md') => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
    const sizeClass = size === 'sm' ? 'w-5 h-5' : 'w-3 h-3';

    return (
      <div className={`rating rating-half flex`}>
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <input key={i} type="radio" className={`mask mask-star-2 bg-yellow-400 ${sizeClass}`} checked readOnly />;
          }
          if (i === fullStars && hasHalf) {
            return <input key={i} type="radio" className={`mask mask-star-2 mask-half-1 bg-yellow-400 ${sizeClass}`} checked readOnly />;
          }
          return <input key={i} type="radio" className={`mask mask-star-2 bg-gray-300 ${sizeClass}`} readOnly />;
        })}
      </div>
    );
  };

  const uniqueRatings = ratings.filter((rating, idx, arr) =>
    arr.findIndex(r => r._id === rating._id) === idx
  );

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-xl mt-8 w-full">
        <div className="card-body p-4 md:p-6">
          <div className="flex justify-center items-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl mt-8 w-full">
      <div className="card-body p-4 md:p-6">
        <h2 className="card-title text-2xl font-bold mb-6 text-gray-500">{t('ratingsAndReviews')}</h2>

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
                            {rating.userId?.image ? (
                              <img src={rating.userId.image} alt="User Avatar" />
                            ) : (
                              <span>{rating.userId?.userName?.[currentLang]?.[0] || 'A'}</span>
                            )}
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
                  {rating.comment?.[currentLang] || rating.comment.ar || rating.comment.en ? (
                    <p className="text-base-content mt-2 leading-relaxed">
                      {rating.comment[currentLang] || rating.comment.ar || rating.comment.en}
                    </p>
                  ) : null}
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
