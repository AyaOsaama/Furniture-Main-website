import React from "react";
import { useTranslation } from "react-i18next";

const PaginationControls = ({ currentPage, totalPages, setCurrentPage }) => {
  const { t } = useTranslation("products");

  const getPaginationNumbers = () => {
    const range = [];
    const delta = 2; // عدد الصفحات قبل/بعد الحالية

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === 2 ||
        i === totalPages ||
        i === totalPages - 1 ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      } else if (
        i === currentPage - delta - 1 ||
        i === currentPage + delta + 1
      ) {
        range.push("...");
      }
    }

    return [...new Set(range)]; // إزالة التكرار
  };

  return (
    <nav className="flex items-center justify-center gap-x-1 mt-6">
      {/* Previous Button */}
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
      >
        <svg
          className="shrink-0 size-3.5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M15 18L9 12L15 6"></path>
        </svg>
        <span className="sr-only">{t("pagination.previous")}</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-x-1">
        {getPaginationNumbers().map((page, index) =>
          page === "..." ? (
            <span
              key={index}
              className="px-3 py-2 text-sm text-gray-500 select-none"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`min-h-9.5 min-w-9.5 flex justify-center items-center border ${
                currentPage === page
                  ? "border-gray-200 text-gray-800 bg-gray-100"
                  : "border-transparent text-gray-800 hover:bg-gray-100"
              } py-2 px-3 text-sm rounded-lg cursor-pointer font-medium`}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
      >
        <span className="sr-only">{t("pagination.next")}</span>
        <svg
          className="shrink-0 size-3.5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 18L15 12L9 6"></path>
        </svg>
      </button>
    </nav>
  );
};

export default PaginationControls;
