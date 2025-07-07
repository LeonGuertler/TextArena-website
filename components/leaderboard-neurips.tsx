"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceArea } from "recharts"
import { supabase } from "@/lib/supabase"
import { LeaderboardCard } from "@/components/leaderboard-card-neurips"
import { useIsMobile } from "@/hooks/use-mobile"
import { Filter, Info, BadgeCheck, MoonStar, Sprout } from "lucide-react"
import ReactDOM from "react-dom"
import { Badge } from "@/components/ui/badge";

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

// Define the specific environments you want to show
const NEURIPS_ENVIRONMENTS = {
  "NeurIPS": null, // All 4 environments grouped
  "Codenames-v0 (4 Players)": [65],
  "ColonelBlotto-v0 (2 Players)": [82],
  "SecretMafia-v0 (6 Players)": [75], 
  "ThreePlayerIPD-v0 (3 Players)": [83]
};

interface SubsetData {
  subset_type: string;
  environment_ids: string[];
}

type TimeRange = '48H' | '7D' | '30D';

interface ModelData {
  model_id: number
  model_name: string
  human_id: number
  human_name: string
  is_standard: boolean
  trueskill: number
  trueskill_sd: number
  games_played: number
  win_rate: number
  wins: number
  draws: number
  losses: number
  avg_time: number
  is_active: boolean
  small_category: boolean
}

interface TrueskillHistoryRow {
  model_id: number
  model_name: string
  human_id: number
  human_name: string
  interval_start: string 
  trueskill_value: number
  trueskill_sd_value: number
}

// Create a composite ID key for model and human combinations
// This will be used throughout the component for unique identification
const createCompositeId = (modelId: number, humanId: number) => `${modelId}-${humanId}`;

function CustomHistoryTooltip({ active, payload, label, isMobile, containerRef }: any) {
  if (active && payload && payload.length > 0) {
    const formattedTime = new Date(label).toLocaleString([], { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
    
    // Filter payload to only include the main series (not the upper/lower bounds)
    const mainPayload = payload.filter((entry: any) => {
      return !entry.dataKey.includes('_upper') && !entry.dataKey.includes('_lower') && !entry.dataKey.includes('_sd');
    });
    
    const sortedPayload = [...mainPayload].sort((a, b) => b.value - a.value);

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
            {/* Display both Trueskill value and SD */}
            {entry.value.toFixed(1)} ± {entry.payload[entry.dataKey + '_sd'].toFixed(1) || 'N/A'}: {entry.name}
          </p>
        ))}
        {/* Add explanation of Trueskill SD */}
        <p className="text-[8px] text-muted-foreground mt-1">
          ± indicates confidence (lower is more certain)
        </p>
      </div>
    );
    
    // Only use portal for mobile
    if (isMobile && containerRef?.current) {
      return ReactDOM.createPortal(tooltipContent, containerRef.current);
    }

    return tooltipContent;
  }
  return null;
}


