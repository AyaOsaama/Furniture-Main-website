import { api } from "../../../../axios/axios";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import i18n from "../../../../i18n";

function Reviews({ productId }) {
  const { t } = useTranslation("productdetails");
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState({ en: "", ar: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const currentLang = i18n.language;
  const [canRate, setCanRate] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/ratings/product/${productId}`); 
      setReviews(res.data?.ratings || []);
      setCanRate(res.data?.canRate ?? false);
    } catch (err) {
      setReviews([]);
      setCanRate(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post("/ratings", {
        productId,
        value: userRating,
        comment: {
          en: comment.en,
          ar: comment.ar,
        },
      });
      setUserRating(0);
            fetchReviews();

      setComment({ en: "", ar: "" });
      
    } catch (err) {
      const backendMsg = err.response?.data?.message;
      if (backendMsg === "You can only rate a product you have purchased and paid for.") {
        setError(t("onlyRateIfPurchased"));
      } else if (backendMsg === "You have already rated this product.") {
        setError(t("alreadyRated"));
      } else {
        setError(backendMsg || t("errorSubmittingRating"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-6 text-primary text-center">{t("ratingsAndReviews")}</h2>

      {/* قائمة التقييمات */}
      <div className="mb-8">
        {reviews.length === 0 ? (
          <div className="text-gray-400 text-center">{t("noRatings")}</div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r._id} className="bg-base-200 rounded-xl p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3 mb-2 md:mb-0">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-10 h-10 flex items-center justify-center">
                      <span className="text-lg font-bold">
                        <img src={r.userId?.image} alt="user" className="w-10 h-10 rounded-full" />
                     </span>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold">{r.userId?.userName?.[currentLang] || t("anonymous")}</div>
                    <div className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* نجوم التقييم */}
                  <div className="rating rating-half">
                    {[1,2,3,4,5].map((star) => (
                      <input
                        key={star}
                        type="radio"
                        className={`mask mask-star-2 bg-yellow-400 w-5 h-5`}
                        checked={Math.round(r.value) === star}
                        readOnly
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{r.value}/5</span>
                </div>
                {r.comment?.[currentLang] ||r.comment?.en || r.comment?.ar && (
                  <div className="mt-2 text-gray-700 md:mt-0 md:ml-4">{r.comment[currentLang]}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* إضافة تقييم */}
      {!canRate && (
        <div className="text-gray-400 text-center my-4">
          {t("youCanOnlyRateIfPurchased")}
        </div>
      )}
      {canRate && (
        <form onSubmit={handleSubmit} className="bg-base-100 p-6 rounded-xl shadow space-y-4">
          <div>
            <label className="block mb-2 font-semibold">{t("yourRating")}</label>
            <div className="rating rating-lg">
              {[1,2,3,4,5].map((star) => (
                <input
                  key={star}
                  type="radio"
                  name="user-rating"
                  className="mask mask-star-2 bg-yellow-400 w-8 h-8"
                  checked={userRating === star}
                  onChange={() => setUserRating(star)}
                  required
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-2 font-semibold">{t("yourComment")}</label>
            <textarea
              value={comment[currentLang]}
              onChange={(e) => setComment((prev) => ({
                ...prev,
                [currentLang]: e.target.value,
              }))}
              className="textarea textarea-bordered w-full"
              placeholder={t("writeYourReview")}
              
            />
          </div>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <button
            type="submit"
            className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? t("submitting") : t("submitReview")}
          </button>
        </form>
      )}
    </div>
  );
}

export default Reviews;
