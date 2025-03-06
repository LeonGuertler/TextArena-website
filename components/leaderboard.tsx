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

const envSubsets: Record<string, string[] | null> = {
  // Grouped subsets
  'Balanced Subset': [
    "Chess-v0",
    "DontSayIt-v0",
    "LiarsDice-v0",
    "SimpleNegotiation-v0",
    "Poker-v0",
    "SpellingBee-v0",
    "Stratego-v0",
    "Tak-v0",
    "TruthAndDeception-v0",
    "UltimateTicTacToe-v0",
  ],
  
  // Individual games
  Chess: ["Chess-v0"],
  ConnectFour: ["ConnectFour-v0"],
  Debate: ["Debate-v0"],
  DontSayIt: ["DontSayIt-v0"],
  Battleship: ["Battleship-v0"],
  LiarsDice: ["LiarsDice-v0"],
  Mastermind: ["Mastermind-v0"],
  'Simple Negotiation': ["SimpleNegotiation-v0"],
  Poker: ["Poker-v0"],
  SpellingBee: ["SpellingBee-v0"],
  SpiteAndMalice: ["SpiteAndMalice-v0"],
  Stratego: ["Stratego-v0"],
  Tak: ["Tak-v0"],
  TruthAndDeception: ["TruthAndDeception-v0"],
  UltimateTicTacToe: ["UltimateTicTacToe-v0"],
  WordChains: ["WordChains-v0"],
  
  // Skill-based subsets
  Adaptability: [
    "IteratedPrisonersDilemma-v0",
    "Negotiation-v0",
    "SpiteAndMalice-v0",
    "Stratego-v0",
    "Debate-v0",
    "DontSayIt-v0",
    "SpellingBee-v0",
    "LiarsDice-v0",
    "WordChains-v0"
  ],
  Bluffing: [
    "Poker-v0",
    "TruthAndDeception-v0",
    "DontSayIt-v0",
    "LiarsDice-v0"
  ],
  "Logical Reasoning": [
    "SpellingBee-v0",
    "WordChains-v0",
    "TruthAndDeception-v0",
    "Battleship-v0",
    "Tak-v0",
    "SpiteAndMalice-v0",
    "ConnectFour-v0",
    "Mastermind-v0",
    "UltimateTicTacToe-v0",
    "Debate-v0",
    "Chess-v0"
  ],
  "Memory Recall": [
    "Mastermind-v0",
    "SpellingBee-v0",
    "WordChains-v0",
    "Chess-v0",
    "LiarsDice-v0"
  ],
  "Pattern Recognition": [
    "ConnectFour-v0",
    "UltimateTicTacToe-v0",
    "Mastermind-v0",
    "Tak-v0",
    "SpellingBee-v0",
    "Stratego-v0",
    "Battleship-v0",
    "Chess-v0",
    "WordChains-v0"
  ],
  Persuasion: [
    "Poker-v0",
    "Debate-v0",
    "Negotiation-v0",
    "DontSayIt-v0",
    "TruthAndDeception-v0"
  ],
  "Spatial Reasoning": [
    "UltimateTicTacToe-v0"
  ],
  "Spatial Thinking": [
    "Tak-v0",
    "Chess-v0",
    "Battleship-v0",
    "ConnectFour-v0"
  ],
  "Strategic Planning": [
    "Negotiation-v0",
    "Tak-v0",
    "IteratedPrisonersDilemma-v0",
    "Chess-v0",
    "Poker-v0",
    "Stratego-v0",
    "UltimateTicTacToe-v0",
    "SpiteAndMalice-v0",
    "ConnectFour-v0",
    "Mastermind-v0"
  ],
  "Theory of Mind": [
    "TruthAndDeception-v0",
    "SpiteAndMalice-v0",
    "LiarsDice-v0",
    "Negotiation-v0",
    "Debate-v0",
    "Poker-v0",
    "IteratedPrisonersDilemma-v0",
    "Stratego-v0",
    "DontSayIt-v0"
  ],
  "Uncertainty Estimation": [
    "Stratego-v0",
    "LiarsDice-v0",
    "Battleship-v0",
    "Poker-v0",
    "IteratedPrisonersDilemma-v0",
    "SpiteAndMalice-v0",
    "TruthAndDeception-v0"
  ]
};

type TimeRange = '48H' | '7D' | '30D';

interface ModelData {
  model_id: number
  model_name: string
  is_standard: boolean
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
    const formattedTime = new Date(label).toLocaleTimeString([], { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })
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
            {Math.round(entry.value)}: {entry.name}
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

