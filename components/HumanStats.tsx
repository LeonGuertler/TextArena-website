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
}

interface EnvironmentStats {
  environment_id: number;
  env_name: string;
  games_played: number;
  win_rate: number;
  net_trueskill: number;
  percentile: number;
  is_best: boolean;
}

interface HumanStatsProps {
  isMinimized: boolean;
  setIsMinimized: (min: boolean) => void;
}

function safeToFixed(num: number | null | undefined, fractionDigits = 1): string {
  return typeof num === "number" ? num.toFixed(fractionDigits) : "N/A";
}

export function HumanStats({ isMinimized, setIsMinimized }: HumanStatsProps) {
  const { token, isInitialized } = useAuth();
  const [stats, setStats] = useState<HumanStatsType | null>(null);
  const [envStats, setEnvStats] = useState<EnvironmentStats[]>([]);
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
        win_rate: completedGames > 0 ? (wins / completedGames) * 100 : 0
      };

      setStats(overallStats);
      setEnvStats(envData || []);
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

  const handleShare = () => {
    if (!stats) return;
  
    const bestEnvs = [...envStats]
      .filter(env => env.is_best === true)
      .sort((a, b) => parseFloat(b.net_trueskill.toString()) - parseFloat(a.net_trueskill.toString()))
      .slice(0, 3);
  
    const challengingEnvs = [...envStats]
      .filter(env => env.is_best === false)
      .sort((a, b) => parseFloat(a.net_trueskill.toString()) - parseFloat(b.net_trueskill.toString()))
      .slice(0, 3)
      .reverse();
  
    const bestEnvsText = bestEnvs.length
      ? bestEnvs
          .map(
            (env, idx) =>
              `${idx + 1}. ${env.env_name}: WR ${safeToFixed(parseFloat(env.win_rate.toString()))}%`
          )
          .join("\n")
      : "N/A";
  
    const challengingEnvsText = challengingEnvs.length
      ? challengingEnvs
          .map(
            (env, idx) =>
              `${idx + 1}. ${env.env_name}: WR ${safeToFixed(parseFloat(env.win_rate.toString()))}%`
          )
          .join("\n")
      : "N/A";
  
    const tweetText = `My TextArena Stats:
  --------------------
  🎮 Games: ${stats.total_games}
  ✅ Win Rate: ${safeToFixed(stats.win_rate)}%
  
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
            </div>

            {envStats.length > 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className={`font-medium ${isMobile ? "text-xs" : "text-sm"}`}>
                    Best Environments
                  </h4>
                  {envStats
                    .filter(env => env.is_best === true)
                    .sort((a, b) => parseFloat(b.net_trueskill.toString()) - parseFloat(a.net_trueskill.toString()))
                    .slice(0, 3)
                    .map((env, idx) => (
                      <div
                        key={env.environment_id}
                        className={`flex justify-between items-center ${isMobile ? "text-[10px]" : "text-xs"}`}
                      >
                        <span>{`${idx + 1}. ${env.env_name}`}</span>
                        <div className="flex flex-col items-end">
                          <span>WR: {safeToFixed(parseFloat(env.win_rate.toString()))}%</span>
                          <div className="flex gap-2">
                            <span className="text-white">
                              TS: {safeToFixed(parseFloat(env.net_trueskill.toString()))}
                            </span>
                            <span className="text-white">
                              PCT: {safeToFixed(parseFloat(env.percentile.toString()))}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="space-y-2">
                  <h4 className={`font-medium ${isMobile ? "text-xs" : "text-sm"}`}>
                    Challenging Environments
                  </h4>
                  {envStats
                    .filter(env => env.is_best === false)
                    .sort((a, b) => parseFloat(a.net_trueskill.toString()) - parseFloat(b.net_trueskill.toString()))
                    .slice(0, 3)
                    .reverse()
                    .map((env, idx) => (
                      <div
                        key={env.environment_id}
                        className={`flex justify-between items-center ${isMobile ? "text-[10px]" : "text-xs"}`}
                      >
                        <span>{`${idx + 1}. ${env.env_name}`}</span>
                        <div className="flex flex-col items-end">
                          <span>WR: {safeToFixed(parseFloat(env.win_rate.toString()))}%</span>
                          <div className="flex gap-2">
                            <span className="text-white">
                              TS: {safeToFixed(parseFloat(env.net_trueskill.toString()))}
                            </span>
                            <span className="text-white">
                              PCT: {safeToFixed(parseFloat(env.percentile.toString()))}%
                            </span>
                          </div>
                        </div>
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