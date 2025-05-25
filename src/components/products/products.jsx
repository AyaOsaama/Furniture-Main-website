import  { useState } from "react";
import { useProducts } from "../utils/useProducts";
import ProductGrid from "./ProductGrid";
import FilterSidebar from "./FilterSidebar";
import SortDropdown from "./SortDropdown";
import PaginationControls from "./PaginationControls";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import React, { useEffect } from "react";
 
const Products = () => {
  console.log("Rendering Products component");
 
  const { t } = useTranslation("products");
  const currentLang = i18n.language;
 
  const {
    variants,
    currentVariants,
    currentPage,
    totalPages,
    hasLoaded,
    filteredVariants,
    searchTerm,
    setSearchTerm,
    selectedCategories,
    handleCategoryChange,
    selectedColors,
    handleColorChange,
    tempSliderValues,
    handleMouseDown,
    calculatePosition,
    applyPriceFilter,
    resetFilters,
    setCurrentPage,
    categories,
    colorOptions,
    selectedRatings,
    handleRatingChange,
  } = useProducts();
 
  console.log("useProducts hook returned values:", {
    variantsLength: variants?.length,
    currentVariantsLength: currentVariants?.length,
    hasLoaded,
    categoriesLength: categories?.length
  });
 
  const [selectedRatingFilters, setSelectedRatingFilters] = useState([]);
  const [ignoreCategories, setIgnoreCategories] = useState(false);
 
  // دالة تغيير التقييمات المختارة - يمكن حذفها لأننا نستخدم handleRatingChange من useProducts
  const handleRatingFilterChange = (rating) => {
    setSelectedRatingFilters((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
  };
 
  // حذف هذه الأجزاء لأنها غير مستخدمة وقد تسبب أخطاء
  // const filteredProducts =
  //   selectedRatingFilters.length === 0
  //     ? currentVariants
  //     : currentVariants.filter((product) =>
  //         selectedRatingFilters.includes(Math.round(product.rating))
  //       );
 
  // const sortedProducts = [...filteredProducts].sort(
  //   (a, b) => b.rating - a.rating
  // );
 
  // إضافة تسجيلات للتصحيح
  useEffect(() => {
    console.log("Current variants count:", currentVariants.length);
    console.log("Filtered variants count:", filteredVariants.length);
    console.log("Selected categories:", selectedCategories);
   
    // فحص عينة من المنتجات
    if (variants.length > 0) {
      console.log("Sample variant structure:", variants[0]);
      console.log("Category info in sample variant:", {
        categoryMainId: variants[0].categoryMainId,
        categorySubId: variants[0].categorySubId,
        productCategory: variants[0].productCategory
      });
     
      // فحص المنتجات المطابقة للفئة المحددة
      if (selectedCategories.length > 0) {
        const matchingVariants = variants.filter(v =>
          selectedCategories.some(catId =>
            v.categoryMainId === catId ||
            v.categorySubId === catId
          )
        );
        console.log(`Found ${matchingVariants.length} variants matching selected categories`);
        console.log("First matching variant:", matchingVariants[0]);
      }
    }
  }, [currentVariants, filteredVariants, selectedCategories, variants]);
 
  // تعديل دالة handleCategoryChangeWithLog للتحقق من صحة الفلترة
  const handleCategoryChangeWithLog = (categoryId) => {
    console.log("Clicked category id:", categoryId);
    console.log("Current selectedCategories before change:", selectedCategories);
   
    // استدعاء handleCategoryChange الأصلية
    handleCategoryChange(categoryId);
   
    // إضافة تسجيل للمنتجات المفلترة بعد التغيير
    setTimeout(() => {
      console.log("Selected categories after change:", selectedCategories);
     
      // التحقق من المنتجات التي تنتمي إلى الفئة المحددة
      const matchingVariants = variants.filter(
        v => v.categoryMainId === categoryId || v.categorySubId === categoryId
      );
     
      console.log(`Found ${matchingVariants.length} variants matching category ${categoryId}`);
      console.log("Sample matching variant:", matchingVariants[0]);
    }, 100);
  };
  useEffect(() => {
  console.log("selectedCategories updated:", selectedCategories);
}, [selectedCategories]);
  return (
    <div className="flex flex-col-reverse lg:flex-row mx-20 my-15 gap-8 mt-10 p-8">
      {/* Products section */}
      <div className="lg:w-3/4 w-full mt-10">
        {/* Product count and sort */}
        {hasLoaded && (
          <div className="flex md:flex-row flex-col md:gap-0 gap-4 justify-between items-center mb-4">
            <div className="text-gray-500 lg:text-lg text-sm ">
              {filteredVariants.length > 0 ? (
                <>
                  {t("showingProducts", {
                    current: currentVariants.length,
                    total: filteredVariants.length,
                  })}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span>{t("no_products_title")}</span>
                </div>
              )}
            </div>
            <SortDropdown
              selectedRatings={selectedRatings}
              handleRatingChange={handleRatingChange}
            />
          </div>
        )}
 
        <ProductGrid
          hasLoaded={hasLoaded}
          currentVariants={currentVariants}
          filteredVariants={filteredVariants}
          resetFilters={resetFilters}
        />
 
        {/* Pagination */}
        {hasLoaded && filteredVariants.length > 0 && totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
 
      {/* Filters section */}
      <FilterSidebar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categories={categories}
        selectedCategories={selectedCategories}
        handleCategoryChange={handleCategoryChangeWithLog}
        colorOptions={colorOptions}
        selectedColors={selectedColors}
        handleColorChange={handleColorChange}
        tempSliderValues={tempSliderValues}
        handleMouseDown={handleMouseDown}
        calculatePosition={calculatePosition}
        applyPriceFilter={applyPriceFilter}
        resetFilters={resetFilters}
      />
    </div>
  );
};
 
export default Products;
 