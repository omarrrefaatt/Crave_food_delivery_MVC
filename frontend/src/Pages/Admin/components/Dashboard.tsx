import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Building,
  ShoppingCart,
  DollarSign,
  Star,
  UtensilsCrossed,
  UserCheck,
} from "lucide-react";
import { getStatistics } from "../services"; // Adjust the import path as necessary
import {
  StatsData,
  ApiResponse,
  CategoryData,
  UserTypeData,
  RevenueData,
  DashboardProps,
  ChartTooltipProps,
} from "../types";

const Dashboard: React.FC<DashboardProps> = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dashboardLoading, setDashboardLoading] = useState<boolean>(true);
  const [statsData, setStatsData] = useState<StatsData | null>(null);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setDashboardLoading(true);
      try {
        const response: ApiResponse = await getStatistics();
        setStatsData(response.$values[0]);
        setDashboardLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setDashboardLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNavigation = (path: string): void => {
    console.log(`Navigate to: ${path}`);
  };

  // Prepare data for charts
  const categoryData: CategoryData[] = statsData
    ? Object.entries(statsData.categoriesNumberOfRestaurts).map(
        ([name, value]): CategoryData => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value: value,
          percentage: ((value / statsData.totalRestaurants) * 100).toFixed(1),
        })
      )
    : [];

  const userTypeData: UserTypeData[] = statsData
    ? [
        { name: "Clients", value: statsData.totalClients, color: "#dc2626" },
        { name: "Managers", value: statsData.totalManagers, color: "#22c55e" },
        { name: "Admins", value: statsData.totalAdmins, color: "#ffb300" },
      ]
    : [];

  const revenueData: RevenueData[] = statsData
    ? [
        { name: "Total Revenue", value: statsData.totalRevenue },
        { name: "Avg Order Value", value: statsData.averageOrderValue },
        {
          name: "Revenue per Restaurant",
          value: Math.round(
            statsData.totalRevenue / statsData.totalRestaurants
          ),
        },
      ]
    : [];

  // Dark mode colors
  const COLORS: string[] = [
    "#dc2626",
    "#22c55e",
    "#ffb300",
    "#3b82f6",
    "#8b5cf6",
    "#06b6d4",
    "#84cc16",
  ];

  const tooltipStyle: ChartTooltipProps = {
    backgroundColor: "#1e293b",
    border: "1px solid #475569",
    borderRadius: "8px",
    color: "#ffffff",
  };

  if (loading || dashboardLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-300">
            Overview of your restaurant management system
          </p>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 border-slate-700 rounded-xl shadow-sm p-6 border hover:bg-slate-700 hover:shadow-lg hover:shadow-red-900/20 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Total Users
                </p>
                <p className="text-2xl font-bold text-white">
                  {statsData?.totalUsers || 0}
                </p>
                <p className="text-xs text-green-400 mt-1">
                  Active system users
                </p>
              </div>
              <div className="h-12 w-12 bg-red-900/30 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border-slate-700 rounded-xl shadow-sm p-6 border hover:bg-slate-700 hover:shadow-lg hover:shadow-red-900/20 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Restaurants
                </p>
                <p className="text-2xl font-bold text-white">
                  {statsData?.totalRestaurants || 0}
                </p>
                <p className="text-xs text-green-400 mt-1">
                  Active restaurants
                </p>
              </div>
              <div className="h-12 w-12 bg-green-900/30 rounded-xl flex items-center justify-center">
                <Building className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border-slate-700 rounded-xl shadow-sm p-6 border hover:bg-slate-700 hover:shadow-lg hover:shadow-red-900/20 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-white">
                  {statsData?.totalOrders || 0}
                </p>
                <p className="text-xs text-green-400 mt-1">Orders processed</p>
              </div>
              <div className="h-12 w-12 bg-yellow-900/30 rounded-xl flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border-slate-700 rounded-xl shadow-sm p-6 border hover:bg-slate-700 hover:shadow-lg hover:shadow-red-900/20 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-red-400">
                  ${statsData?.totalRevenue?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-green-400 mt-1">Platform revenue</p>
              </div>
              <div className="h-12 w-12 bg-red-900/30 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* User Role Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 border-slate-700 rounded-xl shadow-sm p-6 border hover:bg-slate-700 hover:shadow-lg hover:shadow-red-900/20 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-400">
                Clients
              </span>
              <UserCheck className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-400">
              {statsData?.totalClients || 0}
            </p>
            <p className="text-xs text-slate-500">Active customers</p>
          </div>

          <div className="bg-slate-800 border-slate-700 rounded-xl shadow-sm p-6 border hover:bg-slate-700 hover:shadow-lg hover:shadow-red-900/20 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-400">
                Managers
              </span>
              <Users className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-400">
              {statsData?.totalManagers || 0}
            </p>
            <p className="text-xs text-slate-500">Restaurant managers</p>
          </div>

          <div className="bg-slate-800 border-slate-700 rounded-xl shadow-sm p-6 border hover:bg-slate-700 hover:shadow-lg hover:shadow-red-900/20 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-400">Admins</span>
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-yellow-400">
              {statsData?.totalAdmins || 0}
            </p>
            <p className="text-xs text-slate-500">System administrators</p>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800 border-slate-700 rounded-xl shadow-sm p-6 border hover:bg-slate-700 hover:shadow-lg hover:shadow-red-900/20 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Business Metrics
              </h3>
              <UtensilsCrossed className="h-6 w-6 text-orange-500" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Food Items</span>
                <span className="text-lg font-semibold text-white">
                  {statsData?.totalFoodItems || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Reviews</span>
                <span className="text-lg font-semibold text-white">
                  {statsData?.totalReviews || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Avg Order Value</span>
                <span className="text-lg font-semibold text-red-400">
                  ${statsData?.averageOrderValue?.toFixed(2) || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border-slate-700 rounded-xl shadow-sm p-6 border hover:bg-slate-700 hover:shadow-lg hover:shadow-red-900/20 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Performance</h3>
              <DollarSign className="h-6 w-6 text-red-500" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">
                  Revenue per Restaurant
                </span>
                <span className="text-lg font-semibold text-red-400">
                  $
                  {statsData
                    ? Math.round(
                        statsData.totalRevenue / statsData.totalRestaurants
                      ).toLocaleString()
                    : 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">
                  Orders per Restaurant
                </span>
                <span className="text-lg font-semibold text-white">
                  {statsData
                    ? Math.round(
                        statsData.totalOrders / statsData.totalRestaurants
                      )
                    : 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">
                  Items per Restaurant
                </span>
                <span className="text-lg font-semibold text-white">
                  {statsData
                    ? Math.round(
                        statsData.totalFoodItems / statsData.totalRestaurants
                      )
                    : 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Restaurant Categories Chart */}
          <div className="bg-slate-800 border-slate-700 rounded-xl shadow-sm p-6 border hover:bg-slate-700 hover:shadow-lg hover:shadow-red-900/20 transition-all duration-200">
            <h3 className="text-lg font-semibold text-white mb-4">
              Restaurant Categories
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({
                    name,
                    percentage,
                  }: {
                    name: string;
                    percentage: string;
                  }) => `${name} (${percentage}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* User Types Chart */}
          <div className="bg-slate-800 border-slate-700 rounded-xl shadow-sm p-6 border hover:bg-slate-700 hover:shadow-lg hover:shadow-red-900/20 transition-all duration-200">
            <h3 className="text-lg font-semibold text-white mb-4">
              User Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} />
                <YAxis tick={{ fill: "#94a3b8" }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Analytics */}
        <div className="bg-slate-800 border-slate-700 rounded-xl shadow-sm p-6 border hover:bg-slate-700 hover:shadow-lg hover:shadow-red-900/20 transition-all duration-200 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            Revenue Analytics
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} />
              <YAxis tick={{ fill: "#94a3b8" }} />
              <Tooltip
                formatter={(value: number) => [
                  `$${value.toLocaleString()}`,
                  "Value",
                ]}
                contentStyle={tooltipStyle}
              />
              <Bar dataKey="value" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800 border-slate-700 rounded-xl shadow-sm p-6 border hover:bg-slate-700 hover:shadow-lg hover:shadow-red-900/20 transition-all duration-200">
          <h2 className="text-xl font-semibold text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => handleNavigation("/admin-profile/restaurants")}
              className="p-6 border-2 border-dashed border-slate-600 hover:border-red-500 hover:bg-red-900/20 rounded-xl transition-all duration-200 group"
            >
              <div className="text-center">
                <Building className="h-8 w-8 text-slate-400 group-hover:text-red-400 mx-auto mb-2" />
                <h3 className="text-sm font-medium text-white mb-1">
                  Add Restaurant
                </h3>
                <p className="text-xs text-slate-400">
                  Create new restaurant profile
                </p>
              </div>
            </button>

            <button
              onClick={() => handleNavigation("/admin-profile/managers")}
              className="p-6 border-2 border-dashed border-slate-600 hover:border-green-500 hover:bg-green-900/20 rounded-xl transition-all duration-200 group"
            >
              <div className="text-center">
                <UserCheck className="h-8 w-8 text-slate-400 group-hover:text-green-400 mx-auto mb-2" />
                <h3 className="text-sm font-medium text-white mb-1">
                  Add Manager
                </h3>
                <p className="text-xs text-slate-400">
                  Register new restaurant manager
                </p>
              </div>
            </button>

            <button
              onClick={() => handleNavigation("/admin-profile/restaurants")}
              className="p-6 border-2 border-dashed border-slate-600 hover:border-blue-500 hover:bg-blue-900/20 rounded-xl transition-all duration-200 group"
            >
              <div className="text-center">
                <Building className="h-8 w-8 text-slate-400 group-hover:text-blue-400 mx-auto mb-2" />
                <h3 className="text-sm font-medium text-white mb-1">
                  View Restaurants
                </h3>
                <p className="text-xs text-slate-400">
                  Manage existing restaurants
                </p>
              </div>
            </button>

            <button
              onClick={() => handleNavigation("/admin-profile/managers")}
              className="p-6 border-2 border-dashed border-slate-600 hover:border-yellow-500 hover:bg-yellow-900/20 rounded-xl transition-all duration-200 group"
            >
              <div className="text-center">
                <Users className="h-8 w-8 text-slate-400 group-hover:text-yellow-400 mx-auto mb-2" />
                <h3 className="text-sm font-medium text-white mb-1">
                  View Managers
                </h3>
                <p className="text-xs text-slate-400">
                  Manage existing managers
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
