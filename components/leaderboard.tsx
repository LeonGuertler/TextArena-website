"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { supabase } from "@/lib/supabase"
import { LeaderboardCard } from "@/components/leaderboard-card"
import { useIsMobile } from "@/hooks/use-mobile"
import { Filter, Info } from "lucide-react"
import ReactDOM from "react-dom"

const CHART_COLORS = [
  "#06b6d4",
  "#22c55e",
  "#eab308",
  "#ec4899",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
  "#06d6a0",
  "#6366f1",
  "#f43f5e",
]

const envSubsets: Record<string, string[]> = {
  // BalancedSubset: [
  //   "Chess-v0",
  //   "DontSayIt-v0",
  //   "LiarsDice-v0",
  //   "Negotiation-v0",
  //   "Poker-v0",
  //   "SpellingBee-v0",
  //   "Stratego-v0",
  //   "Tak-v0",
  //   "TruthAndDeception-v0",
  //   "UltimateTicTacToe-v0",
  // ],
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
  model_id: number
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
  interval_start: string
  elo_value: number
}

function CustomHistoryTooltip({ active, payload, label, isMobile, containerRef }: any) {
  if (active && payload && payload.length > 0) {
    const formattedTime = new Date(label).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    const sortedPayload = [...payload].sort((a, b) => b.value - a.value)

    const tooltipContent = (
      <div
        className={`${
          isMobile
            ? "bg-background p-1.5 rounded-lg border border-navbar font-mono text-xs shadow-lg"
            : "bg-[hsl(var(--navbar))] p-2 rounded text-navbarForeground font-mono text-xs"
        }`}
      >
        <p className="font-bold text-white mb-0.5">{formattedTime}</p>
        {sortedPayload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.stroke }} className="m-0 leading-tight">
            {entry.name}: {Math.round(entry.value)}
          </p>
        ))}
      </div>
    )

    // Only use portal for mobile
    if (isMobile && containerRef?.current) {
      return ReactDOM.createPortal(tooltipContent, containerRef.current)
    }

    return tooltipContent
  }
  return null
}

