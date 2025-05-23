import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ProductRatings from "./ProductRatings";
import { api } from '../../../../axios/axios';
import Reviews from "./Reviews";

const ProductTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState("description");
  const { t, i18n } = useTranslation("productdetails");
  const tabs = ["description", "additional", "preview"];

  // State to track if there are ratings
  const [hasRatings, setHasRatings] = useState(null);

  useEffect(() => {
    if (activeTab === "additional" && product?._id) {
      api.get(`/ratings/product/${product._id}`)
        .then(res => {
          const ratings = res.data?.ratings || [];
          setHasRatings(ratings.length > 0);
        })
        .catch(() => setHasRatings(false));
    }
  }, [activeTab, product?._id]);
  

  return (
    <div className="mt-12">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 text-sm ${
              activeTab === tab
                ? "text-black border-b-2 border-black"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {t(`productTabs.${tab}`)}
          </button>
        ))}
      </div>

      <div className="py-4">
        {activeTab === "description" && (
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">
              {product.description?.[i18n.language] || t("productTabs.noDescription")}
            </p>
          </div>
        )}

        {activeTab === "additional" && (
          <div className="flex justify-center" style={{ width: '100%' }}>
            {hasRatings === null ? (
              <span className="loading loading-spinner"></span>
            ) : hasRatings ? (
              <ProductRatings productId={product._id} />
            ) : (
              <p className="text-gray-500">{t("productTabs.noAdditional")}</p>
            )}
          </div>
        )}

        {activeTab === "preview" && (
          <Reviews productId={product._id} />
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
