"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronUp, RefreshCw, Share2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile"

interface HumanStatsType {
  total_games: number;
  total_wins: number;
  total_draws: number;
  total_losses: number;
  win_rate: number | null;
  net_elo_change: number | null;
}

interface EnvironmentStats {
  environment_id: number;
  env_name: string;
  games_played: number;
  win_rate: number;
  net_elo: number;
  percentile: number;
}

interface HumanStatsProps {
  isMinimized: boolean;
  setIsMinimized: (min: boolean) => void;
}

function safeToFixed(num: number | null | undefined, fractionDigits = 1): string {
  return typeof num === "number" ? num.toFixed(fractionDigits) : "N/A";
}

async function fetchHumanNumericId(token: string): Promise<number | null> {
  const { data, error } = await supabase
    .from("humans")
    .select("id")
    .eq("cookie_id", token)
    .single();

  if (error) {
    console.error("Error fetching numeric ID from token:", error);
    return null;
  }
  if (!data) {
    console.error("No human found for token:", token);
    return null;
  }
  return data.id as number;
}

async function fetchNetEloChange(numericHumanId: number): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("player_games")
      .select("elo_change")
      .eq("human_id", numericHumanId);

    if (error) {
      console.error("Error fetching net elo change:", error);
      return 0;
    }

    if (!data || data.length === 0) {
      return 0;
    }

    const total = data.reduce((acc: number, row: any) => {
      return acc + (row.elo_change ?? 0);
    }, 0);

    return total;
  } catch (err) {
    console.error("Error in fetchNetEloChange:", err);
    return 0;
  }
}

