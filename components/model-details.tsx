"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  PolarRadiusAxis
} from "recharts"
import { supabase } from "@/lib/supabase"

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
  "Adaptability"
]

const SKILL_EXPLANATIONS: Record<string, string> = {
  "Strategic Planning": "Long-term planning and goal-oriented thinking",
  "Spatial Thinking": "Understanding and manipulating spatial relationships",
  "Pattern Recognition": "Identifying patterns in data and behavior",
  "Theory of Mind": "Understanding and predicting others' behavior",
  "Logical Reasoning": "Deductive reasoning and problem solving",
  "Memory Recall": "Remembering past information and experiences",
  "Bluffing": "Strategic deception and misdirection",
  "Persuasion": "Ability to influence decisions and outcomes",
  "Uncertainty Estimation": "Evaluating and acting under uncertain conditions",
  "Adaptability": "Adjusting strategies in dynamic environments"
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
function CustomRadarTooltip({ active, payload }: any) {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload
    return (
      <div className="bg-[hsl(var(--navbar))] p-2 rounded text-navbarForeground font-mono">
        <p className="font-bold m-0">{data.skill}</p>
        <p className="mt-1 mb-0 text-xs">Average Elo: {data.elo.toFixed(1)}</p>
        <p className="mt-1 mb-0 text-xs">
          Environments' Contribution:
        </p>
        {data.envs && data.envs.length > 0 && (
          <ul className="list-disc list-inside text-xs">
            {data.envs.map((env: any, idx: number) => (
              <li key={idx}>
                {env.name}: {(env.relativeWeight * 100).toFixed(1)}% (Elo: {env.elo.toFixed(1)})
              </li>
            ))}
          </ul>
        )}
        <p className="mt-1 mb-0 text-xs">{SKILL_EXPLANATIONS[data.skill]}</p>
      </div>
    )
  }
  return null;
}

function CustomEnvTooltip({ active, payload }: any) {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload
    return (
      <div className="bg-[hsl(var(--navbar))] p-2 rounded text-navbarForeground font-mono">
        <p className="font-bold">{data.name}</p>
        <p>Elo: {data.elo.toFixed(1)}</p>
        <p>Win Rate: {(data.win_rate * 100).toFixed(1)}%</p>
        <p>Games: {data.games}</p>
        <p>
          W/D/L: {data.wins}/{data.draws}/{data.losses}
        </p>
        <p>
          Avg. Move Time:{" "}
          {data.avg_move_time ? data.avg_move_time.toFixed(1) + "s" : "N/A"}
        </p>
      </div>
    )
  }
  return null;
}

function CustomEloTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length > 0) {
    return (
      <div className="bg-[hsl(var(--navbar))] p-2 rounded text-navbarForeground font-mono">
        <p className="font-bold">{new Date(label).toLocaleString()}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index}>
            {entry.name}: {Math.round(entry.value)}
          </p>
        ))}
      </div>
    )
  }
  return null;
}

