import { useEffect, useState, useCallback } from "react";
import i18n from "../../i18n";
import {api} from "../../axios/axios"; 

const PRODUCTS_PER_PAGE = 6;

export const useProductsByTag = ({tagName} = {}) => {
  const currentLang = i18n.language;
  const [variants, setVariants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sliderValues, setSliderValues] = useState({ min: 0, max: 1000 });
  const [tempSliderValues, setTempSliderValues] = useState({ min: 0, max: 1000 });
  const [isDragging, setIsDragging] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [categories, setCategories] = useState([]);
  const [sortOption, setSortOption] = useState("default");

  useEffect(() => {
    const loadProducts = async () => {
      try {
          console.log("Inside useProductsByTag, tagName is:", tagName);

        setHasLoaded(false);
        const endpoint = tagName ? `/products/tag/${tagName}` : "/products";
        const response = await api.get(endpoint);
        const data = response.data;
console.log(data);

       const allVariants = data.flatMap((product) =>
          product.variants.map((variant) => ({
            ...variant,
            productId: product._id,
            categoryId: product.category?._id,
          }))
        );

        setVariants(allVariants);

        const colorCounts = {};
        allVariants.forEach((variant) => {
          if (variant.color?.[currentLang]) {
            const colorName = variant.color[currentLang].toLowerCase();
            colorCounts[colorName] = (colorCounts[colorName] || 0) + 1;
          }
        });

        const colorsWithCounts = Object.entries(colorCounts).map(([name, count]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          count,
          originalName: name,
        }));

        setColorOptions(colorsWithCounts.sort((a, b) => a.name.localeCompare(b.name)));

        const prices = allVariants.map((v) => v.price || 0);
        const minPrice = Math.floor(Math.min(...prices));
        const maxPrice = Math.ceil(Math.max(...prices));
        setPriceRange({ min: minPrice, max: maxPrice });
        setSliderValues({ min: minPrice, max: maxPrice });
        setTempSliderValues({ min: minPrice, max: maxPrice });
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setHasLoaded(true);
      }
    };

    loadProducts();
  }, [tagName]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Failed to load categories", error);
        setCategories([]);
      }
    };

    getCategories();
  }, []);

  const sortVariants = useCallback(
    (variants) => {
      return [...variants].sort((a, b) => {
        const priceA = a.discountPrice || a.price || 0;
        const priceB = b.discountPrice || b.price || 0;
        const nameA = a.name?.en || "";
        const nameB = b.name?.en || "";

        switch (sortOption) {
          case "price-asc":
            return priceA - priceB;
          case "price-desc":
            return priceB - priceA;
          case "name-asc":
            return nameA.localeCompare(nameB);
          case "name-desc":
            return nameB.localeCompare(nameA);
          default:
            return 0;
        }
      });
    },
    [sortOption]
  );

const filteredVariants = sortVariants(
  variants.filter((variant) => {
    const name = variant.name?.[currentLang] || "";
    const color = variant.color?.[currentLang]?.toLowerCase() || "";
    const price = variant.price;

    // تأكد من نوع الـ categoryId كـ string
    const categoryId = typeof variant.categoryId === "string" ? variant.categoryId : variant.categoryId?._id || "";
    const categoryIdSub = typeof variant.categoryIdSub === "string" ? variant.categoryIdSub : variant.categoryIdSub?._id || "";

    const avgRating = variant.averageRating;

    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesColor = selectedColors.length === 0 || selectedColors.includes(color);
    const matchesPrice = price >= sliderValues.min && price <= sliderValues.max;
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some(cat => cat === categoryId || cat === categoryIdSub);
    const matchesRating =
      selectedRatings.length === 0 ||
      (avgRating !== undefined &&
        selectedRatings.some((rating) => {
          const starValue = Math.round(avgRating / 2.6);
          return starValue === rating;
        }));

    return (
      matchesSearch &&
      matchesColor &&
      matchesPrice &&
      matchesCategory &&
      matchesRating
    );
  })
);




  const totalPages = Math.ceil(filteredVariants.length / PRODUCTS_PER_PAGE);
  const indexOfLast = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirst = indexOfLast - PRODUCTS_PER_PAGE;
  const currentVariants = filteredVariants.slice(indexOfFirst, indexOfLast);

  const handleColorChange = (colorName) => {
    setSelectedColors((prev) =>
      prev.includes(colorName)
        ? prev.filter((c) => c !== colorName)
        : [...prev, colorName]
    );
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
    setCurrentPage(1);
  };

  const handleRatingChange = (rating) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
    setCurrentPage(1);
  };

  const calculatePosition = (value) => {
    const range = priceRange.max - priceRange.min;
    return ((value - priceRange.min) / range) * 100;
  };

  const handleMouseDown = (handle) => setIsDragging(handle);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;

      const slider = document.querySelector(".price-slider");
      if (!slider) return;

      const rect = slider.getBoundingClientRect();
      const position = Math.min(
        Math.max((e.clientX - rect.left) / rect.width, 0),
        1
      );
      const range = priceRange.max - priceRange.min;
      const newValue = Math.round(priceRange.min + position * range);

      setTempSliderValues((prev) => ({
        ...prev,
        [isDragging]:
          isDragging === "min"
            ? Math.min(newValue, tempSliderValues.max - 1)
            : Math.max(newValue, tempSliderValues.min + 1),
      }));
    },
    [isDragging, tempSliderValues, priceRange]
  );

  const handleMouseUp = useCallback(() => setIsDragging(null), []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const applyPriceFilter = () => {
    setSliderValues(tempSliderValues);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedColors([]);
    setSelectedCategories([]);
    setSelectedRatings([]);
    setSliderValues({ min: priceRange.min, max: priceRange.max });
    setTempSliderValues({ min: priceRange.min, max: priceRange.max });
    setCurrentPage(1);
    setSortOption("default");
  };

  return {
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
    selectedRatings,
    handleRatingChange,
    tempSliderValues,
    handleMouseDown,
    calculatePosition,
    applyPriceFilter,
    resetFilters,
    sortOption,
    setSortOption,
    setCurrentPage,
    categories,
    colorOptions,
  };
};
