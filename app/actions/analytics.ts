"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";

export type DailyUsage = {
  date: string;
  total_tokens: number;
  total_cost: number;
  api_calls: number;
};

export type UserUsage = {
  user_name: string;
  total_tokens: number;
  total_cost: number;
  api_calls: number;
};

export type UsageStats = {
  total_cost: number;
  total_tokens: number;
  total_calls: number;
  avg_tokens_per_call: number;
};

/**
 * Get overall usage statistics
 */
export async function getUsageStats(days: number = 30): Promise<UsageStats> {
  const supabase = await createSupabaseServerClient();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from("api_usage")
    .select("total_tokens, cost_usd")
    .gte("created_at", startDate.toISOString());

  if (error || !data) {
    return {
      total_cost: 0,
      total_tokens: 0,
      total_calls: 0,
      avg_tokens_per_call: 0,
    };
  }

  const totalCost = data.reduce((sum, row) => sum + Number(row.cost_usd), 0);
  const totalTokens = data.reduce((sum, row) => sum + row.total_tokens, 0);
  const totalCalls = data.length;
  const avgTokens = totalCalls > 0 ? Math.round(totalTokens / totalCalls) : 0;

  return {
    total_cost: totalCost,
    total_tokens: totalTokens,
    total_calls: totalCalls,
    avg_tokens_per_call: avgTokens,
  };
}

/**
 * Get daily usage for charts
 */
export async function getDailyUsage(days: number = 30): Promise<DailyUsage[]> {
  const supabase = await createSupabaseServerClient();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from("api_usage")
    .select("created_at, total_tokens, cost_usd")
    .gte("created_at", startDate.toISOString())
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  // Group by day
  const dailyMap = new Map<
    string,
    { tokens: number; cost: number; calls: number }
  >();

  data.forEach((row) => {
    const date = new Date(row.created_at).toISOString().split("T")[0];
    const existing = dailyMap.get(date) || { tokens: 0, cost: 0, calls: 0 };

    dailyMap.set(date, {
      tokens: existing.tokens + row.total_tokens,
      cost: existing.cost + Number(row.cost_usd),
      calls: existing.calls + 1,
    });
  });

  // Convert to array
  return Array.from(dailyMap.entries()).map(([date, stats]) => ({
    date,
    total_tokens: stats.tokens,
    total_cost: Number(stats.cost.toFixed(4)),
    api_calls: stats.calls,
  }));
}

/**
 * Get usage by user
 */
export async function getUserUsage(days: number = 30): Promise<UserUsage[]> {
  const supabase = await createSupabaseServerClient();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from("api_usage")
    .select(
      `
      user_id,
      total_tokens,
      cost_usd,
      users (name)
    `,
    )
    .gte("created_at", startDate.toISOString());

  if (error || !data) {
    return [];
  }

  // Group by user
  const userMap = new Map<
    string,
    { tokens: number; cost: number; calls: number }
  >();

  data.forEach((row: any) => {
    const userName = row.users?.name || "Unknown";
    const existing = userMap.get(userName) || { tokens: 0, cost: 0, calls: 0 };

    userMap.set(userName, {
      tokens: existing.tokens + row.total_tokens,
      cost: existing.cost + Number(row.cost_usd),
      calls: existing.calls + 1,
    });
  });

  // Convert to array and sort by cost
  return Array.from(userMap.entries())
    .map(([name, stats]) => ({
      user_name: name,
      total_tokens: stats.tokens,
      total_cost: Number(stats.cost.toFixed(4)),
      api_calls: stats.calls,
    }))
    .sort((a, b) => b.total_cost - a.total_cost);
}
