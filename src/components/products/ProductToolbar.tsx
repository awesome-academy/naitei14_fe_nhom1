"use client";

import "@/src/i18n/i18n";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Grid, List, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useTranslation } from "react-i18next";

interface ProductToolbarProps {
  totalProducts: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
  sortBy: string;
  setSortBy: (value: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function ProductToolbar({
  totalProducts,
  indexOfFirstItem,
  indexOfLastItem,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
}: ProductToolbarProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder={t("product.toolbar.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {t("product.toolbar.showing", {
              from: indexOfFirstItem + 1,
              to: Math.min(indexOfLastItem, totalProducts),
              total: totalProducts,
            })}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder={t("product.toolbar.sortBy")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">
                {t("product.toolbar.sort.default")}
              </SelectItem>
              <SelectItem value="price-low">
                {t("product.toolbar.sort.priceLow")}
              </SelectItem>
              <SelectItem value="price-high">
                {t("product.toolbar.sort.priceHigh")}
              </SelectItem>
              <SelectItem value="name">
                {t("product.toolbar.sort.name")}
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="flex border rounded">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
