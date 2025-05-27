import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axios from "axios";

const RelatedProducts = ({ currentProductId }) => {
  const navigate = useNavigate();
  const { t } = useTranslation("productdetails");
  const currentLang = i18n.language;
  const scrollContainerRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const { data } = await axios.get(
          `https://furniture-nodejs-production-665a.up.railway.app/products/related/${currentProductId}`
        );
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

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const handleScroll = () => {
        setShowLeftArrow(container.scrollLeft > 0);
        setShowRightArrow(
          container.scrollLeft < container.scrollWidth - container.clientWidth
        );
      };
      container.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial check
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [products]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 300; // Adjust this value as needed
      container.scrollTo({
        left:
          container.scrollLeft +
          (direction === "right" ? scrollAmount : -scrollAmount),
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto relative lg:mt-5 mt-8 px-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-8 text-primary text-center md:text-start">
          {t("relatedProducts.title")}
        </h2>
        <div>
          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className=" p-2 cursor-pointer transition-all"
              aria-label="Scroll left"
            >
              <FiChevronLeft className="w-6 h-6 text-primary" />
            </button>
          )}
          {showRightArrow && (
            <button
              onClick={() => scroll("right")}
              className=" p-2 cursor-pointer  transition-all"
              aria-label="Scroll right"
            >
              <FiChevronRight className="w-6 h-6 text-primary" />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-12 bg-base-200 rounded-xl mt-8">
          {t("relatedProducts.loading")}
        </div>
      ) : products.length > 0 ? (
        <div className="">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide space-x-8 py-4 px-2"
            style={{ scrollBehavior: "smooth" }}
          >
            {products.map((product) => {
              const firstVariant = product.variants?.[0] || {};
              return (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer group flex-shrink-0 w-64"
                  onClick={() => navigate(`/shop/${product._id}`)}
                >
                  <div className="relative w-full h-48 bg-base-200 flex items-center justify-center">
                    {firstVariant.image ? (
                      <img
                        src={firstVariant.image}
                        alt={
                          firstVariant.name?.[currentLang] ||
                          t("relatedProducts.defaultAlt")
                        }
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
                      {firstVariant.name?.[currentLang] ||
                        t("relatedProducts.defaultName")}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3 truncate">
                      {product.description?.[currentLang] || ""}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-lg font-bold text-primary">
                        $
                        {firstVariant.discountPrice?.toFixed(2) ||
                          firstVariant.price?.toFixed(2) ||
                          "0.00"}
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
