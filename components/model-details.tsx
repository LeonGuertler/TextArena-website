"use client"

import React, { useEffect, useState, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Scale, ArrowLeft } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createRoot } from "react-dom/client"

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

// Chart colors for different environments
const CHART_COLORS = [
  "#06b6d4", // cyan-500
  "#22c55e", // green-500
  "#eab308", // yellow-500
  "#ec4899", // pink-500
  "#8b5cf6", // violet-500
  "#14b8a6", // teal-500
  "#f97316", // orange-500
  "#06d6a0", // emerald-400
  "#6366f1", // indigo-500
  "#f43f5e", // rose-500
  "#3b82f6", // blue-500
  "#ef4444", // red-500
  "#10b981", // green-400
  "#facc15", // amber-400
  "#c026d3", // fuchsia-600
  "#a855f7", // purple-500
  "#0ea5e9", // sky-500
  "#65a30d", // lime-600
  "#fb923c", // orange-400
  "#64748b", // slate-500
  "#9333ea", // purple-600
  "#16a34a", // green-600
  "#dc2626", // red-600
  "#e11d48", // rose-600
  "#2563eb", // blue-600
  "#d97706", // amber-600
  "#059669", // teal-600
  "#4f46e5", // indigo-600
  "#f43f5e", // pink-600
  "#7c3aed", // violet-600
];


// Environment subsets
const envSubsets: Record<string, string[]> = {
  'Chess': ['Chess-v0'],
  'ConnectFour': ['ConnectFour-v0'],
  'Debate': ['Debate-v0'],
  'DontSayIt': ['DontSayIt-v0'],
  'Battleship': ['Battleship-v0'],
  'LiarsDice': ['LiarsDice-v0'],
  'Mastermind': ['Mastermind-v0'],
  'Negotiation': ['Negotiation-v0'],
  'Poker': ['Poker-v0'],
  'SpellingBee': ['SpellingBee-v0'],
  'SpiteAndMalice': ['SpiteAndMalice-v0'],
  'Stratego': ['Stratego-v0'],
  'Tak': ['Tak-v0'],
  'TruthAndDeception': ['TruthAndDeception-v0'],
  'UltimateTicTacToe': ['UltimateTicTacToe-v0'],
  'WordChains': ['WordChains-v0'],
};

// -------------------------------------------------------------------
// 2. Type Definitions
// -------------------------------------------------------------------

