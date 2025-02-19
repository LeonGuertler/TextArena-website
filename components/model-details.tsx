"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  LineChart,
  Line,
  PolarRadiusAxis,
} from "recharts"
import { supabase } from "@/lib/supabase"
import { useIsMobile } from "@/hooks/use-mobile"
import ReactDOM from "react-dom"

// -------------------------------------------------------------------
// 1. New Skills & Explanations
// -------------------------------------------------------------------
const SKILLS = [
  "Strategic Planning",
  "Spatial Thinking",
  "Pattern Recognition",
  "Theory of Mind",
  "Logical Reasoning",
  "Memory Recall",
  "Bluffing",
  "Persuasion",
  "Uncertainty Estimation",
  "Adaptability",
]

const SKILL_EXPLANATIONS: Record<string, string> = {
  "Strategic Planning": "Long-term planning and goal-oriented thinking",
  "Spatial Thinking": "Understanding and manipulating spatial relationships",
  "Pattern Recognition": "Identifying patterns in data and behavior",
  "Theory of Mind": "Understanding and predicting others' behavior",
  "Logical Reasoning": "Deductive reasoning and problem solving",
  "Memory Recall": "Remembering past information and experiences",
  Bluffing: "Strategic deception and misdirection",
  Persuasion: "Ability to influence decisions and outcomes",
  "Uncertainty Estimation": "Evaluating and acting under uncertain conditions",
  Adaptability: "Adjusting strategies in dynamic environments",
}

// -------------------------------------------------------------------
// 2. Type Definitions
// -------------------------------------------------------------------
interface ModelData {
  id: number
  model_name: string
  description?: string
  elo: number
  games_played: number
  win_rate: number
  wins: number
  draws: number
  losses: number
  avg_time: number
  elo_history: {
    interval_start: string
    avg_elo: number
  }[]
  environment_performance: {
    name: string
    elo: number
    games: number
    win_rate: number
    avg_move_time: number
    wins: number
    draws: number
    losses: number
    // New: up to 5 skill fields and their corresponding weights.
    skill_1?: string
    skill_1_weight?: number
    skill_2?: string
    skill_2_weight?: number
    skill_3?: string
    skill_3_weight?: number
    skill_4?: string
    skill_4_weight?: number
    skill_5?: string
    skill_5_weight?: number
  }[]
  recent_games: {
    game_id: number
    environment: string
    game_start_time: string
    opponent_name: string
    elo_change: number
    outcome: string
    reason: string
  }[]
}

interface ModelDetailsProps {
  modelName: string
}

