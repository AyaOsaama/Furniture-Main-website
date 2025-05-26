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
      <h1 className="text-2xl font-bold text-center mb-6">
        {t("relatedProductsByTag")} {tag}
      </h1>

      {hasLoaded && (
        <div className="flex md:flex-row flex-col md:gap-0 gap-4 justify-between items-center ">
          {/* <div className="text-gray-500 lg:text-lg text-sm">
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
          </div> */}

          {/* <div className="text-gray-500 lg:text-lg text-sm">
            {tag ? t("filteredByTag", { tag }) : t("allProducts")}
          </div> */}
        </div>
      )}

      <ProductGrid
        hasLoaded={hasLoaded}
        currentVariants={currentVariants}
        filteredVariants={filteredVariants}
        resetFilters={resetFilters}
      />
    </>
  );
}
