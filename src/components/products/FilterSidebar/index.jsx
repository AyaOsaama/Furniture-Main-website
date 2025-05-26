import React, { useState, useRef, useEffect } from "react";
import { RiSearch2Line, RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import CategoryFilter from "./CategoryFilter";
import ColorFilter from "./ColorFilter";
import PriceRangeFilter from "./PriceRangeFilter";
import { useTranslation } from "react-i18next";

const FilterSidebar = ({
  searchTerm,
  setSearchTerm,
  categories,
  selectedCategories,
  handleCategoryChange,
  colorOptions,
  selectedColors,
  handleColorChange,
  tempSliderValues,
  handleMouseDown,
  calculatePosition,
  applyPriceFilter,
  resetFilters,
}) => {
  const { t } = useTranslation("products");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Check if the click is on the toggle button
        const toggleButton = document.querySelector('.filter-toggle-button');
        if (toggleButton && !toggleButton.contains(event.target)) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (

    <div className="lg:w-1/4 pt-10 pb-8 pl-4 pr-4 ">
      {/* Mobile dropdown toggle */}
      <div className="lg:hidden ">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="filter-toggle-button flex items-center justify-between w-full bg-gray-200 hover:bg-gray-300 py-3 px-4 rounded"
        >
          <span className="font-medium">{t("Products Filters")}</span>
          {isOpen ? (
            <RiArrowUpSLine className="w-5 h-5" />
          ) : (
            <RiArrowDownSLine className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Content - hidden on mobile unless open */}
      <div
        ref={dropdownRef}
        className={`${isOpen ? "block" : "hidden"} lg:block bg-white lg:bg-transparent p-4 lg:p-0 rounded-lg shadow-lg lg:shadow-none mb-4`}
      >
        {/* Search input */}
        <div className="mb-4 flex justify-end">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder={t("search_placeholder")}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              className="border border-gray-300 px-4 py-2 pr-10 w-full placeholder-gray-400 focus:outline-0"
            />
            <RiSearch2Line className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500" />
          </div>
        </div>

        <CategoryFilter
          categories={categories}
          selectedCategories={selectedCategories}
          handleCategoryChange={handleCategoryChange}
        />

        <ColorFilter
          colorOptions={colorOptions}
          selectedColors={selectedColors}
          handleColorChange={handleColorChange}
        />

        <PriceRangeFilter
          tempSliderValues={tempSliderValues}
          handleMouseDown={handleMouseDown}
          calculatePosition={calculatePosition}
          applyPriceFilter={applyPriceFilter}
        />

        {/* Reset Filters Button */}
        <button
          onClick={() => {
            resetFilters();
            setIsOpen(false); // Close dropdown after reset on mobile
          }}
          className="w-full bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded text-sm"
        >
          {t("reset_filters")}
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;