function EloHistoryChart({
  data,
  modelNames,
  hoveredModel,
  isMobile,
}: {
  data: any[]
  modelNames: string[]
  hoveredModel: string | null
  isMobile: boolean
}) {
  const [selectedPoint, setSelectedPoint] = useState<{ date: string; values: any[] } | null>(null)
  const tooltipContainerRef = useRef<HTMLDivElement>(null)

  // Calculate chart dimensions
  const chartWidth = isMobile ? data.length * 50 : "100%"
  const chartHeight = isMobile ? 300 : 350
  const minWidth = isMobile ? 400 : "100%"
  const finalWidth = isMobile ? Math.max(chartWidth, minWidth as number) : "100%"

  const handleClick = useCallback(
    (props: any) => {
      if (!isMobile || !props?.activePayload) return

      if (selectedPoint?.date === props.activeLabel) {
        setSelectedPoint(null) // Toggle off if clicking the same point
      } else {
        setSelectedPoint({
          date: props.activeLabel,
          values: props.activePayload,
        })
      }
    },
    [isMobile, selectedPoint],
  )

  const chartContent = (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: isMobile ? 40 : 20,
          left: 20,
          bottom: isMobile ? 40 : 20,
        }}
        onClick={handleClick}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis
          dataKey="date"
          stroke="white"
          tickFormatter={(tick) => {
            const d = new Date(tick)
            return d.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          }}
          tick={{
            fill: "white",
            angle: isMobile ? -65 : -45,
            textAnchor: "end",
            fontSize: isMobile ? 10 : 12,
            fontFamily: "var(--font-mono)",
          }}
          height={isMobile ? 60 : 30}
          interval={isMobile ? 1 : "preserveStartEnd"}
        />
        <YAxis
          stroke="white"
          tick={{
            fill: "white",
            fontSize: isMobile ? 10 : 12,
            fontFamily: "var(--font-mono)",
          }}
          domain={["auto", "auto"]}
        />
        <Tooltip
          content={<CustomHistoryTooltip isMobile={isMobile} containerRef={tooltipContainerRef} />}
          wrapperStyle={{ outline: "none" }}
          position={isMobile ? { x: 0, y: 0 } : undefined}
        />
        {modelNames.map((name, idx) => (
          <Line
            key={name}
            type="monotone"
            dataKey={name}
            name={name}
            stroke={hoveredModel === name ? "#ffffff" : CHART_COLORS[idx % CHART_COLORS.length]}
            strokeWidth={hoveredModel === name ? 4 : 2}
            dot={isMobile}
            activeDot={{ r: isMobile ? 6 : 8 }}
            opacity={hoveredModel && hoveredModel !== name ? 0.3 : 1}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )

  return (
    <div className="relative">
      {isMobile && (
        <div
          ref={tooltipContainerRef}
          className="sticky top-0 left-0 right-0 z-10 flex justify-center items-center h-[230px] bg-[hsl(var(--navbar))] bg-opacity-95 transition-all duration-200 p-4"
        ></div>
      )}
      <div className={isMobile ? "overflow-x-auto" : ""}>
        <div style={{ width: finalWidth, height: chartHeight }}>{chartContent}</div>
      </div>
      {isMobile && <div className="text-xs text-muted-foreground font-mono mt-2 text-right">Scroll to see more →</div>}
    </div>
  )
}

export function Leaderboard() {
  const [selectedSubset, setSelectedSubset] = useState<string>("Poker")
  const [currentPage, setCurrentPage] = useState(1)
  const [models, setModels] = useState<ModelData[]>([])
  const [eloHistory, setEloHistory] = useState<EloHistoryRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredModel, setHoveredModel] = useState<string | null>(null)

  const itemsPerPage = 10

  // Fetch models and Elo history in one useEffect, triggered by subset or page change.
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      setIsLoadingHistory(true)
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

        // Fetch models
        const { data: modelData, error: modelError } = await supabase.rpc("get_leaderboard_from_mv", {
          selected_env_ids: subsetEnvIds,
        })
        if (modelError) throw modelError
        setModels(modelData || [])

        // Fetch Elo history *only for the currently displayed models*
        const startIndex = (currentPage - 1) * itemsPerPage
        const paginatedModelsLocal = (modelData || []).slice(startIndex, startIndex + itemsPerPage)

        if (paginatedModelsLocal.length > 0) {
          const selectedModelIds = paginatedModelsLocal.map((m) => m.model_id)

          const { data: historyData, error: historyError } = await supabase.rpc("get_elo_history_by_env", {
            selected_env_ids: subsetEnvIds,
            selected_model_ids: selectedModelIds, // Pass model IDs.
          })
          if (historyError) throw historyError
          setEloHistory(historyData || [])
          console.log("Fetched Elo history:", historyData) // Log fetched data
        } else {
          setEloHistory([]) // No models on this page, clear the history.
        }
      } catch (err: any) {
        console.error("Error fetching data:", err)
        setError(err.message || "Failed to load data")
      } finally {
        setIsLoading(false)
        setIsLoadingHistory(false)
      }
    }

    fetchData()
  }, [selectedSubset, currentPage]) // Only re-fetch when subset or page changes.

  // Calculate paginated models.
  const paginatedModels = useMemo(() => {
    return models.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  }, [models, currentPage])

  // Prepare chart data. This is now much simpler.
  const chartData = useMemo(() => {
    if (!eloHistory || eloHistory.length === 0) return []

    const grouped: Record<string, any> = {}

    // Group by date and model.
    eloHistory.forEach((row) => {
      const dt = new Date(row.interval_start)
      dt.setMinutes(0, 0, 0) // Normalize to the hour.
      const dateKey = dt.toISOString()

      if (!grouped[dateKey]) {
        grouped[dateKey] = { date: dateKey }
      }

      // Always update, ensuring the *last* value for the hour is used.
      grouped[dateKey][row.model_name] = row.elo_value
    })

    // Sort by date.
    const sortedData = Object.values(grouped).sort(
      (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

    // Fill in missing data for *all* models on the current page.
    const currentModelNames = new Set(paginatedModels.map((model) => model.model_name))
    currentModelNames.forEach((modelName) => {
      let lastValue: number | undefined = 1000 // Initialize with a default
      sortedData.forEach((row: any) => {
        if (row[modelName] === undefined) {
          row[modelName] = lastValue
        } else {
          lastValue = row[modelName]
        }
      })
    })

    return sortedData
  }, [eloHistory, paginatedModels])

  const chartModelNames = useMemo(() => {
    if (!paginatedModels) return []
    return paginatedModels.map((model) => model.model_name)
  }, [paginatedModels])

  const isMobile = useIsMobile()

  const totalPages = Math.ceil(models.length / itemsPerPage)

  return (
    <Card className="bg-[hsl(var(--navbar))] border-2 border-[hsl(var(--border))] max-w-[100%] sm:max-w-[95%] mx-auto overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 pb-7">
        <CardTitle className="text-3xl font-bold text-navbarForeground font-mono">Leaderboard</CardTitle>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-navbarForeground" />
          <Select
            onValueChange={(value) => {
              setSelectedSubset(value)
              setCurrentPage(1)
            }}
            value={selectedSubset}
          >
            <SelectTrigger className="w-[180px] bg-background text-navbarForeground border-navbar font-mono">
              <SelectValue placeholder="Select subset" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(envSubsets).map((subset) => (
                <SelectItem key={subset} value={subset} className="font-mono">
                  {subset}
                </SelectItem>
              ))}
              <SelectItem value="All" className="font-mono">
                All
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-3">
        <div className="space-y-8">
          {!isMobile ? (
            // Desktop view - Table
            <Table className="font-mono">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px] text-navbarForeground">Rank</TableHead>
                  <TableHead className="text-navbarForeground">Model</TableHead>
                  <TableHead className="text-right text-navbarForeground">Elo</TableHead>
                  <TableHead className="text-right text-navbarForeground">Games</TableHead>
                  <TableHead className="text-right text-navbarForeground">Win Rate</TableHead>
                  <TableHead className="text-center text-navbarForeground">W/D/L</TableHead>
                  <TableHead className="text-right text-navbarForeground">Avg. Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-navbarForeground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-red-500">
                      {error}
                      <Button
                        onClick={() => {
                          /* Trigger refetch */
                        }}
                        className="ml-2 bg-background"
                      >
                        Retry
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedModels.map((model, index) => (
                    <TableRow
                      key={model.model_id}
                      onMouseEnter={() => setHoveredModel(model.model_name)}
                      onMouseLeave={() => setHoveredModel(null)}
                      className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--background))] hover:bg-opacity-5 transition-colors duration-200"
                    >
                      <TableCell className="font-medium text-navbarForeground">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/leaderboard/${encodeURIComponent(model.model_name)}`}
                          className="text-navbarForeground hover:underline"
                        >
                          {model.model_name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-navbarForeground">
                        {Math.round(model.elo)}
                      </TableCell>
                      <TableCell className="text-right text-navbarForeground">
                        {model.games_played.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-navbarForeground">
                        {(model.win_rate * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-green-400">{model.wins}</span>/
                        <span className="text-gray-400">{model.draws}</span>/
                        <span className="text-red-400">{model.losses}</span>
                      </TableCell>
                      <TableCell className="text-right text-navbarForeground">{model.avg_time.toFixed(1)}s</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          ) : (
            // Mobile view - Cards
            <div className="grid gap-4">
              {isLoading ? (
                <div className="text-center text-navbarForeground">Loading...</div>
              ) : error ? (
                <div className="text-center text-red-500">
                  {error}
                  <Button
                    onClick={() => {
                      /* Trigger refetch */
                    }}
                    className="ml-2 bg-background"
                  >
                    Retry
                  </Button>
                </div>
              ) : (
                paginatedModels.map((model, index) => (
                  <LeaderboardCard
                    key={model.model_id}
                    rank={(currentPage - 1) * itemsPerPage + index + 1}
                    model={model}
                  />
                ))
              )}
            </div>
          )}

          <div className="flex justify-between items-center">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="bg-[hsl(var(--navbar-foreground))] bg-opacity-10 hover:bg-opacity-20 text-[hsl(var(--navbar))] border border-[hsl(var(--navbar))] rounded-md transition-colors font-mono w-15 h-8 text-xs"
            >
              {isMobile ? "Prev" : "Previous"}
            </Button>

            <span className="text-navbarForeground font-mono text-xs">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage >= totalPages}
              className="bg-[hsl(var(--navbar-foreground))] bg-opacity-10 hover:bg-opacity-20 text-[hsl(var(--navbar))] border border-[hsl(var(--navbar))] rounded-md transition-colors font-mono w-15 h-8 text-xs"
            >
              Next
            </Button>
          </div>

          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-navbarForeground font-mono">Elo History</h3>
                {isMobile && (
                  <div className="relative flex items-center">
                    <div className="group">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <div className="absolute left-0 -top-1 translate-y-[-100%] hidden group-hover:block bg-background p-2 rounded-lg border border-navbar shadow-lg z-20 max-w-[160px]">
                        <p className="text-xs text-muted-foreground font-mono break-words">
                          Tap a point to see details
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {isLoadingHistory ? (
              <p className="text-navbarForeground">Loading elo history...</p>
            ) : (
              <EloHistoryChart
                data={chartData}
                modelNames={chartModelNames}
                hoveredModel={hoveredModel}
                isMobile={isMobile}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

