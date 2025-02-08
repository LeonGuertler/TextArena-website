"use client"
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"
import { supabase } from "@/lib/supabase"

// Example subset definitions
const envSubsets: Record<string, string[]> = {
  BalancedSubset: [
    "Chess-v0",
    "DontSayIt-v0",
    "LiarsDice-v0",
    "Negotiation-v0",
    "Poker-v0",
    "SpellingBee-v0",
    "Stratego-v0",
    "Tak-v0",
    "TruthAndDeception-v0",
    "UltimateTicTacToe-v0",
  ],
  Chess: ["Chess-v0"],
  ConnectFour: ["ConnectFour-v0"],
  Debate: ["Debate-v0"],
  DontSayIt: ["DontSayIt-v0"],
  Battleship: ["Battleship-v0"],
  LiarsDice: ["LiarsDice-v0"],
  Mastermind: ["Mastermind-v0"],
  Negotiation: ["Negotiation-v0"],
  Poker: ["Poker-v0"],
  SpellingBee: ["SpellingBee-v0"],
  SpiteAndMalice: ["SpiteAndMalice-v0"],
  Stratego: ["Stratego-v0"],
  Tak: ["Tak-v0"],
  TruthAndDeception: ["TruthAndDeception-v0"],
  UltimateTicTacToe: ["UltimateTicTacToe-v0"],
  WordChains: ["WordChains-v0"],
}

interface ModelData {
  model_name: string
  elo: number
  games_played: number
  win_rate: number
  wins: number
  draws: number
  losses: number
  avg_time: number
}

interface EloHistoryRow {
  model_id: number
  model_name: string
  interval_start: string // timestamp as string
  elo_map: Record<string, number>
}

