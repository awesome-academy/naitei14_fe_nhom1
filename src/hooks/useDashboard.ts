import { useState, useEffect } from "react";
import axios from "axios";

export interface BestSellingProduct {
  id: string;
  name: string;
  totalSold: number;
  revenue: number;
  image: string;
}

export interface CategoryStats {
  name: string;
  totalSold: number;
  revenue: number;
}

export interface OrderStatusStats {
  status: string;
  count: number;
  percentage: number;
}

interface DashboardStats {
  totalUsers: number;
  totalRevenue: number;
  totalOrders: number;
  totalComments: number;
  totalProducts: number;
  completedOrders: number;
  pendingOrders: number;
  averageOrderValue: number;
}

interface ChartData {
  labels: string[];
  revenue: number[];
  orders: number[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [bestSellingProducts, setBestSellingProducts] = useState<BestSellingProduct[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [orderStatusStats, setOrderStatusStats] = useState<OrderStatusStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChartData = async (orders: any[], period: 'week' | 'month' = 'week') => {
    if (period === 'week') {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date;
      });

      const labels = last7Days.map(
        (date) => `${date.getDate()}/${date.getMonth() + 1}`
      );

      const revenue: number[] = [];
      const orderCounts: number[] = [];

      last7Days.forEach((date) => {
        const dateStr = date.toISOString().split("T")[0];
        const dayOrders = orders.filter((order: any) => {
          if (!order.orderDate) return false;
          const orderDate = new Date(order.orderDate)
            .toISOString()
            .split("T")[0];
          return orderDate === dateStr && order.status === "Đã hoàn thành";
        });

        const dayRevenue = dayOrders.reduce(
          (sum: number, order: any) => sum + (order.totalPrice || 0),
          0
        );

        revenue.push(dayRevenue);
        orderCounts.push(dayOrders.length);
      });

      setChartData({
        labels,
        revenue,
        orders: orderCounts,
      });
    } else {
      // Last 30 days
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date;
      });

      const labels = last30Days.map(
        (date) => `${date.getDate()}/${date.getMonth() + 1}`
      );

      const revenue: number[] = [];
      const orderCounts: number[] = [];

      last30Days.forEach((date) => {
        const dateStr = date.toISOString().split("T")[0];
        const dayOrders = orders.filter((order: any) => {
          if (!order.orderDate) return false;
          const orderDate = new Date(order.orderDate)
            .toISOString()
            .split("T")[0];
          return orderDate === dateStr && order.status === "Đã hoàn thành";
        });

        const dayRevenue = dayOrders.reduce(
          (sum: number, order: any) => sum + (order.totalPrice || 0),
          0
        );

        revenue.push(dayRevenue);
        orderCounts.push(dayOrders.length);
      });

      setChartData({
        labels,
        revenue,
        orders: orderCounts,
      });
    }
  };

  const fetchDashboardData = async (chartPeriod: 'week' | 'month' = 'week') => {
    try {
      setLoading(true);
      setError(null);

      const [usersResponse, ordersResponse, commentsResponse, productsResponse, orderDetailsResponse] =
        await Promise.all([
          axios.get(`${API_BASE_URL}/users`),
          axios.get(`${API_BASE_URL}/orders`),
          axios.get(`${API_BASE_URL}/reviews`),
          axios.get(`${API_BASE_URL}/products`),
          axios.get(`${API_BASE_URL}/orderDetails`),
        ]);

      const users = usersResponse.data;
      const orders = ordersResponse.data;
      const comments = commentsResponse.data;
      const products = productsResponse.data;
      const orderDetails = orderDetailsResponse.data;

      const totalUsers = users.length;
      const totalOrders = orders.length;
      const totalProducts = products.length;
      const completedOrders = orders.filter((order: any) => order.status === "Đã hoàn thành").length;
      const pendingOrders = orders.filter((order: any) => order.status === "Đang xử lý").length;
      
      const totalRevenue = orders
        .filter((order: any) => order.status === "Đã hoàn thành")
        .reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0);

      const averageOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;

      const totalComments = comments.length;
      
      setStats({
        totalUsers,
        totalRevenue,
        totalOrders,
        totalComments,
        totalProducts,
        completedOrders,
        pendingOrders,
        averageOrderValue,
      });

      // Calculate best selling products
      const productSales = new Map<string, { name: string; totalSold: number; revenue: number; image: string }>();
      
      orderDetails.forEach((detail: any) => {
        const order = orders.find((o: any) => o.id === detail.orderId);
        if (order?.status === "Đã hoàn thành") {
          const product = products.find((p: any) => p.id === detail.productId);
          if (product) {
            const existing = productSales.get(detail.productId) || {
              name: product.name,
              totalSold: 0,
              revenue: 0,
              image: product.image,
            };
            productSales.set(detail.productId, {
              ...existing,
              totalSold: existing.totalSold + detail.quantity,
              revenue: existing.revenue + (detail.totalPrice || 0),
            });
          }
        }
      });

      const bestSelling = Array.from(productSales.entries())
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, 5);
      
      setBestSellingProducts(bestSelling);

      // Calculate category statistics
      const categorySales = new Map<string, { totalSold: number; revenue: number }>();
      
      orderDetails.forEach((detail: any) => {
        const order = orders.find((o: any) => o.id === detail.orderId);
        if (order?.status === "Đã hoàn thành") {
          const product = products.find((p: any) => p.id === detail.productId);
          if (product?.category) {
            const existing = categorySales.get(product.category) || { totalSold: 0, revenue: 0 };
            categorySales.set(product.category, {
              totalSold: existing.totalSold + detail.quantity,
              revenue: existing.revenue + (detail.totalPrice || 0),
            });
          }
        }
      });

      const categoryData = Array.from(categorySales.entries())
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.revenue - a.revenue);
      
      setCategoryStats(categoryData);

      // Calculate order status statistics
      const statusCounts = new Map<string, number>();
      orders.forEach((order: any) => {
        const status = order.status || "Không xác định";
        statusCounts.set(status, (statusCounts.get(status) || 0) + 1);
      });

      const statusData = Array.from(statusCounts.entries())
        .map(([status, count]) => ({
          status,
          count,
          percentage: (count / totalOrders) * 100,
        }))
        .sort((a, b) => b.count - a.count);
      
      setOrderStatusStats(statusData);

      // Fetch chart data based on period
      await fetchChartData(orders, chartPeriod);
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setError("Không thể tải dữ liệu dashboard. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    stats,
    chartData,
    bestSellingProducts,
    categoryStats,
    orderStatusStats,
    loading,
    error,
    refreshData: fetchDashboardData,
    updateChartPeriod: async (period: 'week' | 'month') => {
      setLoading(true);
      try {
        const ordersResponse = await axios.get(`${API_BASE_URL}/orders`);
        await fetchChartData(ordersResponse.data, period);
      } catch (err) {
        console.error("Chart data fetch error:", err);
        setError("Không thể cập nhật dữ liệu biểu đồ. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    },
  };
};