// -------------------------------------------------------------------
// 4. Build Skill Distribution (New Weighted Calculation Per Environment)
// -------------------------------------------------------------------
function buildSkillDistribution(
  environments: ModelData["environment_performance"]
) {
  // For each allowed skill, we aggregate:
  // - weightedElo: Sum(env. elo * coefficient)
  // - totalWeight: Sum(coefficients) for that skill.
  // We also record each environment's contribution.
  type EnvContribution = { name: string; elo: number; weight: number }
  const agg: Record<
    string,
    { weightedElo: number; totalWeight: number; envs: EnvContribution[] }
  > = {}
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

// -------------------------------------------------------------------
// 5. ModelDetails Component
// -------------------------------------------------------------------
export function ModelDetails({ modelName }: ModelDetailsProps) {
  const router = useRouter()
  const [model, setModel] = useState<ModelData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchModelDetails()
  }, [modelName])

  useEffect(() => {
    if (model) {
      console.log("Environment performance data:", model.environment_performance)
      const skillData = buildSkillDistribution(model.environment_performance)
      console.log("Computed skill distribution:", skillData)
    }
  }, [model])

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

      // Deduplicate environment performance data.
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
        id: rawModel.id,
        model_name: rawModel.model_name,
        description: rawModel.description || "No description available",
        elo: Number(rawModel.elo) || 1000,
        games_played: Number(rawModel.games_played) || 0,
        win_rate: Number(rawModel.win_rate) || 0,
        wins: Number(rawModel.wins) || 0,
        draws: Number(rawModel.draws) || 0,
        losses: Number(rawModel.losses) || 0,
        avg_time: Number(rawModel.avg_time) || 0,
        elo_history: (rawModel.elo_history || []).map((h: any) => ({
          interval_start: new Date(h.interval_start).toISOString(),
          avg_elo: h.avg_elo || 0,
        })),
        environment_performance: dedupedEnvs.map((env: any) => ({
          name: env.name || env.env_name || "Unknown",
          elo: Number(env.elo) || 1000,
          games: Number(env.games) || 0,
          win_rate: Number(env.win_rate) || 0,
          // Expect up to 5 skill fields and their weights.
          skill_1: env.skill_1,
          skill_1_weight: env.skill_1_weight,
          skill_2: env.skill_2,
          skill_2_weight: env.skill_2_weight,
          skill_3: env.skill_3,
          skill_3_weight: env.skill_3_weight,
          skill_4: env.skill_4,
          skill_4_weight: env.skill_4_weight,
          skill_5: env.skill_5,
          skill_5_weight: env.skill_5_weight,
          avg_move_time: Number(env.avg_move_time) || 0,
          wins: Number(env.wins) || 0,
          draws: Number(env.draws) || 0,
          losses: Number(env.losses) || 0,
        })),
        recent_games: (rawModel.recent_games || [])
          .map((game: any) => ({
            game_id: game.game_id,
            environment: game.environment || "Unknown",
            game_start_time: game.game_start_time,
            opponent_name: game.opponent_name || "Unknown",
            elo_change: Number(game.elo_change) || 0,
            outcome: (game.outcome || "unknown").toLowerCase(),
            reason: game.reason || "N/A",
          }))
          .filter((g: any) => g.outcome !== "unknown"),
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
          <Button onClick={() => router.push("/leaderboard")}>
            Return to Leaderboard
          </Button>
        </div>
      </div>
    )
  }

  if (!model) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Model not found</h2>
          <p className="text-gray-500 mb-4">
            The requested model could not be found in our database.
          </p>
          <Button onClick={() => router.push("/leaderboard")}>
            Return to Leaderboard
          </Button>
        </div>
      </div>
    )
  }

  // Calculate the average Elo from all environments.
  const averageEnvElo =
    model.environment_performance.length > 0
      ? model.environment_performance.reduce((sum, env) => sum + env.elo, 0) /
        model.environment_performance.length
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold font-mono text-navbarForeground">{model.model_name}</h1>
        <div className="text-5xl font-bold font-mono text-navbarForeground">{Math.round(averageEnvElo)}</div>
      </div>

      <p className="text-mutedForeground font-mono mb-8">{model.description}</p>

      {/* Top Row: Overall Statistics & Elo History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Overall Statistics */}
        <Card className="bg-[hsl(var(--navbar))] border-2 border-[hsl(var(--border))]">
          <CardHeader>
            <CardTitle className="font-mono">Overall Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-navbarForeground">Games Played:</span>
                <span className="text-navbarForeground">{model.games_played}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium font-mono text-navbarForeground">Win Rate:</span>
                <span className="font-mono text-navbarForeground">{(model.win_rate * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium font-mono text-navbarForeground">W/D/L:</span>
                <span>
                  <span className="text-green-500 font-mono">{model.wins}</span>/
                  <span className="text-gray-500 font-mono">{model.draws}</span>/
                  <span className="text-red-500 font-mono">{model.losses}</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium font-mono text-navbarForeground">Avg. Time/Move:</span>
                <span className="font-mono text-navbarForeground">{model.avg_time.toFixed(1)}s</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Elo History */}
        <Card className="bg-[hsl(var(--navbar))] border-2 border-[hsl(var(--border))]">
          <CardHeader>
            <CardTitle className="font-mono">Elo History</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={model.elo_history} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="interval_start"
                  stroke="white"
                  tickFormatter={(tick) => new Date(tick).toLocaleTimeString()}
                  tick={{ fill: "white", fontSize: 12, angle: -45, textAnchor: "end", fontFamily: "var(--font-mono)" }}
                  axisLine={{ stroke: "white" }}
                />
                <YAxis
                  stroke="white"
                  domain={[(dataMin) => Math.floor(dataMin/100)*100 - 20, (dataMax) => Math.ceil(dataMax/100)*100 + 20]}
                  tick={{ fill: "white", fontSize: 12, fontFamily: "var(--font-mono)" }}
                  axisLine={{ stroke: "white" }}
                  tickCount={7}
                />
                <Tooltip content={<CustomEloTooltip />} />
                <Legend align="center" verticalAlign="top" wrapperStyle={{ color: "white", fontFamily: "var(--font-mono)" }} />
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
          </CardContent>
        </Card>
      </div>

      {/* Environment Performance */}
      <div className="mb-8">
        <Card className="bg-[hsl(var(--navbar))] border-2 border-[hsl(var(--border))]">
          <CardHeader>
            <CardTitle className="font-mono">Performance by Environment</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={model.environment_performance} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ angle: -45, textAnchor: "end", fill: "white", fontSize: 12, fontFamily: "var(--font-mono)" }}
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
                <Tooltip content={<CustomEnvTooltip />} />
                <Legend align="center" verticalAlign="top" wrapperStyle={{ color: "white", fontFamily: "var(--font-mono)" }} />
                <Bar yAxisId="left" dataKey="elo" fill="#8884d8" name="Elo" />
                <Bar yAxisId="right" dataKey="win_rate" fill="#82ca9d" name="Win Rate" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Skill Distribution */}
      <div className="mb-8">
        <Card className="bg-[hsl(var(--navbar))] border-2 border-[hsl(var(--border))]">
          <CardHeader>
            <CardTitle className="font-mono">Skill Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={skillData}>
                <PolarGrid stroke="white" />
                <PolarAngleAxis
                  dataKey="skill"
                  tick={{ fill: "white", fontSize: 12, fontFamily: "var(--font-mono)" }}
                />
                {/* <PolarRadiusAxis domain={[500, 1500]} hide tick={false} axisLine={false} /> */}
                {/* <PolarRadiusAxis hide tick={false} axisLine={false} /> */}
                {/* <PolarRadiusAxis domain={[880, 970]} hide tick={false} axisLine={false} /> */}
                <PolarRadiusAxis 
                  domain={calculateDomain(skillData)} 
                  hide 
                  tick={false} 
                  axisLine={false} 
                />
                <Tooltip content={<CustomRadarTooltip />} />
                <Radar
                  name="Skill Level"
                  dataKey="elo"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Games */}
      <div className="mb-8">
        <Card className="bg-[hsl(var(--navbar))] border-2 border-[hsl(var(--border))]">
          <CardHeader>
            <CardTitle className="font-mono">Recent Games</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="font-mono">
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
                      <TableCell className="text-navbarForeground">{new Date(game.game_start_time).toLocaleString()}</TableCell>
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
