import { OrderStatusStats } from "@/src/hooks/useDashboard";
import { FaClipboardList } from "react-icons/fa";

interface OrderStatusChartProps {
  statusData: OrderStatusStats[];
  loading: boolean;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  "Đã hoàn thành": { bg: "bg-green-500", text: "text-green-700" },
  "Đang xử lý": { bg: "bg-yellow-500", text: "text-yellow-700" },
  "Đang giao hàng": { bg: "bg-blue-500", text: "text-blue-700" },
  "Đã hủy": { bg: "bg-red-500", text: "text-red-700" },
  "Chờ xác nhận": { bg: "bg-orange-500", text: "text-orange-700" },
};

export const OrderStatusChart = ({ statusData, loading }: OrderStatusChartProps) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FaClipboardList className="text-blue-600 mr-2" />
          Trạng Thái Đơn Hàng
        </h2>
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!statusData || statusData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FaClipboardList className="text-blue-600 mr-2" />
          Trạng Thái Đơn Hàng
        </h2>
        <p className="text-gray-500 text-center py-8">Chưa có dữ liệu đơn hàng</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <FaClipboardList className="text-blue-600 mr-2" />
        Trạng Thái Đơn Hàng
      </h2>
      <div className="space-y-3">
        {statusData.map((item, index) => {
          const colorConfig = statusColors[item.status] || { bg: "bg-gray-500", text: "text-gray-700" };
          return (
            <div key={index} className="border-b last:border-b-0 pb-3 last:pb-0">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm">{item.status}</span>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-bold ${colorConfig.text}`}>
                    {item.count} đơn
                  </span>
                  <span className="text-xs text-gray-500">
                    ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`${colorConfig.bg} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
