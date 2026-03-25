"use client";

import { useEffect, useState } from "react";
import {
  getUsageStats,
  getDailyUsage,
  getUserUsage,
  type DailyUsage,
  type UserUsage,
  type UsageStats,
} from "@/app/actions/analytics";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [dailyData, setDailyData] = useState<DailyUsage[]>([]);
  const [userData, setUserData] = useState<UserUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    loadData();
  }, [days]);

  const loadData = async () => {
    setLoading(true);
    const [statsData, daily, users] = await Promise.all([
      getUsageStats(days),
      getDailyUsage(days),
      getUserUsage(days),
    ]);

    setStats(statsData);
    setDailyData(daily);
    setUserData(users);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          📊 Analytics Dashboard
        </h1>

        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total cost</div>
          <div className="text-3xl font-bold text-blue-600">
            ${stats?.total_cost.toFixed(4)}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total tokens</div>
          <div className="text-3xl font-bold text-green-600">
            {stats?.total_tokens.toLocaleString()}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Api calls</div>
          <div className="text-3xl font-bold text-purple-600">
            {stats?.total_calls}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">
            average Token/api call
          </div>
          <div className="text-3xl font-bold text-orange-600">
            {stats?.avg_tokens_per_call}
          </div>
        </div>
      </div>

      {/* Daily Usage Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Daily usage</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="total_tokens"
              stroke="#8884d8"
              name="Token"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="total_cost"
              stroke="#82ca9d"
              name="Costo ($)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* User Usage Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Workers Usage</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="user_name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total_tokens" fill="#8884d8" name="Token" />
            <Bar dataKey="total_cost" fill="#82ca9d" name="Costo ($)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-lg shadow p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Detail workers</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Worker
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                  Calls
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                  Token
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                  Costs
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {userData.map((user, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {user.user_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-right">
                    {user.api_calls}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-right">
                    {user.total_tokens.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right font-semibold">
                    ${user.total_cost.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
