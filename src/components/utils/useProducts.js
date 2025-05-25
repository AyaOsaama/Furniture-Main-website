import { useEffect, useState, useCallback } from "react";
import { fetchAllCategories, fetchAllProducts } from "../../api";
import i18n from "../../i18n";
import { api } from "../../axios/axios"; // إضافة استيراد api
 
const PRODUCTS_PER_PAGE = 6;
 
export const useProducts = () => {
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
        setHasLoaded(false);
       
        // تحميل الفئات
        const categoriesData = await fetchAllCategories();
        setCategories(categoriesData.categories || []);
       
        // تحميل المنتجات
        const productsData = await fetchAllProducts();
       
        console.log("API Response:", productsData);
       
        // معالجة المنتجات وفقًا لهيكل البيانات الفعلي
        const allVariants = [];
       
        if (productsData.products && Array.isArray(productsData.products)) {
          productsData.products.forEach(product => {
            // استخراج معرفات الفئات من المنتج
            let categoryMainId = null;
            let categorySubId = null;
           
            // محاولة استخراج معرفات الفئات من مختلف الهياكل المحتملة
            if (product.category) {
              if (product.category.main && product.category.main._id) {
                categoryMainId = product.category.main._id;
              }
              if (product.category.sub && product.category.sub._id) {
                categorySubId = product.category.sub._id;
              }
            } else if (product.categories) {
              if (product.categories.main && product.categories.main._id) {
                categoryMainId = product.categories.main._id;
              }
              if (product.categories.sub && product.categories.sub._id) {
                categorySubId = product.categories.sub._id;
              }
            }
           
            // إضافة المنتجات
            if (product.variants && Array.isArray(product.variants)) {
              product.variants.forEach(variant => {
                allVariants.push({
                  ...variant,
                  productId: product._id,
                  productName: product.name,
                  productDescription: product.description,
                  // إضافة معرفات الفئات
                  categoryMainId,
                  categorySubId,
                  // احتفظ بالهيكل الأصلي للفئات للتصحيح
                  productCategory: product.category || product.categories
                });
              });
            }
          });
        }
       
        console.log("Processed variants:", allVariants.length);
        if (allVariants.length > 0) {
          console.log("Sample variant with category info:", {
            variant: allVariants[0],
            categoryMainId: allVariants[0].categoryMainId,
            categorySubId: allVariants[0].categorySubId
          });
        }
       
        setVariants(allVariants);
       
        // معالجة الألوان
        const colorCounts = {};
        allVariants.forEach((variant) => {
          if (variant.color?.[currentLang]) {
            const colorName = variant.color[currentLang].toLowerCase();
            colorCounts[colorName] = (colorCounts[colorName] || 0) + 1;
          }
        });
 
        const colorsWithCounts = Object.entries(colorCounts).map(
          ([name, count]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            count,
            originalName: name,
          })
        );
 
        setColorOptions(colorsWithCounts.sort((a, b) => a.name.localeCompare(b.name)));
 
        // معالجة نطاق الأسعار
        const prices = allVariants.map((v) => {
          // استخدام سعر التخفيض إذا كان موجودًا، وإلا استخدام السعر العادي
          return v.discountPrice !== null && v.discountPrice !== undefined
            ? v.discountPrice
            : v.price || 0;
        });
        const regularPrices = allVariants.map((v) => v.price || 0);
 
        // أقل سعر يكون أقل سعر تخفيض
        const minPrice = Math.floor(Math.min(...prices));
        // أكبر سعر يكون أكبر سعر عادي
        const maxPrice = Math.ceil(Math.max(...regularPrices));
 
        console.log("Price range calculation:", {
          minPrice,
          maxPrice,
          pricesCount: prices.length,
          regularPricesCount: regularPrices.length
        });
 
        setPriceRange({ min: minPrice, max: maxPrice });
        setSliderValues({ min: minPrice, max: maxPrice });
        setTempSliderValues({ min: minPrice, max: maxPrice });
      } catch (error) {
        console.error("Failed to load products or categories:", error);
      } finally {
        setHasLoaded(true);
      }
    };
   
    loadProducts();
  }, [currentLang]);
 
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
 
  // دالة لاستخراج معرفات الفئات من المنتج
  const extractCategoryIds = (variant) => {
    const categoryIds = [];
   
    // إضافة معرف الفئة الرئيسية إذا كان موجودًا
    if (variant.categoryMainId) {
      categoryIds.push(variant.categoryMainId);
    }
   
    // إضافة معرف الفئة الفرعية إذا كان موجودًا
    if (variant.categorySubId) {
      categoryIds.push(variant.categorySubId);
    }
   
    // إضافة معرفات الفئات من كائن المنتج إذا كان موجودًا
    if (variant.productCategory) {
      if (variant.productCategory.main?._id) {
        categoryIds.push(variant.productCategory.main._id);
      }
      if (variant.productCategory.sub?._id) {
        categoryIds.push(variant.productCategory.sub._id);
      }
    }
   
    // إضافة معرف الفئة من الكائن نفسه إذا كان موجودًا
    if (variant.category?._id) {
      categoryIds.push(variant.category._id);
    }
   
    // إضافة معرف الفئة من الكائن نفسه إذا كان موجودًا كسلسلة نصية
    if (typeof variant.category === 'string') {
      categoryIds.push(variant.category);
    }
   
    // إزالة التكرارات
    return [...new Set(categoryIds)];
  };
 
  const filteredVariants = sortVariants(
    variants.filter((variant) => {
      const matchesSearch =
        (variant.name?.[currentLang] || "").toLowerCase().includes(searchTerm.toLowerCase());
 
      const matchesColor =
        selectedColors.length === 0 ||
        (variant.color?.[currentLang] &&
          selectedColors.includes(variant.color[currentLang].toLowerCase()));
 
      // استخدام سعر التخفيض إذا كان موجودًا، وإلا استخدام السعر العادي
      const variantPrice = variant.discountPrice !== null && variant.discountPrice !== undefined
        ? variant.discountPrice
        : variant.price || 0;
 
      const matchesPrice =
        variantPrice >= sliderValues.min && variantPrice <= sliderValues.max;
 
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.some(catId =>
          variant.categoryMainId === catId ||
          variant.categorySubId === catId
        );
 
      const matchesRating =
        selectedRatings.length === 0 ||
        (variant.averageRating !== undefined &&
          selectedRatings.includes(Math.round(variant.averageRating)));
 
      return matchesSearch && matchesColor && matchesPrice && matchesCategory && matchesRating;
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
    console.log("handleCategoryChange called with:", categoryId);
    console.log("Current selectedCategories:", selectedCategories);
   
    // تأكد من أن categoryId ليس undefined أو null
    if (!categoryId) {
      console.error("Invalid categoryId:", categoryId);
      return;
    }
   
    setSelectedCategories((prev) => {
      const newCategories = prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId];
     
      console.log("New selectedCategories:", newCategories);
     
      // تسجيل إضافي للتصحيح
      setTimeout(() => {
        console.log("selectedCategories after state update:", selectedCategories);
      }, 0);
     
      return newCategories;
    });
   
    setCurrentPage(1);
  };
 
  const handleRatingChange = (rating) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
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
 