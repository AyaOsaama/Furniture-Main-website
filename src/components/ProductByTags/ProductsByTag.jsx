import { useTranslation } from "react-i18next";
import ProductGrid from "../products/ProductGrid";

export default function ProductsByTag({
  hasLoaded,
  currentVariants,
  filteredVariants,
  resetFilters,
}) {
  const { t } = useTranslation();

  if (!hasLoaded) {
    return <p className="text-center">{t("common.loading")}</p>;
  }

  if (filteredVariants.length === 0) {
    return <p className="text-center text-gray-500">{t("products.noProductsFound")}</p>;
  }

  return (
    <ProductGrid
      hasLoaded={hasLoaded}
      currentVariants={currentVariants}
      filteredVariants={filteredVariants}
      resetFilters={resetFilters}
    />
  );
}
