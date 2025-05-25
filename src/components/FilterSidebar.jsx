import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaFilter, FaTimes } from 'react-icons/fa';

const FilterSidebar = ({
  categories,
  selectedCategories,
  onCategoryChange,
  colorOptions,
  selectedColors,
  onColorChange,
  priceRange,
  sliderValues,
  tempSliderValues,
  handleMouseDown,
  calculatePosition,
  applyPriceFilter,
  resetFilters
}) => {
  const { t, i18n } = useTranslation();

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <FaFilter className="mr-2" />
          {t('filters.title')}
        </h3>
        <button
          onClick={resetFilters}
          className="text-sm text-gray-500 hover:text-primary flex items-center"
        >
          <FaTimes className="mr-1" />
          {t('filters.reset')}
        </button>
      </div>

      {/* Categories Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">{t('filters.categories')}</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category._id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category._id)}
                onChange={() => onCategoryChange(category._id)}
                className="form-checkbox h-4 w-4 text-primary"
              />
              <span className="ml-2 text-sm">
                {category.name?.[i18n.language] || category.name?.en}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Colors Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">{t('filters.colors')}</h4>
        <div className="space-y-2">
          {colorOptions.map((color) => (
            <label key={color.name} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedColors.includes(color.originalName)}
                onChange={() => onColorChange(color.originalName)}
                className="form-checkbox h-4 w-4 text-primary"
              />
              <span className="ml-2 text-sm">{color.name}</span>
              <span className="ml-2 text-xs text-gray-500">({color.count})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">{t('filters.priceRange')}</h4>
        <div className="relative h-2 bg-gray-200 rounded-full price-slider">
          <div
            className="absolute h-full bg-primary rounded-full"
            style={{
              left: `${calculatePosition(tempSliderValues.min)}%`,
              right: `${100 - calculatePosition(tempSliderValues.max)}%`,
            }}
          />
          <input
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            value={tempSliderValues.min}
            onChange={(e) => handleMouseDown('min')}
            className="absolute w-full h-full opacity-0 cursor-pointer"
          />
          <input
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            value={tempSliderValues.max}
            onChange={(e) => handleMouseDown('max')}
            className="absolute w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-sm">${tempSliderValues.min}</span>
          <span className="text-sm">${tempSliderValues.max}</span>
        </div>
        <button
          onClick={applyPriceFilter}
          className="mt-2 w-full bg-primary text-white py-1 rounded hover:bg-primary-dark transition-colors"
        >
          {t('filters.apply')}
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar; 