// -------------------------------------------------------------------
// 3. Custom Tooltips
// -------------------------------------------------------------------
function CustomRadarTooltip({ active, payload, isMobile, containerRef }: any) {
  const rootRef = useRef<any>(null);

  // Desktop: Create stable root once on mount
  useEffect(() => {
    if (!isMobile && containerRef?.current && !rootRef.current) {
      rootRef.current = ReactDOM.createRoot(containerRef.current);
    }

    return () => {
      if (!isMobile && rootRef.current) {
        rootRef.current.unmount();
        rootRef.current = null;
      }
    };
  }, [containerRef, isMobile]);

  // Handle content updates
  useEffect(() => {
    if (!containerRef?.current) return;

    const renderContent = (root: any) => {
      if (active && payload && payload.length > 0) {
        const data = payload[0].payload;
        const sortedEnvs = [...data.envs].sort((a, b) => b.relativeWeight - a.relativeWeight);
        root.render(
          <div 
            className={`font-mono ${isMobile ? "p-0 text-[10px]" : "p-2 text-sm"} space-y-4`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Section with Flex Layout */}
            <div className="flex justify-between items-start">
              <div className="space-y-1 flex-1">
                <h3 className={`font-bold text-navbar-foreground tracking-wide ${isMobile ? "text-[10px]" : "text-lg"}`}>
                  {data.skill}
                </h3>
              </div>
              <div className={`text-navbar-foreground font-bold ${isMobile ? "text-[12px]" : "text-xl"} ml-4`}>
                {data.elo.toFixed(1)}
              </div>
            </div>

            <div>
              <p className={`text-navbar-foreground font-light ${isMobile ? "text-[8px]" : "text-xs"}`}>
                {SKILL_EXPLANATIONS[data.skill]}
              </p>
            </div>
            
            {/* Environments Section */}
            <div>
              <div className={`text-muted-foreground font-light mb-1.5 ${isMobile ? "text-[9px]" : "text-xs"}`}>
                Environments' Contribution
              </div>
              <ul className={`space-y-1 ${isMobile ? "text-[8px]" : "text-[10px]"}`}>
                {sortedEnvs.map((env: any, idx: number) => (
                  <li key={idx} className="flex justify-between items-baseline">
                    <div className="flex w-[150px] break-words">
                      <span className="text-navbar-foreground">{env.name.replace(/-/g, "\u200B-")}</span>
                    </div>
                    <div className="flex">
                      <span className="text-navbar-foreground font-medium">{(env.relativeWeight * 100).toFixed(1)}%</span>
                      <span className="text-muted-foreground ml-1 font-light">
                        (Elo: <span className="text-navbar-foreground">{env.elo.toFixed(1)}</span>)
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      } else {
        root.render(
          <div className={`font-mono text-muted-foreground ${isMobile ? "text-[10px]" : "text-sm"} ${isMobile ? "p-0" : "p-2"}`}>
            Click on the radar chart to see skill details
          </div>
        );
      }
    };

    if (isMobile) {
      const mobileRoot = ReactDOM.createRoot(containerRef.current);
      renderContent(mobileRoot);
      return () => {
        mobileRoot.unmount();
      };
    } else {
      renderContent(rootRef.current);
    }
  }, [active, payload, isMobile]);

  return null;
}

function CustomEnvTooltip({ active, payload, isMobile, containerRef }: any) {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload
    const content = (
      <div
        className={`bg-[hsl(var(--navbar))] rounded text-navbarForeground font-mono ${
          isMobile ? "p-1 text-[10px]" : "p-2 text-sm"
        }`}
      >
        <p className="font-bold m-0">{data.name}</p>
        <p className="m-0">Elo: {data.elo.toFixed(1)}</p>
        <p className="m-0">Win: {(data.win_rate * 100).toFixed(1)}%</p>
        <p className="m-0">
          W/D/L: {data.wins}/{data.draws}/{data.losses}
        </p>
        {!isMobile && (
          <>
            <p className="m-0">Games: {data.games}</p>
            <p className="m-0">Avg Time: {data.avg_move_time ? data.avg_move_time.toFixed(1) + "s" : "N/A"}</p>
          </>
        )}
      </div>
    )

    if (isMobile && containerRef?.current) {
      return ReactDOM.createPortal(content, containerRef.current)
    }

    return content
  }
  return null
}

function CustomEloTooltip({ active, payload, label, isMobile, containerRef }: any) {
  if (active && payload && payload.length > 0) {
    const content = (
      <div
        className={`bg-[hsl(var(--navbar))] rounded text-navbarForeground font-mono ${
          isMobile ? "p-1 text-[10px]" : "p-2 text-sm"
        }`}
      >
        <p className="font-bold m-0">
          {new Date(label).toLocaleString([], {
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="m-0">
            {entry.name}: {Math.round(entry.value)}
          </p>
        ))}
      </div>
    )

    if (isMobile && containerRef?.current) {
      return ReactDOM.createPortal(content, containerRef.current)
    }

    return content
  }
  return null
}

// -------------------------------------------------------------------
// 4. Build Skill Distribution (New Weighted Calculation Per Environment)
// -------------------------------------------------------------------
function buildSkillDistribution(environments: ModelData["environment_performance"]) {
  // For each allowed skill, we aggregate:
  // - weightedElo: Sum(env. elo * coefficient)
  // - totalWeight: Sum(coefficients) for that skill.
  // We also record each environment's contribution.
  type EnvContribution = { name: string; elo: number; weight: number }
  const agg: Record<string, { weightedElo: number; totalWeight: number; envs: EnvContribution[] }> = {}
  SKILLS.forEach((skill) => {
    agg[skill] = { weightedElo: 0, totalWeight: 0, envs: [] }
  })

  environments.forEach((env) => {
    // Loop through up to five possible skill fields.
    for (let i = 1; i <= 5; i++) {
      const skillKey = `skill_${i}` as keyof typeof env
      const weightKey = `skill_${i}_weight` as keyof typeof env
      const skillValue = env[skillKey] as string | undefined
      const rawWeight = env[weightKey]
      if (skillValue && rawWeight && Number(rawWeight) > 0) {
        // Optionally normalize variant names here.
        const normalizedSkill = skillValue
        if (SKILLS.includes(normalizedSkill)) {
          const weight = Number(rawWeight)
          agg[normalizedSkill].weightedElo += env.elo * weight
          agg[normalizedSkill].totalWeight += weight
          agg[normalizedSkill].envs.push({ name: env.name, elo: env.elo, weight })
        }
      }
    }
  })

  // Now compute each environment's relative weight (per skill).
  return SKILLS.map((skill) => {
    const { weightedElo, totalWeight, envs } = agg[skill]
    const envsWithRelative = envs.map((env) => ({
      name: env.name,
      elo: env.elo,
      weight: env.weight,
      relativeWeight: totalWeight > 0 ? env.weight / totalWeight : 0,
    }))
    return {
      skill,
      elo: totalWeight > 0 ? weightedElo / totalWeight : 0,
      totalWeight,
      envs: envsWithRelative,
    }
  })
}

const calculateDomain = (data: any[]) => {
  const values = data.map(item => item.elo);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  
  // Calculate range with ±10%
  const minRange = Math.floor(minValue -5);  // 10% below minimum
  const maxRange = Math.ceil(maxValue +5);   // 10% above maximum
  
  return [minRange, maxRange];
}

export function ModelDetails({ modelName }: ModelDetailsProps) {
  const router = useRouter()
  const [model, setModel] = useState<ModelData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMobile = useIsMobile()
  const eloTooltipContainerRef = useRef<HTMLDivElement>(null)
  const envTooltipContainerRef = useRef<HTMLDivElement>(null)
  const RadarTooltipContainerRef = useRef<HTMLDivElement>(null)
  const chartContainerRef = useRef(null);
  const [chartRadius, setChartRadius] = useState(isMobile ? 90 : 150);

  // Update radius based on container width - only for desktop
  useEffect(() => {
    const updateRadius = () => {
      if (!isMobile && chartContainerRef.current) {
        const containerWidth = chartContainerRef.current.offsetWidth;
        // Calculate radius as a proportion of container width for desktop only
        const newRadius = Math.min(containerWidth / 2, 150);
        setChartRadius(newRadius);
      }
    };

    // Initial calculation
    updateRadius();

    // Update on window resize - only if not mobile
    if (!isMobile) {
      window.addEventListener('resize', updateRadius);
      return () => window.removeEventListener('resize', updateRadius);
    }
  }, [isMobile]);

  useEffect(() => {
    fetchModelDetails()
  }, [])

  async function fetchModelDetails() {
    try {
      setError(null)
      setLoading(true)
      console.log("Fetching details for model:", modelName)
      const { data, error } = await supabase.rpc("get_model_details_by_name_v2", {
        model_name_param: modelName,
      })

      if (error) {
        console.error("Database error:", error)
        throw error
      }
      if (!data || data.length === 0) {
        setModel(null)
        return
      }

      // Process the data as before
      const uniqueEnvs: Record<string, any> = {}
      ;(data[0].environment_performance || []).forEach((env: any) => {
        const key = env.name || env.env_name || "Unknown"
        if (!uniqueEnvs[key] || env.games > uniqueEnvs[key].games) {
          uniqueEnvs[key] = env
        }
      })
      const dedupedEnvs = Object.values(uniqueEnvs)

      const rawModel = data[0]
      const processedModel: ModelData = {
        model_name: rawModel.model_name,
        description: rawModel.description,
        elo: rawModel.elo,
        games_played: rawModel.games_played,
        win_rate: rawModel.win_rate,
        wins: rawModel.wins,
        draws: rawModel.draws,
        losses: rawModel.losses,
        avg_time: rawModel.avg_time,
        elo_history: rawModel.elo_history,
        environment_performance: dedupedEnvs,
        recent_games: rawModel.recent_games,
        id: rawModel.id,
      }

      setModel(processedModel)
    } catch (err) {
      console.error("Error fetching model:", err)
      setError("Could not load model details.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading model data...</h2>
          <p className="text-gray-500">Please wait while we fetch the details.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <Button onClick={() => router.push("/leaderboard")}>Return to Leaderboard</Button>
        </div>
      </div>
    )
  }

  if (!model) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Model not found</h2>
          <p className="text-gray-500 mb-4">The requested model could not be found in our database.</p>
          <Button onClick={() => router.push("/leaderboard")}>Return to Leaderboard</Button>
        </div>
      </div>
    )
  }

  const averageEnvElo =
    model.environment_performance.length > 0
      ? model.environment_performance.reduce((sum, env) => sum + env.elo, 0) / model.environment_performance.length
      : model.elo

  const skillData = buildSkillDistribution(model.environment_performance)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/leaderboard")}
          className="bg-[hsl(var(--navbar-foreground))] bg-opacity-10 hover:bg-opacity-20 text-[hsl(var(--navbar))] border border-[hsl(var(--navbar))] px-4 py-2 rounded-md transition-colors font-mono"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Leaderboard
        </Button>
      </div>

      {/* Header Row: Model Name and Elo on the same line */}
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <h1
            className={`font-bold font-mono text-navbarForeground line-clamp-2 leading-tight ${isMobile ? "text-xl" : "text-4xl"}`}
          >
            {model.model_name}
          </h1>
        </div>
        <div
          className={`flex-shrink-0 font-bold font-mono text-navbarForeground ${isMobile ? "text-3xl" : "text-5xl"}`}
        >
          {Math.round(averageEnvElo)}
        </div>
      </div>

      <p className={`text-mutedForeground font-mono mb-8 ${isMobile ? "text-xs" : "text-lg"}`}>{model.description}</p>

      {/* Top Row: Overall Statistics & Elo History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Overall Statistics */}
        <Card className="bg-[hsl(var(--navbar))] border-2 border-[hsl(var(--border))]">
          <CardHeader>
            <CardTitle className={`font-mono ${isMobile ? "text-lg" : "text-2xl"} font-semibold text-navbarForeground`}>
              Overall Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`grid grid-cols-2 gap-2 sm:gap-4 font-mono ${isMobile ? "" : "text-base"}`}>
              <div>
                <div className={`${isMobile ? "text-xs" : ""} text-muted-foreground`}>Avg. Time/Move</div>
                <div className={`${isMobile ? "text-sm" : ""} text-navbarForeground`}>{model.avg_time.toFixed(1)}s</div>
              </div>
              <div>
                <div className={`${isMobile ? "text-xs" : ""} text-muted-foreground`}>Games Played</div>
                <div className={`${isMobile ? "text-sm" : ""} text-navbarForeground`}>
                  {model.games_played.toLocaleString()}
                </div>
              </div>
              <div>
                <div className={`${isMobile ? "text-xs" : ""} text-muted-foreground`}>Win Rate</div>
                <div className={`${isMobile ? "text-sm" : ""} text-navbarForeground`}>
                  {(model.win_rate * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <div className={`${isMobile ? "text-xs" : ""} text-muted-foreground`}>W/D/L</div>
                <div className={`${isMobile ? "text-sm" : ""}`}>
                  <span className="text-green-400">{model.wins}</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-gray-400">{model.draws}</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-red-400">{model.losses}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Elo History */}
        <Card className="bg-[hsl(var(--navbar))] border-2 border-[hsl(var(--border))]">
          <CardHeader>
            <CardTitle className={`font-mono ${isMobile ? "text-lg" : "text-2xl"} font-semibold text-navbarForeground`}>
              Elo History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {isMobile && (
                <div
                  ref={eloTooltipContainerRef}
                  className="absolute top-0 left-0 right-0 z-10 flex justify-center items-center h-[20px] bg-[hsl(var(--navbar))] bg-opacity-95 transition-all duration-200 p-1"
                ></div>
              )}
              <div className={isMobile ? "overflow-x-auto" : ""}>
                <div style={{ width: isMobile ? Math.max(400, model.elo_history.length * 25) : "100%", height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={model.elo_history} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="interval_start"
                        stroke="white"
                        tickFormatter={(tick) =>
                          new Date(tick).toLocaleString([], {
                            month: "numeric",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })
                        }
                        tick={{
                          fill: "white",
                          angle: -45,
                          textAnchor: "end",
                          fontSize: isMobile ? 10 : 12,
                          fontFamily: "var(--font-mono)",
                        }}
                        axisLine={{ stroke: "white" }}
                      />
                      <YAxis
                        stroke="white"
                        domain={[
                          (dataMin) => Math.floor(dataMin / 100) * 100 - 20,
                          (dataMax) => Math.ceil(dataMax / 100) * 100 + 20,
                        ]}
                        tick={{ fill: "white", fontSize: 12, fontFamily: "var(--font-mono)" }}
                        axisLine={{ stroke: "white" }}
                        tickCount={7}
                      />
                      <Tooltip
                        content={
                          <CustomEloTooltip
                            isMobile={isMobile}
                            containerRef={isMobile ? eloTooltipContainerRef : null}
                          />
                        }
                        position={isMobile ? { x: 0, y: 0 } : undefined}
                      />
                      <Legend
                        align="center"
                        verticalAlign="top"
                        wrapperStyle={{ color: "white", fontFamily: "var(--font-mono)" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="avg_elo"
                        name="Elo Rating"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            {isMobile && (
              <div className="text-xs text-muted-foreground font-mono mt-2 text-right">Scroll to see more →</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Environment Performance */}
      <div className="mb-8">
        <Card className="bg-[hsl(var(--navbar))] border-2 border-[hsl(var(--border))]">
          <CardHeader>
            <CardTitle className={`font-mono ${isMobile ? "text-lg" : "text-2xl"} font-semibold text-navbarForeground`}>
              Performance by Environment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {isMobile && (
                <div
                  ref={envTooltipContainerRef}
                  className="absolute top-0 left-0 right-0 z-10 flex justify-center items-center h-[25px] bg-[hsl(var(--navbar))] bg-opacity-95 transition-all duration-200 p-1"
                ></div>
              )}
              <div className={isMobile ? "overflow-x-auto" : ""}>
                <div
                  style={{
                    width: isMobile ? Math.max(400, model.environment_performance.length * 60) : "100%",
                    height: 400,
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={model.environment_performance}
                      margin={{ top: 20, right: 30, left: 20, bottom: 90 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        tick={{
                          angle: -45,
                          textAnchor: "end",
                          fill: "white",
                          fontSize: isMobile ? 10 : 12,
                          fontFamily: "var(--font-mono)",
                        }}
                        axisLine={{ stroke: "white" }}
                        interval={0}
                      />
                      <YAxis
                        yAxisId="left"
                        orientation="left"
                        stroke="white"
                        tick={{ fill: "white", fontSize: 12, fontFamily: "var(--font-mono)" }}
                        axisLine={{ stroke: "white" }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="white"
                        tick={{ fill: "white", fontSize: 12, fontFamily: "var(--font-mono)" }}
                        axisLine={{ stroke: "white" }}
                        tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                      />
                      <Tooltip
                        content={
                          <CustomEnvTooltip
                            isMobile={isMobile}
                            containerRef={isMobile ? envTooltipContainerRef : null}
                          />
                        }
                        position={isMobile ? { x: 0, y: 0 } : undefined}
                      />
                      <Legend
                        align="center"
                        verticalAlign="top"
                        wrapperStyle={{ color: "white", fontFamily: "var(--font-mono)" }}
                      />
                      <Bar yAxisId="left" dataKey="elo" fill="#8884d8" name="Elo" />
                      <Bar yAxisId="right" dataKey="win_rate" fill="#82ca9d" name="Win Rate" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            {isMobile && (
              <div className="text-xs text-muted-foreground font-mono mt-2 text-right">Scroll to see more →</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Skill Distribution */}
      <div className="mb-8">
        <Card className="bg-[hsl(var(--navbar))] border-2 border-[hsl(var(--border))]">
          <CardHeader>
            <CardTitle className={`font-mono ${isMobile ? "text-lg" : "text-2xl"} font-semibold text-navbarForeground`}>
              Skill Distribution
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="relative z-0">
              {isMobile && (
                <div
                  ref={RadarTooltipContainerRef}
                  className="absolute top-0 left-0 right-0 z-50 flex justify-center items-start h-[120px] bg-[hsl(var(--navbar))] bg-opacity-95 transition-all duration-200 py-2 px-4 overflow-y-auto pointer-events-auto border border-[hsl(var(--border))] rounded-lg"
                ></div>
              )}
              <div className={`flex ${isMobile ? "block" : "gap-4"}`}>
                {/* Tooltip Container for Desktop */}
                {!isMobile && (
                  <div 
                    ref={RadarTooltipContainerRef}
                    className="w-1/3 h-[400px] bg-[hsl(var(--navbar))] border border-[hsl(var(--border))] rounded-lg p-2 overflow-y-auto"
                  ></div>
                )}
                
                {/* Radar Chart Container */}
                <div 
                  ref={chartContainerRef}
                  className={isMobile ? "overflow-x-auto" : "flex-1"}
                >
                  <div 
                    style={{ 
                      width: isMobile ? "400px" : "100%", 
                      height: 400, 
                      paddingTop: isMobile ? "150px" : 0,
                      margin: "0 auto"
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart 
                        data={skillData}
                        margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
                        outerRadius={isMobile ? 90 : chartRadius} // Fixed radius for mobile, dynamic for desktop
                      >
                        <PolarGrid 
                          stroke="white"
                          radialLines={true}
                        />
                        <PolarAngleAxis
                          dataKey="skill"
                          tick={{ 
                            fill: "white", 
                            fontSize: isMobile ? 8 : 10,
                            fontFamily: "var(--font-mono)",
                            dy: 6,
                            width: 60,
                            lineHeight: "1.2em"
                          }}
                          radius={isMobile ? 90 : chartRadius} // Fixed radius for mobile, dynamic for desktop
                          tickFormatter={(value) => {
                            const breakPoints = {
                              "Uncertainty Estimation": "Uncertainty\nEstimation",
                              "Logical Reasoning": "Logical\nReasoning",
                              "Memory Recall": "Memory\nRecall",
                              "Pattern Recognition": "Pattern\nRecognition",
                              "Spatial Thinking": "Spatial\nThinking",
                              "Strategic Planning": "Strategic\nPlanning"
                            };
                            return breakPoints[value] || value;
                          }}
                        />
                        <PolarRadiusAxis
                          domain={calculateDomain(skillData)} 
                          axisLine={false}
                          tick={false}
                          angle={90}
                        />
                        <Tooltip
                          content={
                            <CustomRadarTooltip
                              isMobile={isMobile}
                              containerRef={RadarTooltipContainerRef}
                            />
                          }
                          trigger="click"
                        />
                        <Radar 
                          name="Skill Level" 
                          dataKey="elo" 
                          stroke="#8884d8" 
                          fill="#8884d8" 
                          fillOpacity={0.6}
                          className="cursor-pointer"
                          radiusScale={0.75}
                          activeDot={{
                            r: isMobile ? 4 : 6,
                            stroke: "white",
                            strokeWidth: 2,
                            fill: "#8884d8",
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              {isMobile && (
                <div className="text-xs text-muted-foreground font-mono mt-2 text-right">
                  Scroll to see more →
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Games */}
      <div className="mb-8">
        <Card className="bg-[hsl(var(--navbar))] border-2 border-[hsl(var(--border))]">
          <CardHeader>
            <CardTitle className={`font-mono ${isMobile ? "text-lg" : "text-2xl"} font-semibold text-navbarForeground`}>
              Recent Games
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className={`font-mono ${isMobile ? "text-[10px]" : "text-base"}`}>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Environment</TableHead>
                    <TableHead>Opponent</TableHead>
                    <TableHead className="text-right">Elo Change</TableHead>
                    <TableHead>Outcome</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {model.recent_games.map((game) => (
                    <TableRow key={game.game_id}>
                      <TableCell className="text-navbarForeground">
                        {new Date(game.game_start_time).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-navbarForeground">{game.environment}</TableCell>
                      <TableCell className="text-navbarForeground">{game.opponent_name}</TableCell>
                      <TableCell
                        className={`text-right ${
                          game.elo_change > 0
                            ? "text-green-500"
                            : game.elo_change < 0
                              ? "text-red-500"
                              : "text-gray-500"
                        }`}
                      >
                        {game.elo_change > 0 ? "+" : ""}
                        {Math.round(game.elo_change)}
                      </TableCell>
                      <TableCell
                        className={
                          game.outcome === "win"
                            ? "text-green-500"
                            : game.outcome === "loss"
                              ? "text-red-500"
                              : "text-gray-500"
                        }
                      >
                        {game.outcome ? game.outcome.charAt(0).toUpperCase() + game.outcome.slice(1) : "Unknown"}
                      </TableCell>
                      <TableCell className="text-navbarForeground">{game.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