// New type definition for environment history
interface EnvEloHistoryRow {
  model_id: number;
  model_name: string;
  interval_start: string;
  environment_name: string;
  elo_value: number;
}

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
      rootRef.current = createRoot(containerRef.current);
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
        
        // Get sorted environments for both models
        const mainEnvsSorted = [...data.mainEnvs].sort((a, b) => b.relativeWeight - a.relativeWeight);
        const comparisonEnvsSorted = data.comparisonEnvs ? 
          [...data.comparisonEnvs].sort((a, b) => b.relativeWeight - a.relativeWeight) : [];

        // Combine environment data for comparison
        const allEnvironments = new Set([
          ...mainEnvsSorted.map(env => env.name),
          ...comparisonEnvsSorted.map(env => env.name)
        ]);

        root.render(
          <div 
            className={`font-mono ${isMobile ? "p-0 text-[10px]" : "p-2 text-sm"} space-y-4`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Section */}
            <div className="space-y-2">
              <h3 className={`font-bold text-navbar-foreground tracking-wide ${isMobile ? "text-[10px]" : "text-lg"}`}>
                {data.skill}
              </h3>
              <p className={`text-navbar-foreground font-light ${isMobile ? "text-[8px]" : "text-xs"}`}>
                {SKILL_EXPLANATIONS[data.skill]}
              </p>
            </div>

            {/* Overall Elo Comparison */}
            <div className="flex justify-between border-t border-b border-muted-foreground py-2 min-h-[80px] gap-4">
              <div className="min-w-0 flex-1 flex flex-col justify-between">
                <div className={`text-[#8884d8] font-semibold ${isMobile ? "text-[10px]" : "text-xs"} break-words text-left`}>
                  {payload[0].name}
                </div>
                <div className={`font-bold ${isMobile ? "text-[12px]" : "text-lg"} whitespace-nowrap`}>
                  {data.mainElo.toFixed(1)}
                </div>
              </div>
              {data.comparisonElo > 0 && (
                <div className="min-w-0 flex-1 flex flex-col justify-between">
                  <div className={`text-[#82ca9d] font-semibold ${isMobile ? "text-[10px]" : "text-xs"} break-words text-right`}>
                    {payload.length > 1 ? payload[1].name : ""}
                  </div>
                  <div className={`font-bold ${isMobile ? "text-[12px]" : "text-lg"} text-right whitespace-nowrap`}>
                    {data.comparisonElo.toFixed(1)}
                  </div>
                </div>
              )}
            </div>
            
            {/* Environments Section */}
            <div>
              <div className={`text-muted-foreground font-semibold mb-2 ${isMobile ? "text-[9px]" : "text-xs"}`}>
                Environment Contributions
              </div>
              <div className={`space-y-2 ${isMobile ? "text-[8px]" : "text-[10px]"}`}>
                {[...allEnvironments].map((envName) => {
                  const mainEnv = mainEnvsSorted.find(e => e.name === envName);
                  const compEnv = comparisonEnvsSorted.find(e => e.name === envName);
                  
                  return (
                    <div key={envName} className="grid grid-cols-[1fr,auto,1fr] gap-2 items-baseline">
                      {/* Main model values */}
                      <div className="text-left">
                        {mainEnv && (
                          <span 
                            className={`text-[#8884d8] ${
                              compEnv && mainEnv.elo > compEnv.elo ? "underline" : ""
                            }`}
                          >
                            {mainEnv.elo.toFixed(1)}
                          </span>
                        )}
                      </div>
                      
                      {/* Environment name and percentage on separate lines */}
                      <div className="flex flex-col items-center text-navbar-foreground font-medium">
                        <div className="whitespace-nowrap">
                          {envName.replace(/-/g, "\u200B-")}
                        </div>
                        {mainEnv && (
                          <div className="text-muted-foreground font-medium">
                            ({(mainEnv.relativeWeight * 100).toFixed(1)}%)
                          </div>
                        )}
                      </div>
                      
                      {/* Comparison model values */}
                      <div className="text-right">
                        {compEnv && (
                          <span 
                            className={`text-[#82ca9d] ${
                              mainEnv && compEnv.elo > mainEnv.elo ? "underline" : ""
                            }`}
                          >
                            {compEnv.elo.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
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
      const mobileRoot = createRoot(containerRef.current);
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
    const data = payload[0].payload;
    const content = (
      <div
        className={`bg-[hsl(var(--navbar))] rounded text-navbarForeground font-mono ${
          isMobile ? "p-1 text-[10px]" : "p-2 text-sm"
        } shadow-lg`}
      >
        <p className="font-bold m-0 text-white">{data.name}</p>
        <p className="m-0" style={{ color: "#8884d8" }}> {/* Purple for Elo */}
          Elo: {data.elo.toFixed(1)}
        </p>
        <p className="m-0" style={{ color: "#82ca9d" }}> {/* Green for Win */}
          Win: {(data.win_rate * 100).toFixed(1)}%
        </p>
        <p className="m-0 text-gray-400">
          W/D/L: <span className="text-green-400">{data.wins}</span>
          <span className="text-white">/</span>
          <span className="text-white">{data.draws}</span>
          <span className="text-white">/</span>
          <span className="text-red-400">{data.losses}</span>
        </p>
        {!isMobile && (
          <>
            <p className="m-0 text-gray-400">
              Games: <span className="text-white">{data.games}</span>
            </p>
            <p className="m-0 text-gray-400">
              Avg Time: <span className="text-white">
                {data.avg_move_time ? data.avg_move_time.toFixed(1) + "s" : "N/A"}
              </span>
            </p>
          </>
        )}
      </div>
    );

    if (isMobile && containerRef?.current) {
      return ReactDOM.createPortal(content, containerRef.current);
    }

    return content;
  }
  return null;
}



function CustomEloTooltip({ active, payload, label, isMobile, containerRef }: any) {
  if (active && payload && payload.length > 0) {
    const formattedTime = new Date(label).toLocaleString([], { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
    const sortedPayload = [...payload].sort((a, b) => b.value - a.value);

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
    );

    // Only use portal for mobile
    if (isMobile && containerRef?.current) {
      return ReactDOM.createPortal(tooltipContent, containerRef.current);
    }

    return tooltipContent;
  }
  return null;
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

const calculateDomain = (eloValues: number[]) => {
  // Filter out undefined/null values to avoid computation errors
  const validEloValues = eloValues.filter(value => value !== undefined && value !== null);

  if (validEloValues.length === 0) return [0, 100]; // Default if no valid data is available

  const minValue = Math.min(...validEloValues);
  const maxValue = Math.max(...validEloValues);

  // If all values are identical, prevent a collapsed range
  if (minValue === maxValue) {
    return [minValue - 10, maxValue + 10];
  }

  // Check if there's any `comparisonElo`
  const hasComparisonElo = validEloValues.some(value => value !== minValue && value !== maxValue);

  if (!hasComparisonElo) {
    // No comparison model: use 20% above and below the mean Elo
    const meanValue = validEloValues.reduce((sum, val) => sum + val, 0) / validEloValues.length;
    const buffer = meanValue * 0.2; // 20% buffer

    return [Math.floor(meanValue - buffer), Math.ceil(meanValue + buffer)];
  }

  // Default behavior: Apply a small buffer (at least 5 Elo or 10% of the range)
  const buffer = Math.max(5, (maxValue - minValue) * 0.1);
  // return [Math.floor(minValue - buffer), Math.ceil(maxValue + buffer)];
  return [850, 1150];
};



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
  // First, add state for comparison model and available models
  const [comparisonModel, setComparisonModel] = useState<ModelData | null>(null);
  const [availableModels, setAvailableModels] = useState<{model_name: string}[]>([]);
  // second,
  const [selectedEnvs, setSelectedEnvs] = useState<string[]>([
    "Chess",
    "DontSayIt",
    "LiarsDice",
    "Negotiation",
    "Poker",
    "SpellingBee",
    "Stratego",
    "Tak",
    "TruthAndDeception",
    "UltimateTicTacToe"
  ]); // Or any two environments you prefer
  const [envEloHistory, setEnvEloHistory] = useState<EnvEloHistoryRow[]>([]);
  const [isLoadingEnvHistory, setIsLoadingEnvHistory] = useState(true);

  // Custom checkbox component for multi-select
  const CheckboxItem = React.forwardRef<HTMLDivElement, { checked: boolean; children: React.ReactNode }>(
    ({ checked, children, ...props }, ref) => (
      <div
        ref={ref}
        className={`relative flex items-center px-2 py-1.5 rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer ${
          checked ? 'bg-accent/50' : ''
        }`}
        {...props}
      >
        <div className="flex items-center gap-2">
          <div
            className={`h-4 w-4 border rounded flex items-center justify-center ${
              checked ? 'bg-primary border-primary' : 'border-input'
            }`}
          >
            {checked && (
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary-foreground"
              >
                <path
                  d="M8.5 2.5L3.5 7.5L1.5 5.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <span className="font-mono">{children}</span>
        </div>
      </div>
    )
  );
  CheckboxItem.displayName = "CheckboxItem";

  // Multi-select Environment component
  const EnvironmentSelect = ({ selectedEnvs, setSelectedEnvs }: { 
    selectedEnvs: string[], 
    setSelectedEnvs: (envs: string[]) => void 
  }) => {
    const [open, setOpen] = useState(false);
    const allEnvironments = Object.keys(envSubsets);

    const handleSelect = (env: string) => {
      if (selectedEnvs.includes(env)) {
        setSelectedEnvs(selectedEnvs.filter(e => e !== env));
      } else {
        setSelectedEnvs([...selectedEnvs, env]);
      }
    };

    return (
      <div className="flex items-center gap-2 mb-4">
        <div className="relative w-[280px]">
          <button
            onClick={() => setOpen(!open)}
            className="w-full bg-background text-navbarForeground border-navbar font-mono px-3 py-2 rounded-md flex items-center justify-between"
          >
            <span className="truncate">
              {selectedEnvs.length === 0
                ? "Select environments"
                : `${selectedEnvs.length} selected`}
            </span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`transform transition-transform ${open ? 'rotate-180' : ''}`}
            >
              <path
                d="M4 6L7.5 9L11 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          
          {open && (
            <div className="absolute z-50 w-full mt-1 bg-background border border-navbar rounded-md shadow-lg max-h-60 overflow-auto">
              {allEnvironments.map((env) => (
                <CheckboxItem
                  key={env}
                  checked={selectedEnvs.includes(env)}
                  onClick={() => handleSelect(env)}
                >
                  {env}
                </CheckboxItem>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Modify the chart data preparation
  const chartData = useMemo(() => {
    if (!envEloHistory || envEloHistory.length === 0) return [];

    const grouped: Record<string, any> = {};

    // Group by date and environment
    envEloHistory.forEach((row) => {
      const dt = new Date(row.interval_start);
      dt.setMinutes(0, 0, 0); // Normalize to the hour
      const dateKey = dt.toISOString();

      if (!grouped[dateKey]) {
        grouped[dateKey] = { date: dateKey };
      }

      // Use environment_name as the data key
      grouped[dateKey][row.environment_name] = row.elo_value;
    });

    // Sort by date
    return Object.values(grouped).sort(
      (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [envEloHistory]);

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

  // Update useEffect to fetch available models
  useEffect(() => {
    fetchModelDetails();
    fetchAvailableModels();
  }, []);

  // Separate effect for fetching environment history that depends on both model and selectedEnvs
  useEffect(() => {
    async function fetchData() {
      // Change the check to explicitly look for null/undefined instead of falsy values
      if (model?.id === null || model?.id === undefined) {
        console.log('No model ID found:', model);
        return;
      }
      
      setIsLoadingEnvHistory(true);
      
      try {
        // Debug log the model details including ID
        console.log('Model details:', {
          modelName: model.model_name,
          modelId: model.id,
          isIdZero: model.id === 0
        });
        
        const envNames = selectedEnvs.flatMap(subset => envSubsets[subset] || []);
        console.log('Environment names to query:', envNames);
        
        if (envNames.length === 0) {
          console.log('No environment names to query');
          setEnvEloHistory([]);
          setIsLoadingEnvHistory(false);
          return;
        }
    
        // Query environments table
        const { data: envData, error: envError } = await supabase
          .from("environments")
          .select("id, env_name")
          .in("env_name", envNames);
    
        if (envError) {
          console.error('Error querying environments:', envError);
          throw envError;
        }
    
        console.log('Environment query results:', envData);
        
        const envIds = (envData || []).map((env: any) => env.id);
        console.log('Environment IDs for RPC:', envIds);
        console.log('Model ID for RPC:', model.id);
    
        // Call the RPC function with explicit type casting for ID 0
        const { data, error } = await supabase.rpc(
          "get_new_elo_history_last7days_by_env",
          {
            selected_env_ids: envIds,
            selected_model_ids: [Number(model.id)] // Ensure it's treated as a number
          }
        );
    
        if (error) {
          console.error('RPC error:', error);
          throw error;
        }
    
        console.log('RPC Response:', {
          modelId: model.id,
          envIds,
          responseData: data,
          error,
          dataLength: data?.length,
          firstFewRecords: data?.slice(0, 3)
        });
    
        setEnvEloHistory(data || []);
      } catch (err) {
        console.error("Error in fetchData:", err);
      } finally {
        setIsLoadingEnvHistory(false);
      }
    }

    fetchData();
  }, [model?.id, selectedEnvs]); // Depend on both model ID and selected environments

  // Add function to fetch available models
  async function fetchAvailableModels() {
    try {
      const { data, error } = await supabase
        .from('models')
        .select('model_name')
        .order('model_name');
      
      if (error) throw error;
      setAvailableModels(data || []);
    } catch (err) {
      console.error("Error fetching available models:", err);
    }
  }

  // Add function to fetch comparison model
  async function fetchComparisonModel(modelNameToCompare: string) {
    try {
      const { data, error } = await supabase.rpc("get_model_details_by_name_v2", {
        model_name_param: modelNameToCompare,
      });

      if (error) throw error;
      if (!data || data.length === 0) {
        setComparisonModel(null);
        return;
      }

      // Process the data similarly to the main model
      const uniqueEnvs: Record<string, any> = {};
      (data[0].environment_performance || []).forEach((env: any) => {
        const key = env.name || env.env_name || "Unknown";
        if (!uniqueEnvs[key] || env.games > uniqueEnvs[key].games) {
          uniqueEnvs[key] = env;
        }
      });
      const dedupedEnvs = Object.values(uniqueEnvs);

      const rawModel = data[0];
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
      };

      setComparisonModel(processedModel);
    } catch (err) {
      console.error("Error fetching comparison model:", err);
      setComparisonModel(null);
    }
  }


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

  // Add dropdown component for model selection
  const ModelComparisonSelect = () => {
    // Ensure availableModels is sorted alphabetically (already done in fetchAvailableModels)
    const sortedModels = [...availableModels].sort((a, b) =>
      a.model_name.localeCompare(b.model_name)
    );
  
    // Separate "Humanity" and the rest
    const humanityModel = sortedModels.find(m => m.model_name === "Humanity");
    const otherModels = sortedModels.filter(
      m => m.model_name !== "Humanity" && m.model_name !== model.model_name
    );
  
    // Check if the current model is "Humanity"
    const isCurrentModelHumanity = model.model_name === "Humanity";
  
    return (
      <div className="flex items-center gap-2 mb-4">
        <Scale className="h-4 w-4 text-navbarForeground" />
        <Select
          onValueChange={(value) => {
            if (value === "none") {
              setComparisonModel(null);
            } else {
              fetchComparisonModel(value);
            }
          }}
          value={comparisonModel?.model_name || "none"}
        >
          <SelectTrigger className="w-[300px] bg-background text-navbarForeground border-navbar font-mono">
            <SelectValue placeholder="Compare with..." />
          </SelectTrigger>
          <SelectContent>
            {/* "None" option first */}
            <SelectItem value="none" className="font-mono">
              None
            </SelectItem>
            
            {/* "Humanity" option next, only if it’s not the current model */}
            {humanityModel && !isCurrentModelHumanity && (
              <SelectItem value="Humanity" className="font-mono">
                Humanity
              </SelectItem>
            )}
            
            {/* Remaining models in alphabetical order */}
            {otherModels.map(m => (
              <SelectItem key={m.model_name} value={m.model_name} className="font-mono">
                {m.model_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  // Modify the data structure to include both models' data
  const combinedSkillData = SKILLS.map(skill => {
    const mainModelSkill = buildSkillDistribution(model.environment_performance)
      .find(s => s.skill === skill) || { elo: 0, envs: [] };
      
    const comparisonModelSkill = comparisonModel 
      ? buildSkillDistribution(comparisonModel.environment_performance)
          .find(s => s.skill === skill) || { elo: 0, envs: [] }
      : { elo: 0, envs: [] };

    return {
      skill,
      mainElo: mainModelSkill.elo,
      comparisonElo: comparisonModelSkill.elo,
      // Keep the environment data for tooltips
      mainEnvs: mainModelSkill.envs,
      comparisonEnvs: comparisonModelSkill.envs
    };
  });

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
      <div className={`${isMobile ? "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" : "flex gap-6 mb-8 items-stretch"}`}>
        {/* Overall Statistics */}
        <Card className={`bg-[hsl(var(--navbar))] border-2 border-[hsl(var(--border))] ${isMobile ? "" : "max-w-[300px]"}`}>
          <CardHeader>
            <CardTitle className={`font-mono ${isMobile ? "text-lg" : "text-2xl"} font-semibold text-navbarForeground`}>
              Overall Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-1"} gap-2 sm:gap-4 font-mono ${isMobile ? "" : "text-base"}`}>
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
                  <span className="text-white">/</span>
                  <span className="text-white">{model.draws}</span>
                  <span className="text-white">/</span>
                  <span className="text-red-400">{model.losses}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Elo History */}
        <Card className={`bg-[hsl(var(--navbar))] border-2 border-[hsl(var(--border))] ${isMobile ? "" : "flex-grow"}`}>
          <CardHeader>
            <CardTitle className={`font-mono ${isMobile ? "text-lg" : "text-2xl"} font-semibold text-navbarForeground`}>
              Elo History by Environment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-4">
              <div className="relative z-30">
                <EnvironmentSelect
                  selectedEnvs={selectedEnvs}
                  setSelectedEnvs={setSelectedEnvs}
                />
              </div>
              {isMobile && (
                <div
                  ref={eloTooltipContainerRef}
                  className="absolute top-[130px] left-0 right-0 z-20 flex justify-center items-center h-[20px] bg-[hsl(var(--navbar))] bg-opacity-95 transition-all duration-200 p-1"
                />
              )}
              <div className={isMobile ? "overflow-x-auto relative z-10" : ""}>
                <div style={{ width: isMobile ? Math.max(400, model.elo_history.length * 1.5) : "100%", height: 450 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{
                        top: isMobile ? 200 : 20,  // Moves chart lower in mobile
                        right: 30,
                        left: 20,
                        bottom: 50,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        stroke="white"
                        tickFormatter={(tick) =>
                          new Date(tick).toLocaleString([], {
                            month: "numeric",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
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
                        position={isMobile ? { x: 0, y: 0 } : undefined} // Moves tooltip 50px higher in mobile
                      />
                      {!isMobile && (
                        <Legend
                          align="center"
                          verticalAlign="top"
                          wrapperStyle={{ 
                            color: "white", 
                            fontFamily: "var(--font-mono)",
                            fontSize: isMobile ? 10 : 12,
                            marginTop:isMobile ?  "-35px"  : "-20px"  // Add this to move it higher
                          }}
                        />
                      )}
                      {/* Dynamically create lines for each selected environment */}
                      {selectedEnvs.flatMap(subset => envSubsets[subset] || []).map((envName, index) => (
                        <Line
                          key={envName}
                          type="monotone"
                          dataKey={envName}
                          name={envName}
                          stroke={CHART_COLORS[index % CHART_COLORS.length]}
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: isMobile ? 6 : 8 }}
                        />

                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            {isMobile && (
              <div className="text-xs text-muted-foreground font-mono mt-2 text-right">
                Scroll to see more →
              </div>
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
            <div className="relative">
              <div className="relative z-20">
                <ModelComparisonSelect />
              </div>
              {isMobile && (
                <div
                  ref={RadarTooltipContainerRef}
                  className="absolute top-[60px] left-0 right-0 z-10 flex justify-center items-start h-[120px] bg-[hsl(var(--navbar))] bg-opacity-95 transition-all duration-200 py-2 px-4 overflow-y-auto pointer-events-auto border border-[hsl(var(--border))] rounded-lg"
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
                  style={{ minHeight: '400px' }} 
                >
                  <div 
                    style={{ 
                      width: isMobile ? "350px" : "100%",  // Change from 400px to 350px
                      height: 400, 
                      paddingTop: isMobile ? "150px" : 0,
                      margin: "0 auto",
                      minWidth: isMobile ? "300px" : "auto" 
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart 
                        data={combinedSkillData}
                        margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
                        outerRadius={isMobile ? 90 : chartRadius}
                      >
                        <PolarGrid stroke="white" radialLines={true} />
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
                          radius={isMobile ? 90 : chartRadius}
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
                          domain={calculateDomain(combinedSkillData.flatMap(item => [item.mainElo, item.comparisonElo]))}
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
                        {/* Main model radar */}
                        <Radar 
                          name={model.model_name}
                          dataKey="mainElo" 
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
                        {/* Comparison model radar */}
                        {comparisonModel && (
                          <Radar
                            name={comparisonModel.model_name}
                            dataKey="comparisonElo"
                            stroke="#82ca9d"
                            fill="#82ca9d"
                            fillOpacity={0.6}
                            className="cursor-pointer"
                            radiusScale={0.75}
                            activeDot={{
                              r: isMobile ? 4 : 6,
                              stroke: "white",
                              strokeWidth: 2,
                              fill: "#82ca9d",
                            }}
                          />
                        )}
                        <Legend 
                          align="center"
                          verticalAlign="top"
                          wrapperStyle={{ 
                            color: "white", 
                            fontFamily: "var(--font-mono)",
                            fontSize: isMobile ? 9 : 11,
                            marginTop:isMobile ?  "-35px"  : "-20px"  // Add this to move it higher
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
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

