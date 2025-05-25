import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n';
import { api } from '../../../../axios/axios';
import axios from 'axios';
const RelatedProducts = ({ currentProductId }) => {
  const navigate = useNavigate();
  const { t } = useTranslation("productdetails");
  const currentLang = i18n.language;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const { data } = await axios.get(`https://furniture-nodejs-production-665a.up.railway.app/products/related/${currentProductId}`);
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch related products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentProductId) {
      fetchRelatedProducts();
    }
  }, [currentProductId]);

  return (
    <div className="mt-16 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-8 text-primary text-center md:text-start">
        {t("relatedProducts.title")}
      </h2>
      {loading ? (
        <div className="text-center text-gray-400 py-12 bg-base-200 rounded-xl mt-8">
          {t("relatedProducts.loading")}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            const firstVariant = product.variants?.[0] || {};
            return (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer group flex flex-col"
                onClick={() => navigate(`/shop/${product._id}`)}
              >
                <div className="relative w-full h-48 bg-base-200 flex items-center justify-center">
                  {firstVariant.image ? (
                    <img
                      src={firstVariant.image}
                      alt={firstVariant.name?.[currentLang] || t('relatedProducts.defaultAlt')}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-4xl"></span>
                    </div>
                  )}
                  {product.brand && (
                    <span className="absolute top-3 right-3 bg-primary text-white text-xs px-3 py-1 rounded-full shadow">
                      {product.brand}
                    </span>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                    {firstVariant.name?.[currentLang] || t('relatedProducts.defaultName')}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3 truncate">
                    {product.description?.[currentLang] || ''}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-bold text-primary">
                      ${firstVariant.discountPrice?.toFixed(2) || firstVariant.price?.toFixed(2) || '0.00'}
                    </span>
                    {firstVariant.discountPrice && (
                      <span className="text-sm text-gray-400 line-through ml-2">
                        ${firstVariant.price?.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-12 bg-base-200 rounded-xl mt-8">
          {t("relatedProducts.noRelated")}
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
