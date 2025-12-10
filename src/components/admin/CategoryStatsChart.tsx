import { CategoryStats } from "@/src/hooks/useDashboard";
import { formatCurrency } from "@/src/utils/format.currency";
import { FaChartBar } from "react-icons/fa";

interface CategoryStatsChartProps {
  categories: CategoryStats[];
  loading: boolean;
}

export const CategoryStatsChart = ({ categories, loading }: CategoryStatsChartProps) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FaChartBar className="text-purple-600 mr-2" />
          Thống Kê Theo Danh Mục
        </h2>
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FaChartBar className="text-purple-600 mr-2" />
          Thống Kê Theo Danh Mục
        </h2>
        <p className="text-gray-500 text-center py-8">Chưa có dữ liệu danh mục</p>
      </div>
    );
  }

  const maxRevenue = Math.max(...categories.map(c => c.revenue));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <FaChartBar className="text-purple-600 mr-2" />
        Thống Kê Theo Danh Mục
      </h2>
      <div className="space-y-4">
        {categories.map((category, index) => {
          const percentage = maxRevenue > 0 ? (category.revenue / maxRevenue) * 100 : 0;
          return (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm">{category.name}</span>
                <div className="text-right">
                  <span className="text-xs text-gray-600">
                    {category.totalSold} sản phẩm
                  </span>
                </div>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  >
                    {percentage > 20 && (
                      <span className="text-white text-xs font-semibold">
                        {formatCurrency(category.revenue)}
                      </span>
                    )}
                  </div>
                </div>
                {percentage <= 20 && (
                  <span className="text-xs text-gray-700 ml-2 absolute right-0 top-1/2 -translate-y-1/2 -mr-2 transform translate-x-full">
                    {formatCurrency(category.revenue)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