// Custom tooltip for the Elo History chart
function CustomHistoryTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length > 0) {
    const formattedTime = new Date(label).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
    return (
      <div
        style={{
          backgroundColor: "black",
          padding: "10px",
          borderRadius: "4px",
          color: "white",
        }}
      >
        <p className="font-bold">{formattedTime}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {Math.round(entry.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function Leaderboard() {
  const [selectedSubset, setSelectedSubset] = useState<string>("BalancedSubset")
  const [currentPage, setCurrentPage] = useState(1)
  const [environments, setEnvironments] = useState<{ id: number; env_name: string }[]>([])
  const [models, setModels] = useState<ModelData[]>([])
  const [eloHistory, setEloHistory] = useState<EloHistoryRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredModel, setHoveredModel] = useState<string | null>(null)

  const itemsPerPage = 10

  useEffect(() => {
    fetchEnvironments()
  }, [])

  useEffect(() => {
    if (selectedSubset !== "BalancedSubset" && environments.length === 0) return
    fetchModels()
  }, [selectedSubset, currentPage, environments])

  // Re-fetch Elo history whenever the selected subset changes.
  useEffect(() => {
    fetchEloHistory()
  }, [selectedSubset])

  async function fetchEnvironments() {
    try {
      setError(null)
      const { data, error } = await supabase
        .from("environments")
        .select("id, env_name")
        .eq("active", true)
        .order("env_name")
      if (error) throw error
      // Prepend a special "All" option.
      setEnvironments([{ id: -1, env_name: "All" }, ...(data ?? [])])
    } catch (err) {
      console.error("Error fetching environments:", err)
      setError("Failed to load environments")
    }
  }

  async function fetchModels() {
    setIsLoading(true)
    setError(null)
    try {
      let subsetEnvIds: number[] | null = null
      if (selectedSubset !== "All") {
        const subsetNames = envSubsets[selectedSubset] || []
        if (subsetNames.length > 0) {
          const { data: envData, error: envError } = await supabase
            .from("environments")
            .select("id")
            .in("env_name", subsetNames)
          if (envError) throw envError
          subsetEnvIds = (envData ?? []).map((env: any) => env.id)
        }
      }
      console.log("subsetEnvIds:", subsetEnvIds)
      const { data, error } = await supabase.rpc("get_leaderboard", {
        subset_env_ids: subsetEnvIds,
      })
      console.log("RPC Data (get_leaderboard):", data)
      if (error) throw error
      if (!data) {
        setModels([])
        setIsLoading(false)
        return
      }
      setModels(data)
    } catch (err) {
      console.error("Error fetching models:", err)
      setError("Failed to load models")
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchEloHistory() {
    setIsLoadingHistory(true)
    try {
      console.log("Fetching Elo History pivot data...")
      const { data, error } = await supabase.rpc("get_elo_history_pivot")
      console.log("RPC Data (get_elo_history_pivot):", data)
      if (error) throw error
      setEloHistory(data || [])
    } catch (err) {
      console.error("Error fetching elo history:", err)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const paginatedModels = models.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Compute chart data:
  const chartData = useMemo(() => {
    if (!eloHistory || eloHistory.length === 0) return []
    const grouped: Record<string, any> = {}
    // Determine selected environment names:
    const selectedEnvNames =
      selectedSubset === "All"
        ? environments.filter((env) => env.id !== -1).map((env) => env.env_name)
        : envSubsets[selectedSubset] || []
    // Also, collect model names from eloHistory:
    const modelNamesSet = new Set<string>()
    eloHistory.forEach((row) => modelNamesSet.add(row.model_name))
    const modelNames = Array.from(modelNamesSet)
    // Group rows by interval_start (as ISO string)
    eloHistory.forEach((row) => {
      const date = new Date(row.interval_start).toISOString()
      if (!grouped[date]) {
        grouped[date] = { date }
      }
      const eloMap = row.elo_map || {}
      // Average Elo over selected environments:
      const keys = Object.keys(eloMap).filter((key) => selectedEnvNames.includes(key))
      let avg = 1000
      if (keys.length > 0) {
        avg = keys.reduce((sum, key) => sum + Number(eloMap[key]), 0) / keys.length
      }
      grouped[date][row.model_name] = avg
    })
    const sortedData = Object.values(grouped).sort(
      (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    // Carry-forward missing values for each model:
    modelNames.forEach((modelName) => {
      let lastValue: number | undefined = undefined
      sortedData.forEach((row: any) => {
        if (row[modelName] === undefined) {
          row[modelName] = lastValue !== undefined ? lastValue : 1000
        } else {
          lastValue = row[modelName]
        }
      })
    })
    return sortedData
  }, [eloHistory, selectedSubset, environments])

  // Compute model names for the chart from eloHistory safely.
  const chartModelNames = useMemo(() => {
    if (!eloHistory) return []
    const names = new Set<string>()
    eloHistory.forEach((row) => names.add(row.model_name))
    return Array.from(names)
  }, [eloHistory])

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-3xl font-bold">AI Model Leaderboard</CardTitle>
        <Select
          onValueChange={(value) => {
            setSelectedSubset(value)
            setCurrentPage(1)
          }}
          value={selectedSubset}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select subset" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(envSubsets).map((subset) => (
              <SelectItem key={subset} value={subset}>
                {subset}
              </SelectItem>
            ))}
            <SelectItem value="All">All</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Leaderboard Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Rank</TableHead>
                <TableHead>Model</TableHead>
                <TableHead className="text-right">Elo</TableHead>
                <TableHead className="text-right">Games</TableHead>
                <TableHead className="text-right">Win Rate</TableHead>
                <TableHead className="text-center">W/D/L</TableHead>
                <TableHead className="text-right">Avg. Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-red-500">
                    {error}
                    <Button onClick={fetchModels} className="ml-2">
                      Retry
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedModels.map((model, index) => (
                  <TableRow
                    key={model.model_name}
                    onMouseEnter={() => setHoveredModel(model.model_name)}
                    onMouseLeave={() => setHoveredModel(null)}
                  >
                    <TableCell className="font-medium">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell>
                    <Link
                      href={`/leaderboard/${encodeURIComponent(model.model_name)}`}
                      className="text-muted-foreground hover:underline"
                    >
                      {model.model_name}
                    </Link>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {Math.round(model.elo)}
                    </TableCell>
                    <TableCell className="text-right">
                      {model.games_played.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {(model.win_rate * 100).toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-green-600">{model.wins}</span>/
                      <span className="text-gray-600">{model.draws}</span>/
                      <span className="text-red-600">{model.losses}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      {model.avg_time.toFixed(1)}s
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex justify-between items-center">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {Math.ceil(models.length / itemsPerPage) || 1}
            </span>
            <Button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={paginatedModels.length < itemsPerPage}
            >
              Next
            </Button>
          </div>

          {/* Elo History Chart */}
          <div>
            <h3 className="text-xl font-bold mb-2">Elo History</h3>
            {isLoadingHistory ? (
              <p>Loading elo history...</p>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis
                    dataKey="date"
                    stroke="#333"
                    tickFormatter={(tick) => {
                      const d = new Date(tick)
                      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    }}
                    tick={{ angle: -45, textAnchor: "end" }}
                    interval={0}
                  />
                  <YAxis stroke="#333" domain={["auto", "auto"]} />
                  <Tooltip content={<CustomHistoryTooltip />} />
                  {chartModelNames.map((name, idx) => (
                    <Line
                      key={name}
                      type="monotone"
                      dataKey={name}
                      name={name}
                      stroke={`hsl(${(idx * 360) / chartModelNames.length}, 70%, 50%)`}
                      strokeWidth={hoveredModel === name ? 4 : 2}
                      dot={{ r: 4 }}
                      opacity={hoveredModel && hoveredModel !== name ? 0.3 : 1}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
