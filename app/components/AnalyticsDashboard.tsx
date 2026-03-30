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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/lib/components/card";
import { Spinner } from "@/lib/components/spinner";

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
        <div className="flex justify-center items-center py-12">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">
            📊 API Analytics
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Monitor API usage and costs
          </p>
        </div>

        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        >
          <option value={7} className="bg-slate-900">
            Last 7 days
          </option>
          <option value={30} className="bg-slate-900">
            Last 30 days
          </option>
          <option value={90} className="bg-slate-900">
            Last 90 days
          </option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-slate-400 text-sm mb-2">Total Cost</div>
            <div className="text-3xl font-bold text-amber-400">
              ${stats?.total_cost.toFixed(4)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-slate-400 text-sm mb-2">Total Tokens</div>
            <div className="text-3xl font-bold text-sky-400">
              {stats?.total_tokens.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-slate-400 text-sm mb-2">API Calls</div>
            <div className="text-3xl font-bold text-emerald-400">
              {stats?.total_calls}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-slate-400 text-sm mb-2">Avg Tokens/Call</div>
            <div className="text-3xl font-bold text-violet-400">
              {stats?.avg_tokens_per_call}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Usage Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daily Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                <YAxis yAxisId="left" stroke="rgba(255,255,255,0.5)" />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="rgba(255,255,255,0.5)"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  labelStyle={{ color: "#e5e7eb" }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="total_tokens"
                  stroke="#38bdf8"
                  name="Tokens"
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="total_cost"
                  stroke="#fbbf24"
                  name="Cost ($)"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* User Usage Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Worker Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis dataKey="user_name" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  labelStyle={{ color: "#e5e7eb" }}
                />
                <Legend />
                <Bar dataKey="total_tokens" fill="#38bdf8" name="Tokens" />
                <Bar dataKey="total_cost" fill="#fbbf24" name="Cost ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* User Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Worker Details</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                    Worker
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-200">
                    Calls
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-200">
                    Tokens
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-200">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {userData.map((user, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {user.user_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400 text-right">
                      {user.api_calls}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400 text-right">
                      {user.total_tokens.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-amber-400 text-right font-semibold">
                      ${user.total_cost.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