export function HumanStats({ isMinimized, setIsMinimized }: HumanStatsProps) {
  const { token, isInitialized } = useAuth();
  const [stats, setStats] = useState<HumanStatsType | null>(null);
  const [envStats, setEnvStats] = useState<EnvironmentStats[]>([]);
  const [overallPercentile, setOverallPercentile] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isMobile = useIsMobile(); // Hook to detect mobile mode

  const fetchStats = async () => {
    if (!isInitialized || !token) return;
    setIsRefreshing(true);
    setError(null);
    setIsLoading(true);

    try {
      const { data: overallData, error: overallError } = await supabase.rpc("get_human_stats", { human_cookie_id: String(token) });
      if (overallError) throw overallError;

      const { data: envData, error: envError } = await supabase.rpc("get_human_env_stats", { human_cookie_id: String(token) });
      if (envError) throw envError;

      const { data: percentileData, error: percentileError } = await supabase.rpc("get_overall_performance_percentile", { human_cookie_id: String(token) });
      
      const numericID = await fetchHumanNumericId(String(token));
      let netElo = 0;
      if (numericID) {
        netElo = await fetchNetEloChange(numericID);
      }

      if (!overallData || !overallData[0]) {
        throw new Error('No stats data available');
      }

      const wins = Number(overallData[0].total_wins) || 0;
      const draws = Number(overallData[0].total_draws) || 0;
      const losses = Number(overallData[0].total_losses) || 0;
      const completedGames = wins + draws + losses;

      const overallStats: HumanStatsType = {
        total_games: completedGames,
        total_wins: wins,
        total_draws: draws,
        total_losses: losses,
        win_rate: completedGames > 0 ? (wins / completedGames) * 100 : 0,
        net_elo_change: netElo
      };

      setStats(overallStats);
      setEnvStats(envData || []);
      if (percentileData && percentileData.length > 0) {
        setOverallPercentile(percentileData[0].overall_percentile);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError(err instanceof Error ? err.message : "Failed to load stats");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [isInitialized, token]);

  if (isMinimized) {
    return null;
  }

  const bestEnvs = [...envStats]
    .sort((a, b) => b.percentile - a.percentile)
    .slice(0, 3);

  const challengingEnvs = [...envStats]
    .sort((a, b) => a.percentile - b.percentile)
    .slice(0, 3)
    .reverse();

  const handleShare = () => {
    if (!stats) return;

    const bestEnvsText = bestEnvs.length
      ? bestEnvs
          .map(
            (env, idx) =>
              `${idx + 1}. ${env.env_name}: WR ${safeToFixed(env.win_rate)}%, P ${safeToFixed(
                env.percentile
              )}%`
          )
          .join("\n")
      : "N/A";

    const challengingEnvsText = challengingEnvs.length
      ? challengingEnvs
          .map(
            (env, idx) =>
              `${idx + 1}. ${env.env_name}: WR ${safeToFixed(env.win_rate)}%, P ${safeToFixed(
                env.percentile
              )}%`
          )
          .join("\n")
      : "N/A";

    const tweetText = `My TextArena Stats:
--------------------
🎮 Games: ${stats.total_games}
✅ Win Rate: ${safeToFixed(stats.win_rate)}%
📈 Net Elo: ${
      stats.net_elo_change !== null && stats.net_elo_change !== undefined
        ? `${stats.net_elo_change >= 0 ? "+" : ""}${safeToFixed(stats.net_elo_change)}`
        : "N/A"
    }
🏆 Overall Percentile: ${safeToFixed(overallPercentile)}%

🚀 Best Environments (Highest to Lowest):
${bestEnvsText}

⚠️ Challenging Environments (Highest to Lowest):
${challengingEnvsText}`;

    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}`;
    window.open(shareUrl, "_blank");
  };

  return (
    <Card
      className="
        fixed top-16 left-4 right-4 mx-auto shadow-lg 
        bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60
        transition-all duration-200 sm:w-[600px] z-40
      "
    >
      <CardHeader className="flex items-center justify-between space-y-0 pb-2">
        <CardTitle className={`font-medium ${isMobile ? "text-xs" : "text-sm"}`}>
          Your Stats
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchStats}
            disabled={isRefreshing}
            className={`h-8 w-8 p-0 ${isRefreshing ? "animate-spin" : ""}`}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="h-8 w-8 p-0"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(true)}
            className="h-8 w-8 p-0"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className={`text-center py-4 ${isMobile ? "text-xs" : "text-sm"}`}>
            Loading stats...
          </div>
        ) : error ? (
          <div className={`text-center text-red-500 py-4 ${isMobile ? "text-xs" : "text-sm"}`}>
            {error}
          </div>
        ) : stats ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`font-medium ${isMobile ? "text-xs" : "text-sm"}`}>
                  Games Played
                </span>
                <span className={isMobile ? "text-xs" : "text-sm"}>{stats.total_games}</span>
              </div>
              <div className={`flex justify-between items-center ${isMobile ? "text-xs" : "text-sm"}`}>
                <span className="text-green-500">Win: {stats.total_wins}</span>
                <span className="text-gray-500">Draw: {stats.total_draws}</span>
                <span className="text-red-500">Loss: {stats.total_losses}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`font-medium ${isMobile ? "text-xs" : "text-sm"}`}>
                  Win Rate (WR)
                </span>
                <span className={isMobile ? "text-xs" : "text-sm"}>
                  {safeToFixed(stats.win_rate)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`font-medium ${isMobile ? "text-xs" : "text-sm"}`}>
                  Net Elo Change
                </span>
                <span
                  className={`${
                    stats.net_elo_change !== null &&
                    stats.net_elo_change !== undefined &&
                    stats.net_elo_change >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  } ${isMobile ? "text-xs" : "text-sm"}`}
                >
                  {stats.net_elo_change !== null && stats.net_elo_change !== undefined
                    ? `${stats.net_elo_change >= 0 ? "+" : ""}${safeToFixed(stats.net_elo_change)}`
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`font-medium ${isMobile ? "text-xs" : "text-sm"}`}>
                  Overall Percentile (P)
                </span>
                <span className={isMobile ? "text-xs" : "text-sm"}>
                  {overallPercentile !== null && overallPercentile !== undefined
                    ? safeToFixed(overallPercentile)
                    : "N/A"}
                  %
                </span>
              </div>
            </div>

            {envStats.length > 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className={`font-medium ${isMobile ? "text-xs" : "text-sm"}`}>
                    Best Environments
                  </h4>
                  {bestEnvs.map((env, idx) => (
                    <div
                      key={env.environment_id}
                      className={`flex justify-between items-center ${isMobile ? "text-[10px]" : "text-xs"}`}
                    >
                      <span>{`${idx + 1}. ${env.env_name}`}</span>
                      <span className="flex gap-2">
                        <span>WR: {safeToFixed(env.win_rate)}%</span>
                        <span
                          className={
                            (env.net_elo ?? 0) >= 0 ? "text-green-500" : "text-red-500"
                          }
                        >
                          Net Elo: {(env.net_elo ?? 0) >= 0 ? "+" : ""}
                          {safeToFixed(env.net_elo ?? 0)}
                        </span>
                        <span>P: {safeToFixed(env.percentile)}%</span>
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <h4 className={`font-medium ${isMobile ? "text-xs" : "text-sm"}`}>
                    Challenging Environments
                  </h4>
                  {challengingEnvs.map((env, idx) => (
                    <div
                      key={env.environment_id}
                      className={`flex justify-between items-center ${isMobile ? "text-[10px]" : "text-xs"}`}
                    >
                      <span>{`${idx + 1}. ${env.env_name}`}</span>
                      <span className="flex gap-2">
                        <span>WR: {safeToFixed(env.win_rate)}%</span>
                        <span
                          className={
                            (env.net_elo ?? 0) >= 0 ? "text-green-500" : "text-red-500"
                          }
                        >
                          Net Elo: {(env.net_elo ?? 0) >= 0 ? "+" : ""}
                          {safeToFixed(env.net_elo ?? 0)}
                        </span>
                        <span>P: {safeToFixed(env.percentile)}%</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}