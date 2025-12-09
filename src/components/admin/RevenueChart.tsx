import { useMemo, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { formatCurrency } from "@/src/utils/format.currency";
import { FaChartLine, FaArrowUp, FaArrowDown, FaMinus, FaCalendarWeek, FaCalendarAlt } from "react-icons/fa";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface RevenueChartProps {
    chartData: {
        labels?: string[];
        revenue?: number[];
        orders?: number[];
    };
    loading: boolean;
    onPeriodChange?: (period: 'week' | 'month') => void;
}

export const RevenueChart = ({ chartData, loading, onPeriodChange }: RevenueChartProps) => {
    const [period, setPeriod] = useState<'week' | 'month'>('week');

    const handlePeriodChange = (newPeriod: 'week' | 'month') => {
        setPeriod(newPeriod);
        if (onPeriodChange) {
            onPeriodChange(newPeriod);
        }
    };

    // Calculate statistics
    const stats = useMemo(() => {
        const revenue = chartData?.revenue || [];
        const orders = chartData?.orders || [];
        
        if (revenue.length === 0) {
            return { totalRevenue: 0, totalOrders: 0, avgRevenue: 0, trend: 0 };
        }

        const totalRevenue = revenue.reduce((sum, val) => sum + val, 0);
        const totalOrders = orders.reduce((sum, val) => sum + val, 0);
        const avgRevenue = totalRevenue / revenue.length;
        
        const recentSlice = revenue.slice(-3);
        const previousSlice = revenue.slice(-6, -3);
        const recent = recentSlice.reduce((sum, val) => sum + val, 0) / Math.max(recentSlice.length, 1);
        const previousAvg = previousSlice.length > 0 ? previousSlice.reduce((sum, val) => sum + val, 0) / previousSlice.length : 0;
        const trend = previousAvg > 0 ? ((recent - previousAvg) / previousAvg) * 100 : 0;
        
        return { totalRevenue, totalOrders, avgRevenue, trend };
    }, [chartData]);

    const chartDataConfig = useMemo(
        () => ({
            labels: chartData?.labels || [],
            datasets: [
                {
                    label: "Doanh thu (VND)",
                    data: chartData?.revenue || [],
                    borderColor: "rgb(59, 130, 246)",
                    backgroundColor: (context: any) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                        gradient.addColorStop(0, "rgba(59, 130, 246, 0.3)");
                        gradient.addColorStop(1, "rgba(59, 130, 246, 0.01)");
                        return gradient;
                    },
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: "rgb(59, 130, 246)",
                    pointBorderColor: "#fff",
                    pointBorderWidth: 2,
                    yAxisID: "y",
                },
                {
                    label: "Số đơn hàng",
                    data: chartData?.orders || [],
                    borderColor: "rgb(239, 68, 68)",
                    backgroundColor: (context: any) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                        gradient.addColorStop(0, "rgba(239, 68, 68, 0.3)");
                        gradient.addColorStop(1, "rgba(239, 68, 68, 0.01)");
                        return gradient;
                    },
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: "rgb(239, 68, 68)",
                    pointBorderColor: "#fff",
                    pointBorderWidth: 2,
                    yAxisID: "y1",
                },
            ],
        }),
        [chartData]
    );

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: "index" as const,
            intersect: false,
        },
        plugins: {
            legend: {
                position: "top" as const,
                labels: {
                    usePointStyle: true,
                    padding: 15,
                    font: {
                        size: 13,
                    },
                },
            },
            tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                padding: 12,
                titleFont: {
                    size: 14,
                },
                bodyFont: {
                    size: 13,
                },
                callbacks: {
                    label: function (context: any) {
                        let label = context.dataset.label || "";
                        if (label) {
                            label += ": ";
                        }
                        if (context.datasetIndex === 0) {
                            label += formatCurrency(context.parsed.y);
                        } else {
                            label += context.parsed.y + " đơn";
                        }
                        return label;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 12,
                    },
                },
            },
            y: {
                type: "linear" as const,
                display: true,
                position: "left" as const,
                grid: {
                    color: "rgba(0, 0, 0, 0.05)",
                },
                ticks: {
                    font: {
                        size: 11,
                    },
                    callback: function (value: unknown) {
                        const num = value as number;
                        if (num >= 1000000) {
                            return (num / 1000000).toFixed(1) + "M";
                        }
                        if (num >= 1000) {
                            return (num / 1000).toFixed(0) + "K";
                        }
                        return num.toString();
                    },
                },
            },
            y1: {
                type: "linear" as const,
                display: true,
                position: "right" as const,
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    font: {
                        size: 11,
                    },
                },
            },
        },
    };

    const getTrendIcon = () => {
        if (stats.trend > 5) return <FaArrowUp className="text-green-500" />;
        if (stats.trend < -5) return <FaArrowDown className="text-red-500" />;
        return <FaMinus className="text-gray-500" />;
    };

    const getTrendColor = () => {
        if (stats.trend > 5) return "text-green-600";
        if (stats.trend < -5) return "text-red-600";
        return "text-gray-600";
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <FaChartLine className="text-3xl text-blue-600 mr-3" />
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            Biểu Đồ Doanh Thu & Đơn Hàng
                        </h2>
                        <p className="text-sm text-gray-500">
                            {period === 'week' ? '7 ngày gần nhất' : '30 ngày gần nhất'}
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center space-x-3">
                    {!loading && (
                        <div className="flex items-center space-x-1 mr-4">
                            {getTrendIcon()}
                            <span className={`text-sm font-semibold ${getTrendColor()}`}>
                                {Math.abs(stats.trend).toFixed(1)}%
                            </span>
                        </div>
                    )}
                    
                    {/* Period Selector */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => handlePeriodChange('week')}
                            aria-pressed={period === 'week'}
                            aria-label="Hiện thị dữ liệu 7 ngày gần nhất"
                            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                                period === 'week'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            <FaCalendarWeek className="mr-2" />
                            7 ngày
                        </button>
                        <button
                            onClick={() => handlePeriodChange('month')}
                            aria-pressed={period === 'month'}
                            aria-label="Hiện thị dữ liệu 30 ngày gần nhất"
                            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                                period === 'month'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            <FaCalendarAlt className="mr-2" />
                            30 ngày
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            {!loading && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-600 font-semibold mb-1">Tổng Doanh Thu</p>
                        <p className="text-lg font-bold text-blue-900">
                            {formatCurrency(stats.totalRevenue)}
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                        <p className="text-xs text-red-600 font-semibold mb-1">Tổng Đơn Hàng</p>
                        <p className="text-lg font-bold text-red-900">{stats.totalOrders}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                        <p className="text-xs text-green-600 font-semibold mb-1">TB/Ngày</p>
                        <p className="text-lg font-bold text-green-900">
                            {formatCurrency(stats.avgRevenue)}
                        </p>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="h-80 w-full flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-500">Đang tải dữ liệu biểu đồ...</p>
                </div>
            ) : (
                <div className="h-80 w-full">
                    <Line data={chartDataConfig} options={chartOptions} />
                </div>
            )}
        </div>
    );
};
