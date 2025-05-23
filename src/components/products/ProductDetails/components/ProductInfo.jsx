import React from "react";
import RatingStars from "../../RatingStars";
import { useDispatch, useSelector } from "react-redux";
import { addCartItem } from "../../../../redux/cartActions";
import { toggleWishlistItem } from "../../../../redux/wishList";
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiHeart } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";

const ProductInfo = ({
  product,
  selectedVariant,
  quantity,
  handleQuantityChange,
  handleVariantChange,
  addToCart,
}) => {
  const { t } = useTranslation("productdetails");
  const currentLang = i18n.language;
  const variant = product.variants[selectedVariant];
  const maxQuantity = variant.inStock || 10;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  
  // Check if this exact variant OR any variant of this product is in wishlist
  const isWishlisted = wishlistItems.some(item => item._id === variant._id || item._id === product._id);

  const handleAddToCart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error(t("productInfo.mustLoginFirst"));
      navigate("/login");
      return;
    }

    dispatch(addCartItem({ product, quantity }))
      .unwrap()
      .then(() => {
        toast.success(t("productInfo.addedToCart"));
      })
      .catch((error) => {
        toast.error(error.message || "Failed to add to cart");
      });
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error(t("productInfo.mustLoginFirst"));
      navigate("/login");
      return;
    }

    dispatch(toggleWishlistItem(product._id))
      .unwrap()
      .then((result) => {
        if (result.inWishlist) {
          toast.success(t("productInfo.addedToWishlist"));
        } else {
          toast.success(t("productInfo.removedFromWishlist"));
        }
      })
      .catch((error) => {
        toast.error(error.message || "Failed to update wishlist");
      });
  };

  return (
    <div className="md:w-1/2">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        {variant.name?.[currentLang] || t("productInfo.defaultName")}
      </h1>

      <div className="flex items-center mb-4">
        <RatingStars averageRating={variant.averageRating || 0} />
        <span className="ml-2 text-sm text-gray-500">
          ({t("productInfo.reviews", { count: variant.ratingCount || 0 })})
        </span>
      </div>

      <div className="flex gap-2 items-center mb-6">
        <span className="text-2xl font-semibold">
          ${variant.discountPrice?.toFixed(2) || variant.price?.toFixed(2)}
        </span>
        {variant.discountPrice && (
          <span className="ml-2 text-gray-500 line-through">
            ${variant.price?.toFixed(2)}
          </span>
        )}
      </div>

      {product.variants.length > 1 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">{t("productInfo.variants")}</h3>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v, index) => (
              <button
                key={v._id}
                onClick={() => handleVariantChange(index)}
                className={`px-4 py-2 border rounded-full ${
                  selectedVariant === index
                    ? "bg-black text-white border-black"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {v.color?.[currentLang] ||
                  t("productInfo.variant", { number: index + 1 })}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4 mb-4">
        <div className="flex items-center border border-gray-300 rounded">
          <button
            className="px-3 py-2 text-lg hover:bg-gray-100 disabled:opacity-50"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
          <button
            className="px-3 py-2 text-lg hover:bg-gray-100 disabled:opacity-50"
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= maxQuantity}
          >
            +
          </button>
        </div>
        <button
          className="bg-black hover:bg-gray-800 w-40 text-white py-3 px-6 rounded transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={handleAddToCart}
          disabled={variant.inStock <= 0}
        >
          {variant.inStock > 0
            ? t("productInfo.addToCart")
            : t("productInfo.outOfStock")}
        </button>
      </div>

      <div className="mb-8">
        <button
          onClick={handleWishlistClick}
          className={`flex items-center gap-2 p-2 rounded-full transition-colors ${
            isWishlisted
              ? "text-red-500 hover:text-red-600"
              : "text-gray-700 hover:text-black"
          }`}
        >
          <FiHeart 
            size={20} 
            fill={isWishlisted ? "currentColor" : "none"} 
            stroke="currentColor"
            strokeWidth={isWishlisted ? 1.5 : 2}
            className="transition-all duration-200"
          />
          <span className="text-sm font-medium">
            {isWishlisted ? t("productInfo.wishlisted") : t("productInfo.addToWishlist")}
          </span>
        </button>

        <div className="mt-6 space-y-3">
          <div className="flex gap-2">
            <h3 className="font-semibold">{t("productInfo.color")}:</h3>
            <p className="text-gray-500">
              {variant.color?.[currentLang] || t("productInfo.noColor")}
            </p>
          </div>

          <div className="flex gap-2">
            <h3 className="font-semibold">{t("productInfo.material")}:</h3>
            <p className="text-gray-500">
              {product.material?.[currentLang] || t("productInfo.noMaterial")}
            </p>
          </div>

          {product.categories?.sub?.tags &&
            product.categories.sub.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Tags: </h3>
                <div className="flex flex-wrap gap-2">
                  {product.categories.sub.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-1 capitalize font-medium rounded-full transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

          <div className="flex gap-2">
            <h3 className="font-semibold">Availability: </h3>
            <p className={`${
              variant.inStock > 0 ? "text-green-600" : "text-red-600"
            }`}>
              {variant.inStock > 0
                ? `${variant.inStock}`
                : t("Out of stock")}
            </p>
          </div>
        </div>

        <div className="mt-6">
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;