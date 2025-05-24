import { useProductsByTag } from "./useProductsByTag";
import ProductsByTag from "./ProductsByTag";
import FilterSidebar from "../products/FilterSidebar";
import SortDropdown from "../products/SortDropdown";
import PaginationControls from "../products/PaginationControls";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const DesignProductByTag = () => {
  const { t } = useTranslation("products");
  const { tagName } = useParams();

  const {
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
    selectedRatings,
    handleRatingChange,
    setCurrentPage,
    categories,
    colorOptions,
    sortOption,
    setSortOption,
  } = useProductsByTag({ tagName });
  console.log("hasLoaded:", hasLoaded);
  console.log("filteredVariants:", filteredVariants);
  console.log("currentVariants:", currentVariants);
  return (
    <div className="flex flex-col-reverse lg:flex-row mx-20 my-15 gap-8 mt-10 p-8">
      <div className="lg:w-3/4 w-full mt-10">
        {hasLoaded && filteredVariants.length > 0 && (
          <div className="flex md:flex-row flex-col md:gap-0 gap-4 justify-between items-center mb-4">
            <div className="text-gray-500 lg:text-lg text-sm">
              {t("showingProducts", {
                current: currentVariants.length,
                total: filteredVariants.length,
              })}
            </div>

            {/* Sort dropdown */}
            <SortDropdown
              sortOption={sortOption}
              setSortOption={setSortOption}
              selectedRatings={selectedRatings}
              handleRatingChange={handleRatingChange}
            />
          </div>
        )}

        <ProductsByTag
          hasLoaded={hasLoaded}
          currentVariants={currentVariants}
          filteredVariants={filteredVariants}
          resetFilters={resetFilters}
        />

        {hasLoaded && filteredVariants.length > 0 && totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>

      <FilterSidebar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categories={categories}
        selectedCategories={selectedCategories}
        handleCategoryChange={handleCategoryChange}
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

export default DesignProductByTag;