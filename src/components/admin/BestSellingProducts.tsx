import Image from "next/image";
import { BestSellingProduct } from "@/src/hooks/useDashboard";
import { formatCurrency } from "@/src/utils/format.currency";
import { FaTrophy } from "react-icons/fa";

interface BestSellingProductsProps {
  products: BestSellingProduct[];
  loading: boolean;
}

export const BestSellingProducts = ({ products, loading }: BestSellingProductsProps) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FaTrophy className="text-yellow-500 mr-2" />
          Top 5 Sản Phẩm Bán Chạy
        </h2>
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4 p-3 bg-gray-50 rounded">
              <div className="w-16 h-16 bg-gray-300 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FaTrophy className="text-yellow-500 mr-2" />
          Top 5 Sản Phẩm Bán Chạy
        </h2>
        <p className="text-gray-500 text-center py-8">Chưa có dữ liệu sản phẩm bán chạy</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <FaTrophy className="text-yellow-500 mr-2" />
        Top 5 Sản Phẩm Bán Chạy
      </h2>
      <div className="space-y-3">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="flex items-center space-x-4 p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
          >
            <div className="flex-shrink-0 w-8 text-center">
              <span className={`text-lg font-bold ${
                index === 0 ? 'text-yellow-500' :
                index === 1 ? 'text-gray-400' :
                index === 2 ? 'text-orange-600' :
                'text-gray-600'
              }`}>
                #{index + 1}
              </span>
            </div>
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover rounded"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{product.name}</h3>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-600">
                  Đã bán: <span className="font-semibold text-blue-600">{product.totalSold}</span>
                </span>
                <span className="text-xs text-green-600 font-semibold">
                  {formatCurrency(product.revenue)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
