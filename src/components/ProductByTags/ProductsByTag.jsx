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

  return (
    <>
      <h1 className="text-2xl font-bold text-center my-6">
        {t("relatedProductsByTag")} {tag}
      </h1>

      {hasLoaded && (
        <div className="flex md:flex-row flex-col md:gap-0 gap-4 justify-between items-center mb-4">
          <div className="text-gray-500 lg:text-lg text-sm">
            {filteredVariants.length > 0 ? (
              <>
              <div>
                {/* {t("showingProducts", {
                  current: currentVariants.length,
                  total: filteredVariants.length,
                })} */}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span>{t("no_products_title")}</span>
              </div>
            )}
          </div>

  
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