  // Helper function to format the date and time
  const formatDateTime = (tick: string) => {
    const d = new Date(tick)
    const date = d.toLocaleDateString([], {
      month: 'numeric',
      day: 'numeric'
    })
    const time = d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    })
    return `${date}, ${time}`
  }

  const chartContent = (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: isMobile ? 40 : 20,
          left: 20,
          bottom: isMobile ? 60 : 40, // Increased bottom margin to accommodate longer labels
        }}
        onClick={handleClick}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis
          dataKey="date"
          stroke="white"
          tickFormatter={formatDateTime}
          tick={{
            fill: "white",
            angle: isMobile ? -65 : -45,
            textAnchor: "end",
            fontSize: isMobile ? 10 : 12,
            fontFamily: "var(--font-mono)",
            dy: 8 // Adjust vertical position of ticks
          }}
          height={isMobile ? 80 : 50} // Increased height to prevent label overlap
          interval={isMobile ? 2 : "preserveStartEnd"} // Show fewer ticks on mobile
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
            dot={false}
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
  // const [selectedSubset, setSelectedSubset] = useState<string>("Balanced Subset")
  const [selectedSubset, setSelectedSubset] = useState<string>(() => {
    // Try to get the saved value from localStorage
    const savedSubset = typeof window !== 'undefined' 
      ? localStorage.getItem('selectedLeaderboardSubset') 
      : null;
    
    // Return saved value or default
    return savedSubset || "Simple Negotiation";
  });
  const [selectedStandardFilter, setSelectedStandardFilter] = useState<string>(() => {
    const savedFilter = typeof window !== 'undefined' 
      ? localStorage.getItem('selectedStandardFilter') 
      : null;
    return savedFilter || "All";
  });
  const [currentPage, setCurrentPage] = useState(1)
  const [models, setModels] = useState<ModelData[]>([])
  const [eloHistory, setEloHistory] = useState<EloHistoryRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredModel, setHoveredModel] = useState<string | null>(null)
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('7D');

  const itemsPerPage = 10

  const filteredModels = useMemo(() => {
    if (selectedStandardFilter === "All") return models;
    return models.filter(model => 
      selectedStandardFilter === "Standard" ? model.is_standard : !model.is_standard
    );
  }, [models, selectedStandardFilter]);
  
  const paginatedModels = useMemo(() => {
    return filteredModels.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredModels, currentPage]);

  // First useEffect for fetching leaderboard data
  useEffect(() => {
    async function fetchLeaderboardData() {
      setIsLoading(true);
      setError(null);
  
      try {
        let subsetEnvIds: number[] | null = null;
  
        if (selectedSubset !== "All") {
          const subsetNames = envSubsets[selectedSubset] || [];
          if (subsetNames.length > 0) {
            const { data: envData, error: envError } = await supabase
              .from("environments")
              .select("id")
              .in("env_name", subsetNames);
  
            if (envError) throw envError;
            subsetEnvIds = (envData ?? []).map((env: any) => env.id);
          }
        }
  
        const { data: modelData, error: modelError } = await supabase.rpc(
          "get_leaderboard_from_mv",
          { selected_env_ids: subsetEnvIds }
        );
        if (modelError) throw modelError;
        setModels(modelData || []);
      } catch (err: any) {
        console.error("Error fetching leaderboard data:", err);
        setError(err.message || "Failed to load leaderboard data");
      } finally {
        setIsLoading(false);
      }
    }
  
    fetchLeaderboardData();
  }, [selectedSubset]); // Only depends on selectedSubset

  // Second useEffect for fetching Elo history data
  useEffect(() => {
    async function fetchEloHistory() {
      setIsLoadingHistory(true);
      
      try {
        const groupBasedSubsets = new Set([
          "Balanced Subset", "All", "Spatial Reasoning", "Spatial Thinking",
          "Adaptability", "Bluffing", "Logical Reasoning", "Memory Recall",
          "Pattern Recognition", "Persuasion", "Strategic Planning",
          "Theory of Mind", "Uncertainty Estimation"
        ]);

        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedModelsLocal = models.slice(startIndex, startIndex + itemsPerPage);
  
        if (paginatedModelsLocal.length > 0) {
          const selectedModelIds = paginatedModelsLocal.map((m) => m.model_id);
          
          let subsetEnvIds: number[] | null = null;
          if (selectedSubset !== "All") {
            const subsetNames = envSubsets[selectedSubset] || [];
            if (subsetNames.length > 0) {
              const { data: envData, error: envError } = await supabase
                .from("environments")
                .select("id")
                .in("env_name", subsetNames);
    
              if (envError) throw envError;
              subsetEnvIds = (envData ?? []).map((env: any) => env.id);
            }
          }
  
          const functionNameMap = {
            '48H': {
              groups: 'get_elo_history_last48hrs_by_groups',
              env: 'get_elo_history_last48hrs_by_env'
            },
            '7D': {
              groups: 'get_elo_history_last7days_by_groups',
              env: 'get_elo_history_last7days_by_env'
            },
            '30D': {
              groups: 'get_elo_history_last30days_by_groups',
              env: 'get_elo_history_last30days_by_env'
            }
          };
  
          let historyData, historyError;
  
          if (groupBasedSubsets.has(selectedSubset)) {
            const { data, error } = await supabase.rpc(
              functionNameMap[selectedTimeRange].groups,
              {
                selected_model_ids: selectedModelIds,
                selected_subset: selectedSubset,
              }
            );
            historyData = data;
            historyError = error;
          } else {
            const { data, error } = await supabase.rpc(
              functionNameMap[selectedTimeRange].env,
              {
                selected_env_ids: subsetEnvIds,
                selected_model_ids: selectedModelIds,
              }
            );
            historyData = data;
            historyError = error;
          }
  
          if (historyError) throw historyError;
          setEloHistory(historyData || []);
        } else {
          setEloHistory([]);
        }
      } catch (err: any) {
        console.error("Error fetching Elo history:", err);
        // We don't set the main error state here since it's just for the history
      } finally {
        setIsLoadingHistory(false);
      }
    }
  
    fetchEloHistory();
  }, [selectedTimeRange, currentPage, selectedSubset, models]); // Dependencies for Elo history


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

  const totalPages = Math.ceil(filteredModels.length / itemsPerPage);

  return (
    <Card className="bg-[hsl(var(--navbar))] border-2 border-[hsl(var(--border))] max-w-[100%] sm:max-w-[95%] mx-auto overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 pb-7">
        <CardTitle className="text-3xl font-bold text-navbarForeground font-mono">Leaderboard</CardTitle>
        
        {isMobile ? (
          // Mobile layout - filters stacked vertically
          <div className="flex flex-col w-full gap-3">
            {/* Game Environment Filter */}
            <div className="w-full">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-navbarForeground text-sm font-mono font-medium">Game Environment</span>
                <div className="relative group">
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  <div className="absolute left-0 top-0 translate-y-[-100%] hidden group-hover:block bg-background p-2 rounded-lg border border-navbar shadow-lg z-20 w-64">
                    <p className="text-xs text-muted-foreground font-mono">
                      Select specific games or skill-based groupings to view model performance.
                    </p>
                  </div>
                </div>
              </div>
              <Select
                onValueChange={(value) => {
                  setSelectedSubset(value);
                  setCurrentPage(1);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('selectedLeaderboardSubset', value);
                  }
                }}
                value={selectedSubset}
              >
                <SelectTrigger className="w-full bg-background text-navbarForeground border-navbar font-mono overflow-hidden text-ellipsis whitespace-nowrap focus:outline-none focus:ring-0 focus-visible:ring-0 data-[state=open]:border-navbar data-[state=open]:ring-0">
                  <SelectValue placeholder="Select game environment" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(envSubsets).map((subset) => (
                    <SelectItem key={subset} value={subset} className="font-mono">
                      {subset}
                    </SelectItem>
                  ))}
                  <SelectItem value="All" className="font-mono">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Model Type Filter */}
            <div className="w-full">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-navbarForeground text-sm font-mono font-medium">Model Type</span>
                <div className="relative group">
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  <div className="absolute left-0 top-0 translate-y-[-100%] hidden group-hover:block bg-background p-2 rounded-lg border border-navbar shadow-lg z-20 w-64">
                    <p className="text-xs text-muted-foreground font-mono">
                      Filter models by their classification as standard or all.
                    </p>
                  </div>
                </div>
              </div>
              <Select
                onValueChange={(value) => {
                  setSelectedStandardFilter(value);
                  setCurrentPage(1);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('selectedStandardFilter', value);
                  }
                }}
                value={selectedStandardFilter}
              >
                <SelectTrigger className="w-full bg-background text-navbarForeground border-navbar font-mono overflow-hidden text-ellipsis whitespace-nowrap focus:outline-none focus:ring-0 focus-visible:ring-0 data-[state=open]:border-navbar data-[state=open]:ring-0">
                  <SelectValue placeholder="Select model type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All" className="font-mono">All</SelectItem>
                  <SelectItem value="Standard" className="font-mono">Standard</SelectItem>
                  {/* <SelectItem value="Non-standard" className="font-mono">Non-standard</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          // Desktop layout - filters side-by-side
          <div className="flex items-center gap-4">
            {/* Game Environment Filter */}
            <div>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-navbarForeground text-sm font-mono font-medium">Game Environment</span>
                <div className="relative group">
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-background p-2 rounded-lg border border-navbar shadow-lg z-20 w-64">
                    <p className="text-xs text-muted-foreground font-mono">
                      Select specific games or skill-based groupings to view model performance.
                    </p>
                  </div>
                </div>
              </div>
              <Select
                onValueChange={(value) => {
                  setSelectedSubset(value);
                  setCurrentPage(1);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('selectedLeaderboardSubset', value);
                  }
                }}
                value={selectedSubset}
              >
                <SelectTrigger className="w-[210px] bg-background text-navbarForeground border-navbar font-mono overflow-hidden text-ellipsis whitespace-nowrap focus:outline-none focus:ring-0 focus-visible:ring-0 data-[state=open]:border-navbar data-[state=open]:ring-0">
                  <SelectValue placeholder="Select game environment" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(envSubsets).map((subset) => (
                    <SelectItem key={subset} value={subset} className="font-mono">
                      {subset}
                    </SelectItem>
                  ))}
                  <SelectItem value="All" className="font-mono">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Model Type Filter */}
            <div>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-navbarForeground text-sm font-mono font-medium">Model Type</span>
                <div className="relative group">
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-background p-2 rounded-lg border border-navbar shadow-lg z-20 w-64">
                    <p className="text-xs text-muted-foreground font-mono">
                      Filter models by their classification as standard or all.
                    </p>
                  </div>
                </div>
              </div>
              <Select
                onValueChange={(value) => {
                  setSelectedStandardFilter(value);
                  setCurrentPage(1);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('selectedStandardFilter', value);
                  }
                }}
                value={selectedStandardFilter}
              >
                <SelectTrigger className="w-[210px] bg-background text-navbarForeground border-navbar font-mono overflow-hidden text-ellipsis whitespace-nowrap focus:outline-none focus:ring-0 focus-visible:ring-0 data-[state=open]:border-navbar data-[state=open]:ring-0">
                  <SelectValue placeholder="Select model type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All" className="font-mono">All</SelectItem>
                  <SelectItem value="Standard" className="font-mono">Standard</SelectItem>
                  {/* <SelectItem value="Non-standard" className="font-mono">Non-standard</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
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
                ) : models.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-navbarForeground">
                      <div className="flex flex-col items-center gap-2">
                        <Info className="h-8 w-8 text-muted-foreground" />
                        <p className="font-medium">No models have played this environment, or all environments in this group, at least once.</p>
                        <p className="text-sm text-muted-foreground">Try selecting a different environment from the dropdown above.</p>
                      </div>
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
              ) : models.length === 0 ? (
                <div className="text-center py-8 text-navbarForeground">
                  <div className="flex flex-col items-center gap-2">
                    <Info className="h-8 w-8 text-muted-foreground" />
                    <p className="font-medium">No models have played this environment yet.</p>
                    <p className="text-sm text-muted-foreground">Try selecting a different environment from the dropdown above.</p>
                  </div>
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

          {models.length > 0 && (
            <>
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
                {/* Desktop view */}
                {!isMobile && (
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-navbarForeground font-mono">Elo History</h3>
                    <div className="flex gap-1 bg-background rounded-md p-0.5 border border-navbar">
                      {[
                        { label: 'L2D', value: '48H' },
                        { label: 'L7D', value: '7D' },
                        { label: 'L30D', value: '30D' }
                      ].map(({ label, value }) => (
                        <button
                          key={value}
                          onClick={() => setSelectedTimeRange(value as TimeRange)}
                          className={`px-2 py-1 text-xs font-mono rounded ${
                            selectedTimeRange === value
                              ? 'bg-[hsl(var(--navbar))] text-navbarForeground'
                              : 'text-muted-foreground hover:bg-[hsl(var(--navbar))] hover:bg-opacity-50 hover:text-navbarForeground'
                          } transition-colors`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mobile view */}
                {isMobile && (
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-navbarForeground font-mono">Elo History</h3>
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
                    </div>
                    
                    <div className="flex gap-1 bg-background rounded-md p-0.5 border border-navbar">
                      {[
                        { label: 'L2D', value: '48H' },
                        { label: 'L7D', value: '7D' },
                        { label: 'L30D', value: '30D' }
                      ].map(({ label, value }) => (
                        <button
                          key={value}
                          onClick={() => setSelectedTimeRange(value as TimeRange)}
                          className={`px-2 py-1 text-xs font-mono rounded ${
                            selectedTimeRange === value
                              ? 'bg-[hsl(var(--navbar))] text-navbarForeground'
                              : 'text-muted-foreground hover:bg-[hsl(var(--navbar))] hover:bg-opacity-50 hover:text-navbarForeground'
                          } transition-colors`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

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
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

