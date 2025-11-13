import { useMemo } from "react";
import Head from "next/head";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import {
  FaUser,
  FaShoppingCart,
  FaComment,
  FaSync,
  FaBox,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/src/hooks/useDashboard";
import { formatCurrency } from "@/src/utils/format.currency";
import { RevenueChart } from "./RevenueChart";
import { StatsCard, StatItem } from "./StartsCard";
import { ExportData } from "./ExportData";
import { BestSellingProducts } from "./BestSellingProducts";
import { CategoryStatsChart } from "./CategoryStatsChart";
import { OrderStatusChart } from "./OrderStatusChart";
import AdminPageLayout from "@/src/components/layout/AdminPageLayout";

export default function Dashboard() {
  const router = useRouter();
  const {
    stats,
    chartData,
    bestSellingProducts,
    categoryStats,
    orderStatusStats,
    loading,
    error,
    refreshData,
    updateChartPeriod,
  } = useDashboard();

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const dashboardStats: StatItem[] = useMemo(
    () => [
      {
        icon: <FaUser className="text-2xl" />,
        value: loading ? "..." : formatNumber(stats?.totalUsers || 0),
        label: "Người dùng",
        loading,
      },
      {
        icon: <FaBox className="text-2xl" />,
        value: loading ? "..." : formatNumber(stats?.totalProducts || 0),
        label: "Sản phẩm",
        loading,
      },
      {
        icon: <FaMoneyBill1Wave className="text-2xl" />,
        value: loading ? "..." : formatCurrency(stats?.totalRevenue || 0),
        label: "Tổng doanh thu",
        loading,
      },
      {
        icon: <FaShoppingCart className="text-2xl" />,
        value: loading ? "..." : formatNumber(stats?.totalOrders || 0),
        label: "Tổng đơn hàng",
        loading,
      },
      {
        icon: <FaCheckCircle className="text-2xl text-green-600" />,
        value: loading ? "..." : formatNumber(stats?.completedOrders || 0),
        label: "Đơn hoàn thành",
        loading,
      },
      {
        icon: <FaClock className="text-2xl text-yellow-600" />,
        value: loading ? "..." : formatNumber(stats?.pendingOrders || 0),
        label: "Đơn đang xử lý",
        loading,
      },
      {
        icon: <FaMoneyBill1Wave className="text-2xl text-blue-600" />,
        value: loading ? "..." : formatCurrency(stats?.averageOrderValue || 0),
        label: "Giá trị TB/đơn",
        loading,
      },
      {
        icon: <FaComment className="text-2xl" />,
        value: loading ? "..." : formatNumber(stats?.totalComments || 0),
        label: "Bình luận",
        loading,
      },
    ],
    [loading, stats]
  );

  if (error) {
    return (
      <AdminPageLayout>
        <div className="flex min-h-screen bg-gray-100 items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-red-600 mb-2">
              Lỗi tải dữ liệu
            </h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <Button
              onClick={() => refreshData()}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <FaSync className="mr-2" />
              Thử lại
            </Button>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout>
      <Head>
        <title>Dashboard - Drinkshop</title>
      </Head>
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <ExportData loading={loading} />
            <Button
              onClick={() => refreshData()}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <FaSync className={`mr-2 ${loading ? "animate-spin" : ""}`} />
              Làm mới
            </Button>
            <div className="flex items-center">
              <RiAdminLine className="text-2xl text-gray-600 mr-2" />
              <span className="text-gray-700">Admin</span>
              <span className="text-green-500 ml-2">Online</span>
            </div>
          </div>
        </header>

        <main className="p-6 overflow-auto">
          <StatsCard stats={dashboardStats} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <BestSellingProducts
              products={bestSellingProducts}
              loading={loading}
            />
            <OrderStatusChart statusData={orderStatusStats} loading={loading} />
          </div>

          <div className="mb-6">
            <CategoryStatsChart categories={categoryStats} loading={loading} />
          </div>

          <RevenueChart
            chartData={chartData || {}}
            loading={loading}
            onPeriodChange={updateChartPeriod}
          />
        </main>
      </div>
    </AdminPageLayout>
  );
}
