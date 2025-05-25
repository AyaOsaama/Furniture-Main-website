import { useTranslation } from "react-i18next";
import ProductGrid from "../products/ProductGrid";

export default function ProductsByTag({
  hasLoaded,
  currentVariants,
  filteredVariants,
  resetFilters,
  tag, 
}) {
  const { t } = useTranslation("products");

  if (!hasLoaded) {
    return <p className="text-center">{t("loading")}</p>;
  }

  if (filteredVariants.length === 0) {
    return <p className="text-center text-gray-500">{t("noProductsFound")}</p>;
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-center my-6">
        {t("relatedProductsByTag")} {tag}
      </h1>

      <ProductGrid
        hasLoaded={hasLoaded}
        currentVariants={currentVariants}
        filteredVariants={filteredVariants}
        resetFilters={resetFilters}
      />
    </>
  );
}
