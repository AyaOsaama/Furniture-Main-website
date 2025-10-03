import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../axios/axios';

const ProductsByTagContext = createContext();

export const useProductsByTag = ({ tagName = null } = {}) => {
  const context = useContext(ProductsByTagContext);
  if (!context) {
    throw new Error('useProductsByTag must be used within a ProductsByTagProvider');
  }
  return context;
};

export const ProductsByTagProvider = ({ children }) => {
  // const currentLang = i18n.language;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [colorOptions] = useState([]);
  const [priceRange] = useState({ min: 0, max: 1000 });
  const [sliderValues, setSliderValues] = useState({ min: 0, max: 1000 });
  const [tempSliderValues, setTempSliderValues] = useState({ min: 0, max: 1000 });
  const [isDragging, setIsDragging] = useState(null);
  const [sortOption, setSortOption] = useState('default');

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Failed to load categories', error);
        setCategories([]);
      }
    };

    getCategories();
  }, []);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleColorChange = (colorName) => {
    setSelectedColors((prev) =>
      prev.includes(colorName)
        ? prev.filter((c) => c !== colorName)
        : [...prev, colorName]
    );
  };

  const handleRatingChange = (rating) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
  };

  const calculatePosition = (value) => {
    const range = priceRange.max - priceRange.min;
    return ((value - priceRange.min) / range) * 100;
  };

  const handleMouseDown = (handle) => setIsDragging(handle);

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const slider = document.querySelector('.price-slider');
    if (!slider) return;

    const rect = slider.getBoundingClientRect();
    const position = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    const range = priceRange.max - priceRange.min;
    const newValue = Math.round(priceRange.min + position * range);

    setTempSliderValues((prev) => ({
      ...prev,
      [isDragging]:
        isDragging === 'min'
          ? Math.min(newValue, tempSliderValues.max - 1)
          : Math.max(newValue, tempSliderValues.min + 1),
    }));
  };

  const handleMouseUp = () => setIsDragging(null);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const applyPriceFilter = () => {
    setSliderValues(tempSliderValues);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedColors([]);
    setSelectedCategories([]);
    setSelectedRatings([]);
    setSliderValues({ min: priceRange.min, max: priceRange.max });
    setTempSliderValues({ min: priceRange.min, max: priceRange.max });
    setSortOption('default');
  };

  const value = {
    searchTerm,
    setSearchTerm,
    selectedCategories,
    handleCategoryChange,
    categories,
    selectedColors,
    handleColorChange,
    selectedRatings,
    handleRatingChange,
    colorOptions,
    priceRange,
    sliderValues,
    tempSliderValues,
    handleMouseDown,
    calculatePosition,
    applyPriceFilter,
    resetFilters,
    sortOption,
    setSortOption,
  };

  return (
    <ProductsByTagContext.Provider value={value}>
      {children}
    </ProductsByTagContext.Provider>
  );
};

export default ProductsByTagContext; 