function TrueskillHistoryChart({
  data,
  modelDetails,
  hoveredCompositeId,
  isMobile,
  models, // Add this new prop
}: {
  data: any[]
  modelDetails: { modelId: number, humanId: number }[]
  hoveredCompositeId: string | null
  isMobile: boolean
  models: { model_id: number, human_id: number, model_name: string }[] // Add this new type
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

  // Helper function to generate a key from model ID and human ID
  const modelIdToKey = (modelId: number, humanId: number) => `model_${modelId}_human_${humanId}`

  const chartContent = (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: isMobile ? 40 : 20,
          left: 20,
          bottom: isMobile ? 60 : 40,
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
            dy: 8
          }}
          height={isMobile ? 80 : 50}
          interval={isMobile ? 2 : "preserveStartEnd"}
        />
        <YAxis
          stroke="white"
          tick={{
            fill: "white",
            fontSize: isMobile ? 10 : 12,
            fontFamily: "var(--font-mono)",
          }}
          domain={[(dataMin) => dataMin - 1, (dataMax) => dataMax + 1]}
          tickFormatter={(value) => Math.round(value)}
          allowDataOverflow={true}
        />
        <Tooltip
          content={<CustomHistoryTooltip isMobile={isMobile} containerRef={tooltipContainerRef} />}
          wrapperStyle={{ outline: "none" }}
          position={isMobile ? { x: 0, y: 0 } : undefined}
        />
        
        {/* Always render ReferenceAreas but control visibility with opacity */}
        {data.length > 0 && modelDetails.map((detail, idx) => {
          const key = modelIdToKey(detail.modelId, detail.humanId);
          const compositeId = createCompositeId(detail.modelId, detail.humanId);
          
          return data.map((point, pointIdx) => {
            // Skip if we don't have both upper and lower values
            if (!point[`${key}_upper`] || !point[`${key}_lower`]) return null;
            
            // Always render but control visibility with opacity
            return (
              <ReferenceArea
                key={`${key}_band_${pointIdx}`}
                x1={point.date}
                x2={point.date}
                y1={point[`${key}_lower`]}
                y2={point[`${key}_upper`]}
                fill={CHART_COLORS[idx % CHART_COLORS.length]}
                fillOpacity={hoveredCompositeId === compositeId ? 0.2 : 0}
                stroke="none"
              />
            );
          });
        })}
        
        {/* Always render confidence bands but control visibility with opacity */}
        {modelDetails.map((detail, idx) => {
          const key = modelIdToKey(detail.modelId, detail.humanId);
          const compositeId = createCompositeId(detail.modelId, detail.humanId);
          
          return (
            <Line
              key={`${key}_lower`}
              type="monotone"
              dataKey={`${key}_lower`}
              stroke={CHART_COLORS[idx % CHART_COLORS.length]}
              strokeWidth={1.5}
              strokeDasharray="3 3"
              dot={false}
              connectNulls={true}
              activeDot={false}
              opacity={hoveredCompositeId === compositeId ? 0.7 : 0}
            />
          );
        })}
        
        {modelDetails.map((detail, idx) => {
          const key = modelIdToKey(detail.modelId, detail.humanId);
          const compositeId = createCompositeId(detail.modelId, detail.humanId);
          
          return (
            <Line
              key={`${key}_upper`}
              type="monotone"
              dataKey={`${key}_upper`}
              stroke={CHART_COLORS[idx % CHART_COLORS.length]}
              strokeWidth={1.5}
              strokeDasharray="3 3"
              dot={false}
              connectNulls={true}
              activeDot={false}
              opacity={hoveredCompositeId === compositeId ? 0.7 : 0}
            />
          );
        })}
        
        {/* Render the main trueskill lines on top */}
        {modelDetails.map((detail, idx) => {
          const key = modelIdToKey(detail.modelId, detail.humanId);
          const compositeId = createCompositeId(detail.modelId, detail.humanId);
          
          // Find model name for this ID to display in tooltip
          const modelName = models.find(m => m.model_id === detail.modelId && m.human_id === detail.humanId)?.model_name || "Unknown Model";
          
          return (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={modelName} // Use the model name for display in tooltip
              stroke={hoveredCompositeId === compositeId ? "#ffffff" : CHART_COLORS[idx % CHART_COLORS.length]}
              strokeWidth={hoveredCompositeId === compositeId ? 4 : 2}
              dot={false}
              activeDot={{ r: isMobile ? 6 : 8 }}
              opacity={hoveredCompositeId ? (hoveredCompositeId === compositeId ? 1 : 0.15) : 1}
            />
          );
        })}
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
  const [envSubsets, setEnvSubsets] = useState<Record<string, number[] | null>>({});
  const [selectedSubset, setSelectedSubset] = useState<string>(() => {
    // Try to get the saved value from localStorage
    const savedSubset = typeof window !== 'undefined' 
      ? localStorage.getItem('neuripsselectedLeaderboardSubset') 
      : null;
    
    // Return saved value or default to "NeurIPS"
    return savedSubset || "NeurIPS";
  });
  const [neuripsselectedStandardFilter, setSelectedStandardFilter] = useState<string>(() => {
    const savedFilter = typeof window !== 'undefined' 
      ? localStorage.getItem('neuripsselectedStandardFilter') 
      : null;
    return savedFilter || "All"
  });
  const [currentPage, setCurrentPage] = useState(1)
  const [models, setModels] = useState<ModelData[]>([])
  const [trueskillHistory, setTrueskillHistory] = useState<TrueskillHistoryRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredCompositeId, setHoveredCompositeId] = useState<string | null>(null)
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('7D');
  const [showSmallModels, setShowSmallModels] = useState<boolean>(() => {
    const savedSmallModelsFilter = typeof window !== 'undefined' 
      ? localStorage.getItem('neuripsShowSmallModels') 
      : null;
    return savedSmallModelsFilter === 'true';
  });
  const [showInactive, setShowInactive] = useState<boolean>(() => {
    const savedInactiveFilter = typeof window !== 'undefined' 
      ? localStorage.getItem('neuripsshowInactiveModels') 
      : null;
    return savedInactiveFilter === 'true';
  });

  const arrangeEnvironmentSubsets = (subsets: string[]) => {
    // Define priority items in the exact order you want them to appear
    const priorityOrder = [
      "Balanced Subset",
      "Chess-v0 (2 Players)",
      "DontSayIt-v0 (2 Players)",
      "IteratedRockPaperScissors-v0 (2 Players)",
      "Othello-v0 (2 Players)",
      "PigDice-v0 (2 Players)",
      "TicTacToe-v0 (2 Players)",
      "BlindAuction-v0 (5 Players)",
      "LiarsDice-v0 (5 Players)",
      "Negotiation-v0 (5 Players)",
      "Poker-v0 (5 Players)",
      "SecretMafia-v0 (5 Players)",
      "Snake-v0-standard (4 Players)",
    ];
    
    // Create a new array for the result
    const result: string[] = [];
    
    // First add all priority items that exist in the subsets (in priority order)
    priorityOrder.forEach(item => {
      if (subsets.includes(item)) {
        result.push(item);
      }
    });
    
    // Then add all remaining items in their original order
    subsets.forEach(item => {
      if (!priorityOrder.includes(item)) {
        result.push(item);
      }
    });
    
    return result;
  };

  // Then modify the fetchEnvSubsets function:
  useEffect(() => {
    async function fetchEnvSubsets() {
      try {
        // Instead of fetching from the database, just use our predefined environments
        setEnvSubsets(NEURIPS_ENVIRONMENTS);
      } catch (err: any) {
        console.error("Error setting env subsets:", err.message);
      }
    }

    fetchEnvSubsets();
  }, []);

  const itemsPerPage = 10

  const SmallModelsCheckbox = ({ id, isDesktop = true }: { id: string; isDesktop?: boolean }) => {
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
      setIsMounted(true);
    }, []);
    
    return (
      <div className={`flex items-center gap-2 ${isDesktop ? 'justify-end mb-4' : 'w-full mb-3'}`}>
        <div className="flex items-center gap-2">
          <div className="relative inline-block">
            <input
              type="checkbox"
              id={id}
              checked={showSmallModels}
              onChange={(e) => {
                setShowSmallModels(e.target.checked);
                setCurrentPage(1);
                if (typeof window !== 'undefined') {
                  localStorage.setItem('neuripsShowSmallModels', e.target.checked.toString());
                }
              }}
              className="sr-only"
            />
            <label
              htmlFor={id}
              className={`flex items-center justify-center w-5 h-5 rounded border border-white cursor-pointer transition-colors ${
                showSmallModels 
                ? 'bg-gray-600 border-white' 
                : 'bg-[hsl(var(--navbar))] border-white hover:border-navbarForeground'
              }`}
            >
              {isMounted && showSmallModels && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </label>
          </div>
          <label htmlFor={id} className="text-navbarForeground text-sm font-mono font-medium cursor-pointer">
            Show small models
          </label>
        </div>
        <div className="relative group">
          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
          <div
            className={`absolute hidden group-hover:block bg-background p-2 rounded-lg border border-navbar shadow-lg z-20
              ${isDesktop 
                ? 'right-0 top-full mt-1 w-64'
                : 'left-0 top-full mt-1 w-44 max-w-[11rem]'
              }`}
          >
            <p className="text-[11px] text-muted-foreground font-mono leading-snug">
              Include models classified as small category models (smaller than 8B parameters).
            </p>
          </div>
        </div>
      </div>
    );
  };

  const InactiveCheckbox = ({ id, isDesktop = true }: { id: string; isDesktop?: boolean }) => {
    // Use useEffect and useState to handle client-side rendering of the checkmark
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
      setIsMounted(true);
    }, []);
    
    return (
      <div className={`flex items-center gap-2 ${isDesktop ? 'justify-end mb-4' : 'w-full mb-3'}`}>
        <div className="flex items-center gap-2">
          <div className="relative inline-block">
            <input
              type="checkbox"
              id={id}
              checked={showInactive}
              onChange={(e) => {
                setShowInactive(e.target.checked);
                setCurrentPage(1);
                if (typeof window !== 'undefined') {
                  localStorage.setItem('neuripsshowInactiveModels', e.target.checked.toString());
                }
              }}
              className="sr-only" // Hide default checkbox but keep it accessible
            />
            <label
              htmlFor={id}
              className={`flex items-center justify-center w-5 h-5 rounded border border-white cursor-pointer transition-colors ${
                showInactive 
                ? 'bg-gray-600 border-white' 
                : 'bg-[hsl(var(--navbar))] border-white hover:border-navbarForeground'
              }`}
            >
              {/* Only render the SVG on the client side after mounting */}
              {isMounted && showInactive && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </label>
          </div>
          <label htmlFor={id} className="text-navbarForeground text-sm font-mono font-medium cursor-pointer">
            Show inactive models
          </label>
        </div>
        <div className="relative group">
          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
          <div
            className={`absolute hidden group-hover:block bg-background p-2 rounded-lg border border-navbar shadow-lg z-20
              ${isDesktop 
                ? 'right-0 top-full mt-1 w-64'  // Desktop: right aligned, wider
                : 'left-0 top-full mt-1 w-44 max-w-[11rem]'  // Mobile: left aligned, narrower
              }`}
          >
            <p className="text-[11px] text-muted-foreground font-mono leading-snug">
              Include models that have not played at least 5 games in the last 14 days.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const filteredModels = useMemo(() => {
    let filtered = models;
    
    // Apply the standard/non-standard filter
    if (neuripsselectedStandardFilter !== "All") {
      filtered = filtered.filter(model => 
        neuripsselectedStandardFilter === "Standard" ? model.is_standard : !model.is_standard
      );
    }
    
    // Apply the active/inactive filter
    if (!showInactive) {
      filtered = filtered.filter(model => model.is_active);
    }
    
    // Apply the small models filter
    if (!showSmallModels) {
      filtered = filtered.filter(model => !model.small_category);
    }
    
    return filtered;
  }, [models, neuripsselectedStandardFilter, showInactive, showSmallModels]); // Add showSmallModels to dependencies
  
  const paginatedModels = useMemo(() => {
    return filteredModels.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredModels, currentPage]);

  // First useEffect for fetching leaderboard data
  useEffect(() => {
    if (Object.keys(envSubsets).length === 0) return; // Wait for envSubsets to load
  
    async function fetchLeaderboardData() {
      setIsLoading(true);
      setError(null);
  
      try {
        const { data: modelData, error: modelError } = await supabase.rpc(
          "get_leaderboard_from_mv_trueskill_humans_models", // Updated function name
          { skill_subset: selectedSubset }
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
  }, [selectedSubset, envSubsets]);

  // Second useEffect for fetching Trueskill history data
  useEffect(() => {
    if (Object.keys(envSubsets).length === 0) return; // Wait for envSubsets
  
    async function fetchTrueskillHistory() {
      setIsLoadingHistory(true);
  
      try {
        const groupBasedSubsets = new Set([
          "Balanced Subset", "All", "Spatial Reasoning", "Spatial Thinking",
          "Adaptability", "Bluffing", "Logical Reasoning", "Memory Recall",
          "Pattern Recognition", "Persuasion", "Strategic Planning",
          "Theory of Mind", "Uncertainty Estimation",
          "NeurIPS"
        ]);
  
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedModelsLocal = filteredModels.slice(startIndex, startIndex + itemsPerPage);
  
        if (paginatedModelsLocal.length > 0) {
          const selectedModelIds = paginatedModelsLocal.map((m) => m.model_id);
          const selectedHumanIds = paginatedModelsLocal.map((m) => m.human_id); // Added for human IDs
          let subsetEnvIds: number[] | null = null;
  
          if (selectedSubset !== "All") {
            subsetEnvIds = envSubsets[selectedSubset] || [];
            if (subsetEnvIds.length === 0) subsetEnvIds = null;
          }
  
          const functionNameMap = {
            '48H': { groups: 'get_trueskill_humans_models_history_last48hrs_by_groups', env: 'get_trueskill_humans_models_history_last48hrs_by_env' },
            '7D': { groups: 'get_trueskill_humans_models_history_last7days_by_groups', env: 'get_trueskill_humans_models_history_last7days_by_env' },
            '30D': { groups: 'get_trueskill_humans_models_history_last30days_by_groups', env: 'get_trueskill_humans_models_history_last30days_by_env' }
          };
  
          let historyData, historyError;
  
          if (groupBasedSubsets.has(selectedSubset)) {
            const { data, error } = await supabase.rpc(
              functionNameMap[selectedTimeRange].groups,
              { 
                selected_model_ids: selectedModelIds, 
                selected_human_ids: selectedHumanIds, // Added human IDs parameter
                selected_subset: selectedSubset 
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
                selected_human_ids: selectedHumanIds // Added human IDs parameter
              }
            );
            historyData = data;
            historyError = error;
          }
  
          if (historyError) throw historyError;
          setTrueskillHistory(historyData || []);

          // Add this to your fetchTrueskillHistory function after the history data is received
          if (historyData) {
            const dates = historyData.map((row: any) => new Date(row.interval_start));
            const minDate = dates.length ? new Date(Math.min(...dates.map(d => d.getTime()))) : null;
            const maxDate = dates.length ? new Date(Math.max(...dates.map(d => d.getTime()))) : null;
            
            console.log("Trueskill History Data Stats:", {
              totalRows: historyData.length,
              uniqueModels: new Set(historyData.map((row: any) => row.model_id)).size,
              uniqueHumans: new Set(historyData.map((row: any) => row.human_id)).size,
              dateRange: {
                minDate: minDate ? minDate.toISOString() : 'N/A',
                maxDate: maxDate ? maxDate.toISOString() : 'N/A',
                currentTime: new Date().toISOString()
              },
              selectedTimeRange: selectedTimeRange,
              firstFewRows: historyData.slice(0, 3) // Show first 3 rows for inspection
            });
          }
        } else {
          setTrueskillHistory([]);
        }
      } catch (err: any) {
        console.error("Error fetching Trueskill history:", err);
      } finally {
        setIsLoadingHistory(false);
      }
    }
  
    fetchTrueskillHistory();
  }, [selectedTimeRange, currentPage, selectedSubset, filteredModels, envSubsets, showSmallModels]); // Add showSmallModels


  // Prepare chart data with composite IDs
  const chartData = useMemo(() => {
    if (!trueskillHistory || trueskillHistory.length === 0) return []
  
    const grouped: Record<string, any> = {}
  
    // Group by date and model ID + human ID
    trueskillHistory.forEach((row) => {
      const dt = new Date(row.interval_start)
      dt.setMinutes(0, 0, 0) // Normalize to the hour.
      const dateKey = dt.toISOString()
  
      if (!grouped[dateKey]) {
        grouped[dateKey] = { date: dateKey }
      }
  
      const modelKey = `model_${row.model_id}_human_${row.human_id}`
      
      // Always update, ensuring the *last* value for the hour is used
      grouped[dateKey][modelKey] = row.trueskill_value
      
      // Store the name for display in tooltips
      grouped[dateKey][`${modelKey}_name`] = row.model_name 
      
      // Store the SD value separately for tooltip access
      grouped[dateKey][`${modelKey}_sd`] = row.trueskill_sd_value
      
      // Add upper and lower bounds for confidence bands
      grouped[dateKey][`${modelKey}_upper`] = row.trueskill_value + row.trueskill_sd_value
      grouped[dateKey][`${modelKey}_lower`] = row.trueskill_value - row.trueskill_sd_value
    })
  
    // Sort by date
    const sortedData = Object.values(grouped).sort(
      (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )
  
    // Fill in missing data for *all* models on the current page
    paginatedModels.forEach((model) => {
      const modelKey = `model_${model.model_id}_human_${model.human_id}`
      
      let lastValue: number | undefined = 25 // Initialize with a default
      let lastSD: number | undefined = 8 // Default SD value
      let lastUpper: number | undefined = 25 + 8 // Default + default SD
      let lastLower: number | undefined = 25 - 8 // Default - default SD
      
      sortedData.forEach((row: any) => {
        if (row[modelKey] === undefined) {
          row[modelKey] = lastValue
          row[`${modelKey}_name`] = model.model_name // Keep name consistent
          row[`${modelKey}_sd`] = lastSD
          row[`${modelKey}_upper`] = lastUpper
          row[`${modelKey}_lower`] = lastLower
        } else {
          lastValue = row[modelKey]
          lastSD = row[`${modelKey}_sd`]
          lastUpper = row[`${modelKey}_upper`]
          lastLower = row[`${modelKey}_lower`]
        }
      })
    })
  
    return sortedData
  }, [trueskillHistory, paginatedModels])

  // Create model details array with both model ID and human ID
  const chartModelDetails = useMemo(() => {
    if (!paginatedModels) return []
    return paginatedModels.map((model) => ({
      modelId: model.model_id,
      humanId: model.human_id
    }))
  }, [paginatedModels])

  const isMobile = useIsMobile()

  const totalPages = Math.ceil(filteredModels.length / itemsPerPage);

  return (
    <Card className="bg-[hsl(var(--navbar))] border-2 border-[hsl(var(--border))] max-w-[100%] sm:max-w-[95%] mx-auto overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 pb-7">
        <div className="flex flex-col">
          <CardTitle className="text-3xl font-bold text-navbarForeground font-mono">
            Leaderboard NeurIPS
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground font-mono">
            The leaderboard is a competitive evaluation of LLM agents across selected games for the NeurIPS challenge called{" "}
            <Link
              href="https://www.mindgamesarena.com/#challenge"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-navbarForeground"
            >
              MindGames Challenge
            </Link>.
            These games are Codenames, Colonel Blotto, Secret Mafia and Three Player Iterative Prisoners' Dilemma. To register, click{" "}
            <Link
              href="https://docs.google.com/forms/d/e/1FAIpQLSfXjk7UfYXYqqxpcSaA6P_qi9zvgQW6rStRTRZ04IQ_anrpxQ/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-navbarForeground">
              here
            </Link>.
          </p>
        </div>
        
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
                    localStorage.setItem('neuripsselectedLeaderboardSubset', value);
                  }
                }}
                value={selectedSubset}
              >
                <SelectTrigger className="w-full bg-background text-navbarForeground border-navbar font-mono overflow-hidden text-ellipsis whitespace-nowrap focus:outline-none focus:ring-0 focus-visible:ring-0 data-[state=open]:border-navbar data-[state=open]:ring-0">
                  <SelectValue placeholder="Select game environment" />
                </SelectTrigger>
                <SelectContent>
                  {arrangeEnvironmentSubsets(Object.keys(envSubsets)).map((subset) => (
                    <SelectItem key={subset} value={subset} className="font-mono">
                      {subset}
                    </SelectItem>
                  ))}
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
                    localStorage.setItem('neuripsselectedStandardFilter', value);
                  }
                }}
                value={neuripsselectedStandardFilter}
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
                    localStorage.setItem('neuripsselectedLeaderboardSubset', value);
                  }
                }}
                value={selectedSubset}
              >
                <SelectTrigger className="w-[320px] bg-background text-navbarForeground border-navbar font-mono overflow-hidden text-ellipsis whitespace-nowrap focus:outline-none focus:ring-0 focus-visible:ring-0 data-[state=open]:border-navbar data-[state=open]:ring-0">
                  <SelectValue placeholder="Select game environment" />
                </SelectTrigger>
                <SelectContent>
                  {arrangeEnvironmentSubsets(Object.keys(envSubsets)).map((subset) => (
                    <SelectItem key={subset} value={subset} className="font-mono">
                      {subset}
                    </SelectItem>
                  ))}
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
                    localStorage.setItem('neuripsselectedStandardFilter', value);
                  }
                }}
                value={neuripsselectedStandardFilter}
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

      {!isMobile ? (
        // Desktop view checkboxes - above the table, side by side
        <div className="px-6 mt-2 mb-4">
          <div className="flex items-center justify-end gap-8">
            <SmallModelsCheckbox id="small-models-filter-desktop" />
            <InactiveCheckbox id="inactive-filter-desktop" />
          </div>
        </div>
      ) : (
        // Mobile view checkboxes - above the cards, side by side
        <div className="px-4 mt-2 mb-3">
          <div className="flex items-center justify-between gap-4">
            <SmallModelsCheckbox id="small-models-filter-mobile" isDesktop={false} />
            <InactiveCheckbox id="inactive-filter-mobile" isDesktop={false} />
          </div>
        </div>
      )}
      
      <CardContent className="p-2 sm:p-3">
        <div className="space-y-8">
          {!isMobile ? (
            // Desktop view - Table
            <Table className="font-mono">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px] text-navbarForeground">Rank</TableHead>
                  <TableHead className="text-navbarForeground">Model</TableHead>
                  <TableHead className="text-navbarForeground">Human</TableHead>
                  <TableHead className="text-right text-navbarForeground">Trueskill</TableHead>
                  <TableHead className="text-right text-navbarForeground">Games</TableHead>
                  <TableHead className="text-right text-navbarForeground">Win Rate</TableHead>
                  <TableHead className="text-center text-navbarForeground">W/D/L</TableHead>
                  <TableHead className="text-right text-navbarForeground">Avg. Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-navbarForeground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-red-500">
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
                    <TableCell colSpan={8} className="text-center py-8 text-navbarForeground">
                      <div className="flex flex-col items-center gap-2">
                        <Info className="h-8 w-8 text-muted-foreground" />
                        <p className="font-medium">No models have played this environment, or all environments in this group, at least once.</p>
                        <p className="text-sm text-muted-foreground">Try selecting a different environment from the dropdown above.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedModels.map((model, index) => {
                    const compositeId = createCompositeId(model.model_id, model.human_id);
                    return (
                      <TableRow
                        key={compositeId}
                        onMouseEnter={() => setHoveredCompositeId(compositeId)}
                        onMouseLeave={() => setHoveredCompositeId(null)}
                        className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--background))] hover:bg-opacity-5 transition-colors duration-200"
                      >
                        <TableCell className="font-medium text-navbarForeground">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/neurips/${encodeURIComponent(model.model_name)}/${model.model_id}/${model.human_id}/${encodeURIComponent(selectedSubset)}`}
                              className="text-navbarForeground hover:underline"
                            >
                              {model.model_name}
                            </Link>
                            
                            {/* Icons in a row next to the model name */}
                            <div className="flex items-center gap-1">
                              {model.is_standard && (
                                <div className="relative group">
                                  <BadgeCheck size={16} className="text-blue-400" />
                                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 hidden group-hover:block bg-background p-1.5 rounded-lg border border-navbar shadow-lg z-20">
                                    <p className="text-xs text-muted-foreground font-mono whitespace-nowrap">Standard model</p>
                                  </div>
                                </div>
                              )}
                              {model.small_category && (
                                <div className="relative group">
                                  <Sprout size={16} className="text-green-400" />
                                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 hidden group-hover:block bg-background p-1.5 rounded-lg border border-navbar shadow-lg z-20">
                                    <p className="text-xs text-muted-foreground font-mono whitespace-nowrap">Small model</p>
                                  </div>
                                </div>
                              )}
                              {!model.is_active && (
                                <div className="relative group">
                                  <MoonStar size={16} className="text-gray-400" />
                                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 hidden group-hover:block bg-background p-1.5 rounded-lg border border-navbar shadow-lg z-20">
                                    <p className="text-xs text-muted-foreground font-mono whitespace-nowrap">Inactive model</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-navbarForeground">
                          {model.human_name}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-navbarForeground">
                          {model.trueskill.toFixed(1)} ± {model.trueskill_sd.toFixed(1)}
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
                    );
                  })
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
                    key={`${model.model_id}-${model.human_id}`}
                    rank={(currentPage - 1) * itemsPerPage + index + 1}
                    model={model}
                    selectedSubset={selectedSubset}
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
                    <h3 className="text-xl font-bold text-navbarForeground font-mono">Trueskill History</h3>
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
                      <h3 className="text-xl font-bold text-navbarForeground font-mono">Trueskill History</h3>
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
                  <p className="text-navbarForeground">Loading trueskill history...</p>
                ) : (
                  <TrueskillHistoryChart
                    data={chartData}
                    modelDetails={chartModelDetails}
                    hoveredCompositeId={hoveredCompositeId}
                    isMobile={isMobile}
                    models={paginatedModels} // Pass the models data here
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