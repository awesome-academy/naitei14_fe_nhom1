"use client";

import "@/src/i18n/i18n";
import Link from "next/link";
import { useTranslation } from "react-i18next";

interface ProductEmptyStateProps {
  activeSearchQuery: string;
  setSearchQuery: (value: string) => void;
  setUrlSearchQuery: (value: string) => void;
  setCurrentPage: (page: number) => void;
}

export default function ProductEmptyState({
  activeSearchQuery,
  setSearchQuery,
  setUrlSearchQuery,
  setCurrentPage,
}: ProductEmptyStateProps) {
  const { t } = useTranslation();

  const handleClearFilters = () => {
    setSearchQuery("");
    setUrlSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="text-center py-12">
      <p className="text-lg text-gray-600 mb-4">
        {activeSearchQuery
          ? t("product.empty.withQuery", { query: activeSearchQuery })
          : t("product.empty.noResults")}
      </p>
      <p className="text-sm text-gray-500 mb-6">
        {t("product.empty.suggestion")}
      </p>
      <div className="flex gap-4 justify-center">
        {activeSearchQuery && (
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
          >
            {t("product.empty.clearFilters")}
          </button>
        )}
        <Link
          href="/products"
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          {t("product.empty.viewAll")}
        </Link>
      </div>
    </div>
  );
}
