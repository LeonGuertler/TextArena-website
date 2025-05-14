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

const RADAR_COLORS = {
  main: "#8884d8", // Purple for main model
  comparison1: "#82ca9d", // Green for first comparison
  comparison2: "#ffc658", // Yellow/Orange for second comparison
  comparison3: "#ff8042"  // Orange/Red for third comparison
};

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

// -------------------------------------------------------------------
// 2. Type Definitions
// -------------------------------------------------------------------

// New type definition for environment history
interface EnvTrueskillHistoryRow {
  model_id: number;
  model_name: string;
  interval_start: string;
  environment_name: string;
  trueskill_value: number;
  trueskill_sd_value: number;
}

interface ModelData {
  id: number
  model_name: string
  human_name?: string // Add this field
  description?: string
  trueskill: number
  games_played: number
  win_rate: number
  wins: number
  draws: number
  losses: number
  avg_time: number
  human_id?: number
  trueskill_history: {
    interval_start: string
    avg_trueskill: number
    avg_sd: number
  }[]
  environment_performance: {
    name: string
    trueskill: number
    games: number
    win_rate: number
    avg_move_time: number
    wins: number
    draws: number
    losses: number
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
    is_balancedsubset?: boolean
  }[]
  recent_games: {
    game_id: number
    environment: string
    game_start_time: string
    opponent_name: string
    trueskill_change: number
    outcome: string
    reason: string
  }[]
}

interface ModelDetailsProps {
  modelName: string;
  modelId: string | number;
  humanId: string | number;
  subset: string; // Add this line
}

interface AvailableModel {
  model_name: string;
  model_id: number;
  human_id: number;
  is_human: boolean;
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
        
        // Get all environments from all models, but filter to only those with is_balancedsubset=true
        const allEnvNames = new Set<string>();
        
        // Helper function to filter and add environments
        const addFilteredEnvs = (envs) => {
          if (!envs) return;
          
          // Only add environments where is_balancedsubset is true
          envs.filter(env => env.is_balancedsubset === true)
            .forEach(env => allEnvNames.add(env.name));
        };
        
        // Collect environment names from each model (only balanced subsets)
        addFilteredEnvs(data.mainEnvs);
        addFilteredEnvs(data.comparisonEnvs);
        addFilteredEnvs(data.comparisonEnvs2);
        addFilteredEnvs(data.comparisonEnvs3);
        
        // Convert to array and sort alphabetically
        const allEnvironments = [...allEnvNames].sort();
        
        // Get color mapping from the window object (set by sortModelsByArea)
        const colorMapping = window.radarColorMapping || {
          mainTrueskill: RADAR_COLORS.main,
          comparisonTrueskill: RADAR_COLORS.comparison1,
          comparisonTrueskill2: RADAR_COLORS.comparison2,
          comparisonTrueskill3: RADAR_COLORS.comparison3
        };
        
        // Create models array with the data that's needed
        const modelList = [];
        
        // For each model, get the name from the payload which should now include the correct human name if applicable
        // Add main model if it has data
        if (data.mainTrueskill > 0) {
          const mainModelPayload = payload.find(p => p.dataKey === 'mainTrueskill');
          modelList.push({ 
            name: mainModelPayload?.name || 'Main Model',
            color: colorMapping.mainTrueskill,
            trueskill: data.mainTrueskill,
            envs: data.mainEnvs ? data.mainEnvs.filter(env => env.is_balancedsubset === true) : [],
            dataKey: 'mainTrueskill'
          });
        }
        
        // Add comparison models if they have data
        if (data.comparisonTrueskill > 0) {
          const comp1Payload = payload.find(p => p.dataKey === 'comparisonTrueskill');
          modelList.push({ 
            name: comp1Payload?.name || 'Comparison 1',
            color: colorMapping.comparisonTrueskill,
            trueskill: data.comparisonTrueskill,
            envs: data.comparisonEnvs ? data.comparisonEnvs.filter(env => env.is_balancedsubset === true) : [],
            dataKey: 'comparisonTrueskill'
          });
        }
        
        if (data.comparisonTrueskill2 > 0) {
          const comp2Payload = payload.find(p => p.dataKey === 'comparisonTrueskill2');
          modelList.push({ 
            name: comp2Payload?.name || 'Comparison 2',
            color: colorMapping.comparisonTrueskill2,
            trueskill: data.comparisonTrueskill2,
            envs: data.comparisonEnvs2 ? data.comparisonEnvs2.filter(env => env.is_balancedsubset === true) : [],
            dataKey: 'comparisonTrueskill2'
          });
        }
        
        if (data.comparisonTrueskill3 > 0) {
          const comp3Payload = payload.find(p => p.dataKey === 'comparisonTrueskill3');
          modelList.push({ 
            name: comp3Payload?.name || 'Comparison 3',
            color: colorMapping.comparisonTrueskill3,
            trueskill: data.comparisonTrueskill3,
            envs: data.comparisonEnvs3 ? data.comparisonEnvs3.filter(env => env.is_balancedsubset === true) : [],
            dataKey: 'comparisonTrueskill3'
          });
        }
        
        // Sort models by skill trueskill (highest first) for display
        const models = modelList.sort((a, b) => b.trueskill - a.trueskill);

        // The rest of the component remains unchanged as it uses the names from the sorted models array
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

            {/* Overall Trueskill Comparison */}
            <div className="flex justify-between border-t border-b border-muted-foreground py-2 min-h-[80px]">
              <div className="grid grid-cols-2 gap-4 w-full">
                {models.map((model, idx) => (
                  <div key={idx} className="min-w-0 flex-1 flex flex-col justify-between">
                    <div 
                      className={`font-semibold ${isMobile ? "text-[10px]" : "text-xs"} break-words ${idx % 2 === 0 ? "text-left" : "text-right"}`} 
                      style={{ color: model.color }}
                    >
                      {model.name}
                    </div>
                    <div className={`font-bold ${isMobile ? "text-[12px]" : "text-lg"} whitespace-nowrap ${idx % 2 === 0 ? "text-left" : "text-right"}`}
                         style={{ color: model.color }}>
                      {model.trueskill.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Environments Section - Only showing balanced subsets */}
            <div>
              <div className={`text-muted-foreground font-semibold mb-2 ${isMobile ? "text-[9px]" : "text-xs"}`}>
                Environment Contributions (Balanced Subsets Only)
              </div>
              
              <div className={`space-y-2 ${isMobile ? "text-[8px]" : "text-[10px]"}`}>
                {allEnvironments.map((envName) => {
                  // Get this environment's data for each model
                  const modelEnvData = models.map(model => {
                    const env = model.envs.find(e => e.name === envName);
                    return {
                      modelName: model.name,
                      color: model.color,
                      dataKey: model.dataKey,
                      trueskill: env?.trueskill || 0,
                      relativeWeight: env?.relativeWeight || 0,
                      hasData: !!env
                    };
                  });
                  
                  // Filter to only models that have data for this environment
                  const modelsWithData = modelEnvData.filter(m => m.hasData);
                  
                  // Only show environments that at least one model has data for
                  if (modelsWithData.length === 0) return null;
                  
                  // Find the model with highest trueskill for this environment
                  const highestTrueskillModel = [...modelsWithData].sort((a, b) => b.trueskill - a.trueskill)[0];
                  
                  // Find the percentage for the main model (using payload[0] which should be the main model)
                  const mainModelData = modelEnvData.find(m => m.dataKey === 'mainTrueskill');
                  const mainModelPercentage = mainModelData?.hasData 
                    ? `(${(mainModelData.relativeWeight * 100).toFixed(0)}%)` 
                    : '';
                  
                  return (
                    <div key={envName} className="grid grid-cols-[150px,1fr] gap-2 items-baseline">
                      {/* Environment name and percentage - Fixed width */}
                      <div className="text-navbar-foreground font-medium flex items-baseline">
                        <div className="truncate mr-1">{envName.replace(/-/g, "\u200B-")}</div>
                        <span className="text-muted-foreground font-medium text-[7px] flex-shrink-0">
                          {mainModelPercentage}
                        </span>
                      </div>
                      
                      {/* Model values - Fixed column layout */}
                      <div className="grid grid-cols-4 gap-1">
                        {models.map((model, idx) => {
                          const modelData = modelEnvData.find(m => m.dataKey === model.dataKey);
                          if (!modelData || !modelData.hasData) {
                            return <div key={idx} className="text-right">-</div>;
                          }
                          
                          return (
                            <div 
                              key={idx} 
                              className={`text-right font-mono ${modelData.trueskill === highestTrueskillModel.trueskill ? "underline" : ""}`}
                              style={{ color: model.color }}
                            >
                              {modelData.trueskill.toFixed(1)}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }).filter(Boolean)}
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
        <p className="m-0" style={{ color: "#8884d8" }}> {/* Purple for Trueskill */}
          Trueskill: {data.trueskill.toFixed(1)}
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



function CustomTrueskillTooltip({ active, payload, label, isMobile, containerRef }: any) {
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
            {/* Display both Trueskill value and SD */}
            {entry.value.toFixed(1)} ± {entry.payload[entry.dataKey + '_sd'].toFixed(1) || 'N/A'}: {entry.name}
          </p>
        ))}
        {/* Optional: Add explanation of Trueskill SD */}
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


// -------------------------------------------------------------------
// 4. Build Skill Distribution (New Weighted Calculation Per Environment)
// -------------------------------------------------------------------
function buildSkillDistribution(environments: ModelData["environment_performance"]) {
  // First, filter to only include environments with is_balancedsubset = true
  const balancedEnvironments = environments.filter(env => env.is_balancedsubset === true);
  
  // Initialize aggregation structure
  const agg: Record<string, { weightedTrueskill: number; totalWeight: number; envs: EnvContribution[] }> = {}
  SKILLS.forEach((skill) => {
    agg[skill] = { weightedTrueskill: 0, totalWeight: 0, envs: [] }
  })

  // Now process only the balanced environments
  balancedEnvironments.forEach((env) => {
    // Loop through up to five possible skill fields.
    for (let i = 1; i <= 5; i++) {
      const skillKey = `skill_${i}` as keyof typeof env
      const weightKey = `skill_${i}_weight` as keyof typeof env
      const skillValue = env[skillKey] as string | undefined
      const rawWeight = env[weightKey]
      if (skillValue && rawWeight && Number(rawWeight) > 0) {
        const normalizedSkill = skillValue
        if (SKILLS.includes(normalizedSkill)) {
          const weight = Number(rawWeight)
          agg[normalizedSkill].weightedTrueskill += env.trueskill * weight
          agg[normalizedSkill].totalWeight += weight
          agg[normalizedSkill].envs.push({ 
            name: env.name, 
            trueskill: env.trueskill, 
            weight, 
            is_balancedsubset: env.is_balancedsubset
          })
        }
      }
    }
  })

  // Compute each environment's relative weight and return final results
  return SKILLS.map((skill) => {
    const { weightedTrueskill, totalWeight, envs } = agg[skill]
    const envsWithRelative = envs.map((env) => ({
      name: env.name,
      trueskill: env.trueskill,
      weight: env.weight,
      relativeWeight: totalWeight > 0 ? env.weight / totalWeight : 0,
      is_balancedsubset: env.is_balancedsubset
    }))
    return {
      skill,
      trueskill: totalWeight > 0 ? weightedTrueskill / totalWeight : 0,
      totalWeight,
      envs: envsWithRelative,
    }
  })
}

const calculateDomain = (trueskillValues: number[]) => {
  // Filter out undefined/null/zero values to avoid computation errors
  const validTrueskillValues = trueskillValues.filter(value => value !== undefined && value !== null && value > 0);

  if (validTrueskillValues.length === 0) return [0, 100]; // Default if no valid data is available

  const minValue = Math.min(...validTrueskillValues);
  const maxValue = Math.max(...validTrueskillValues);

  // If all values are identical, prevent a collapsed range
  if (minValue === maxValue) {
    return [minValue - 10, maxValue + 10];
  }

  // Check if there's more than one model being compared
  const hasMultipleModels = validTrueskillValues.length > SKILLS.length;

  if (!hasMultipleModels) {
    // Only one model: use 20% buffer around the mean Trueskill
    const meanValue = validTrueskillValues.reduce((sum, val) => sum + val, 0) / validTrueskillValues.length;
    const buffer = meanValue * 0.2; // 20% buffer

    // return [Math.floor(meanValue - buffer), Math.ceil(meanValue + buffer)];
    return [0, Math.ceil(meanValue + buffer)];
  }

  // Multiple models: Apply a reasonable buffer
  const buffer = Math.max(1, (maxValue - minValue) * 0.1);
  // You could replace this with a fixed range if preferred
  // return [Math.floor(minValue - 2 * buffer), Math.ceil(maxValue + buffer)];
  // Or use a predefined range like:
  return [0, Math.ceil(maxValue + buffer)];
};




export function ModelDetails({ modelName, modelId, humanId, subset }: ModelDetailsProps) {
  const router = useRouter()
  const [model, setModel] = useState<ModelData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [envSubsets, setEnvSubsets] = useState<Record<string, string[]>>({})

  const [hoveredEnvironment, setHoveredEnvironment] = useState<string | null>(null);

  const isMobile = useIsMobile()
  const trueskillTooltipContainerRef = useRef<HTMLDivElement>(null)
  const envTooltipContainerRef = useRef<HTMLDivElement>(null)
  const RadarTooltipContainerRef = useRef<HTMLDivElement>(null)
  const chartContainerRef = useRef(null);
  const [chartRadius, setChartRadius] = useState(isMobile ? 90 : 150);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // First, add state for comparison model and available models
  const [comparisonModel, setComparisonModel] = useState<ModelData | null>(null);
  const [comparisonModel2, setComparisonModel2] = useState<ModelData | null>(null);
  const [comparisonModel3, setComparisonModel3] = useState<ModelData | null>(null);
  const [availableModels, setAvailableModels] = useState<AvailableModel[]>([]);
  // second,
  const [selectedEnvs, setSelectedEnvs] = useState<string[]>([
    "SecretMafia-v0 (5 Players)",
    "DontSayIt-v0 (2 Players)",
    "Poker-v0 (2 Players)",
    "Snake-v0 (2 Players)",
    "TicTacToe-v0 (2 Players)",
    "BlindAuction-v0 (5 Players)",
    "Chess-v0 (2 Players)",
    "PigDice-v0 (2 Players)",
    "LiarsDice-v0 (2 Players)",
    "IteratedRockPaperScissors-v0 (2 Players)",
    "Snake-v0 (2 Players)",
    "Othello-v0 (2 Players)",
  ]); // Or any two environments you prefer
  const [envTrueskillHistory, setEnvTrueskillHistory] = useState<EnvTrueskillHistoryRow[]>([]);
  const [isLoadingEnvHistory, setIsLoadingEnvHistory] = useState(true);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
  
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const CustomLegendContent = (props: any) => {
    const { payload } = props;
    
    return (
      <ul className="flex flex-wrap justify-center items-center gap-3 px-2 py-1 m-0 text-xs">
        {payload.map((entry: any, index: number) => (
          <li 
            key={`item-${index}`}
            className="flex items-center cursor-pointer transition-opacity duration-200"
            style={{ 
              opacity: hoveredEnvironment === null || hoveredEnvironment === entry.value ? 1 : 0.4 
            }}
            onMouseEnter={() => setHoveredEnvironment(entry.value)}
            onMouseLeave={() => setHoveredEnvironment(null)}
          >
            <span 
              className="inline-block w-3 h-3 mr-1"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-navbarForeground font-mono">
              {entry.value}
            </span>
          </li>
        ))}
      </ul>
    );
  };


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

  // Modify the chart data preparation
  const chartData = useMemo(() => {
    if (!envTrueskillHistory || envTrueskillHistory.length === 0) {
      console.log("No environment trueskill history data available");
      return [];
    }
  
    console.log("Processing trueskill history data:", envTrueskillHistory.slice(0, 3));
  
    const grouped: Record<string, any> = {};
  
    // Group by date and environment
    envTrueskillHistory.forEach((row) => {
      const dt = new Date(row.interval_start);
      dt.setMinutes(0, 0, 0); // Normalize to the hour
      const dateKey = dt.toISOString();
  
      if (!grouped[dateKey]) {
        grouped[dateKey] = { date: dateKey };
      }
  
      // Make sure environment_name exists in the data
      if (!row.environment_name) {
        console.warn("Missing environment_name in data row:", row);
        return; // Skip this row
      }
  
      // Store both trueskill_value and trueskill_sd_value
      grouped[dateKey][row.environment_name] = row.trueskill_value;
      grouped[dateKey][`${row.environment_name}_sd`] = row.trueskill_sd_value;
    });
  
    // Log the final grouped data structure
    const result = Object.values(grouped).sort(
      (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    console.log(`Final chart data: ${result.length} points`);
    if (result.length > 0) {
      console.log("Sample chart data point:", result[0]);
      // Check what environment keys exist in the first data point
      console.log("Environment keys in data:", 
        Object.keys(result[0]).filter(k => k !== 'date' && !k.endsWith('_sd'))
      );
    }
    
    return result;
  }, [envTrueskillHistory]);

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
    fetchEnvSubsets();
  }, [modelId, humanId]); // Add dependencies

  // Separate effect for fetching environment history that depends on both model and selectedEnvs
  useEffect(() => {
    async function fetchData() {
      if (
        model?.id == null ||
        Object.keys(envSubsets).length === 0
      ) {
        console.log('Model or envSubsets not ready:', model, envSubsets);
        return;
      }
  
      setIsLoadingEnvHistory(true);
  
      try {
        const envIds = selectedEnvs.flatMap(subset => envSubsets[subset] || []);
        console.log('Environment IDs to query:', envIds);
  
        if (envIds.length === 0) {
          setEnvTrueskillHistory([]);
          setIsLoadingEnvHistory(false);
          return;
        }
  
        const { data, error } = await supabase.rpc(
          "get_new_trueskill_humans_models_history_last7days_by_env",
          {
            selected_env_ids: envIds.map(id => parseInt(id, 10)),
            selected_model_ids: [Number(model.id)],
            selected_human_ids: [Number(humanId)],
          }
        );
  
        if (error) throw error;
  
        setEnvTrueskillHistory(data || []);
      } catch (err) {
        console.error("Error in fetchData:", err);
      } finally {
        setIsLoadingEnvHistory(false);
      }
    }
  
    fetchData();
  }, [model?.id, selectedEnvs, humanId, envSubsets]); // <--- add envSubsets here
  

  // Add function to fetch available models
  async function fetchAvailableModels() {
    try {
      console.log("Fetching available models with subset:", subset);
      
      // First, fetch AI models
      const { data: aiModels, error: aiError } = await supabase
        .from('models')
        .select('model_name, id')
        .or('is_standard.eq.true,model_name.eq.Humanity')
        .neq('model_name', 'Humanity')  // Added this line to exclude Humanity
        .order('model_name');
      
      if (aiError) throw aiError;
      
      // Prepare AI models with human_id = 0
      const aiModelsList = (aiModels || []).map(model => ({
        model_name: model.model_name,
        model_id: model.id,
        human_id: 0,
        is_human: false
      }));
      
      // Then, fetch human models using the RPC function
      const { data: humanModels, error: humanError } = await supabase.rpc(
        "get_leaderboard_from_mv_trueskill_humans_models",
        { skill_subset: subset || "Balanced Subset" }
      );
      
      if (humanError) throw humanError;
      
      // Filter and format human models
      const humanModelsList = (humanModels || [])
        .filter(model => model.model_id === 0) // Only include humans (model_id = 0)
        .map(model => ({
          model_name: model.model_name, // Already formatted with rank in the RPC
          model_id: 0,
          human_id: model.human_id,
          is_human: true
        }));
      
      // Combine the lists, placing Humanity models at the top
      const combinedModels = [...humanModelsList, ...aiModelsList];
      
      // Sort the final list to ensure Humanity models appear first
      const sortedModels = combinedModels.sort((a, b) => {
        // First, prioritize human models
        if (a.is_human && !b.is_human) return -1;
        if (!a.is_human && b.is_human) return 1;
        
        // Then sort alphabetically within each group
        return a.model_name.localeCompare(b.model_name);
      });
      
      console.log("Available models:", sortedModels);
      setAvailableModels(sortedModels);
    } catch (err) {
      console.error("Error fetching available models:", err);
    }
  }

  // Add this function after your other useEffect hooks
  async function fetchEnvSubsets() {
    try {
      const { data, error } = await supabase.rpc('get_env_subsets');
      
      if (error) throw error;
      
      console.log("Raw environment subsets data:", data);
      
      // Filter only subsets with "Players" in the name
      const filteredData = (data || []).filter(item => 
        item.subset_type.includes('Players')
      );
      
      console.log("Filtered environment subsets:", filteredData);
      
      // Transform the data into the format we need
      const formattedSubsets: Record<string, string[]> = {};
      filteredData.forEach(item => {
        formattedSubsets[item.subset_type] = item.environment_ids;
      });
      
      console.log("Formatted environment subsets:", formattedSubsets);
      
      setEnvSubsets(formattedSubsets);
      
      // If no environments are currently selected, select a few by default
      if (selectedEnvs.length === 0 && Object.keys(formattedSubsets).length > 0) {
        // Take the first 5 environments or all if less than 5
        const initialEnvs = Object.keys(formattedSubsets).slice(0, 5);
        setSelectedEnvs(initialEnvs);
        console.log("Selected initial environments:", initialEnvs);
      }
    } catch (err) {
      console.error("Error fetching environment subsets:", err);
    }
  }

  // Add function to fetch comparison model
  async function fetchComparisonModel(modelId: number, humanId: number, setModelFunction: (model: ModelData | null) => void) {
    try {
      if (modelId === 0 && humanId === 0) {
        setModelFunction(null);
        return;
      }
      
      console.log(`Fetching comparison model with modelId: ${modelId}, humanId: ${humanId}`);
      
      // For humans (model_id = 0), we're passing the human_id directly
      // For models, we're passing model_id and human_id = 0
      const { data, error: detailsError } = await supabase.rpc("get_model_details_by_id_v4", {
        model_id_param: modelId,
        human_id_param: humanId
      });
      
      if (detailsError) {
        console.error("Error fetching model details:", detailsError);
        throw detailsError;
      }
      
      if (!data || data.length === 0) {
        console.log("No model details found");
        setModelFunction(null);
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
        trueskill: rawModel.trueskill,
        games_played: rawModel.games_played,
        win_rate: rawModel.win_rate,
        wins: rawModel.wins,
        draws: rawModel.draws,
        losses: rawModel.losses,
        avg_time: rawModel.avg_time,
        trueskill_history: rawModel.trueskill_history,
        environment_performance: dedupedEnvs,
        recent_games: rawModel.recent_games,
        id: rawModel.id,
        human_id: rawModel.human_id, // Store the human_id in the model data
        human_name: rawModel.human_name
      };
      
      setModelFunction(processedModel);
    } catch (err) {
      console.error("Error fetching comparison model:", err);
      setModelFunction(null);
    }
  }


  async function fetchModelDetails() {
    try {
      setError(null);
      setLoading(true);
      console.log("Fetching details for model:", modelName, "with ID:", modelId, "and human ID:", humanId);
      
      const { data, error } = await supabase.rpc("get_model_details_by_id_v4", {
        model_id_param: Number(modelId),
        human_id_param: Number(humanId)
      });
  
      if (error) {
        console.error("Database error:", error);
        throw error;
      }
      if (!data || data.length === 0) {
        setModel(null);
        return;
      }
  
      // Process the data as before
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
        human_name: rawModel.human_name, // Include human_name
        description: rawModel.description,
        trueskill: rawModel.trueskill,
        games_played: rawModel.games_played,
        win_rate: rawModel.win_rate,
        wins: rawModel.wins,
        draws: rawModel.draws,
        losses: rawModel.losses,
        avg_time: rawModel.avg_time,
        trueskill_history: rawModel.trueskill_history,
        environment_performance: dedupedEnvs,
        recent_games: rawModel.recent_games,
        id: rawModel.id,
        human_id: rawModel.human_id, // Make sure human_id is included
      };
  
      setModel(processedModel);
    } catch (err) {
      console.error("Error fetching model:", err);
      setError("Could not load model details.");
    } finally {
      setLoading(false);
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

  const averageEnvTrueskill =
    model.environment_performance.length > 0
      ? model.environment_performance.reduce((sum, env) => sum + env.trueskill, 0) / model.environment_performance.length
      : model.trueskill

  // Add dropdown component for model selection
  const ModelComparisonSelect = () => {
    // First, ensure we have the models sorted appropriately (humans at the top)
    const sortedModels = [...availableModels].sort((a, b) => {
      // Humans first
      if (a.is_human && !b.is_human) return -1;
      if (!a.is_human && b.is_human) return 1;
      
      // Then sort alphabetically within each group
      return a.model_name.localeCompare(b.model_name);
    });
    
    // Create a filtered list for each dropdown that excludes already selected models
    const getFilteredModels = (excludeModels: any[]) => {
      // Extract unique identifiers for excluded models
      const excludedIds = excludeModels.map(m => 
        `${m?.model_id}-${m?.human_id}`
      ).filter(Boolean);
      
      // Current model identifier
      const currentModelId = `${model?.id}-${humanId}`;
      
      // Filter out current model and already selected models
      return sortedModels.filter(m => {
        const modelIdentifier = `${m.model_id}-${m.human_id}`;
        return modelIdentifier !== currentModelId && !excludedIds.includes(modelIdentifier);
      });
    };
    
    // Get filtered lists for each dropdown
    const dropdown1Models = getFilteredModels([]);
    const dropdown2Models = getFilteredModels([comparisonModel]);
    const dropdown3Models = getFilteredModels([comparisonModel, comparisonModel2]);
  
    return (
      <div className="space-y-4">
        {/* Updated information notice with refined styling */}
        <div className="bg-[#1a2e35] border border-[#2a3f4a] rounded-md p-3">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8899aa]">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </div>
            <div className="text-sm font-mono text-white">
              <p className="text-xs leading-relaxed">
                Model comparisons are based on the <span className="font-bold text-[#06b6d4]">{subset || "Balanced Subset"}</span> context. 
                Human players (appearing as "Humanity") reflect rankings specific to this subset. 
                Different subset selections may yield different relative performance metrics.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-navbarForeground" />
          <span className="text-navbarForeground font-mono">Compare with up to 3 models</span>
        </div>
        
        {/* Horizontal layout for desktop, vertical for mobile */}
        <div className={isMobile ? 'flex flex-col space-y-2' : 'flex flex-row space-x-4 items-start'}>
          {/* First comparison dropdown */}
          <div className={`flex items-center gap-2`}>
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: RADAR_COLORS.comparison1 }}></div>
            <Select
              onValueChange={(value) => {
                if (value === "none") {
                  setComparisonModel(null);
                  setComparisonModel2(null);
                  setComparisonModel3(null);
                  return;
                }
                
                // Parse the value to get model_id and human_id
                const [modelId, humanId] = value.split('-').map(Number);
                
                // Fetch the comparison model with the selected IDs
                fetchComparisonModel(modelId, humanId, setComparisonModel);
              }}
              value={comparisonModel ? `${comparisonModel.id}-${comparisonModel.human_id || 0}` : "none"}
            >
              <SelectTrigger className={`${isMobile ? 'w-full' : 'w-[200px]'} bg-background text-navbarForeground border-navbar font-mono text-sm`}>
                <SelectValue placeholder="First model..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" className="font-mono">None</SelectItem>
                
                {dropdown1Models.map(m => (
                  <SelectItem 
                    key={`${m.model_id}-${m.human_id}`} 
                    value={`${m.model_id}-${m.human_id}`} 
                    className="font-mono"
                  >
                    {m.model_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Second comparison dropdown - only show if first comparison is selected */}
          {comparisonModel && (
            <div className={`flex items-center gap-2`}>
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: RADAR_COLORS.comparison2 }}></div>
              <Select
                onValueChange={(value) => {
                  if (value === "none") {
                    setComparisonModel2(null);
                    setComparisonModel3(null);
                    return;
                  }
                  
                  // Parse the value to get model_id and human_id
                  const [modelId, humanId] = value.split('-').map(Number);
                  
                  // Fetch the comparison model with the selected IDs
                  fetchComparisonModel(modelId, humanId, setComparisonModel2);
                }}
                value={comparisonModel2 ? `${comparisonModel2.id}-${comparisonModel2.human_id || 0}` : "none"}
              >
                <SelectTrigger className={`${isMobile ? 'w-full' : 'w-[200px]'} bg-background text-navbarForeground border-navbar font-mono text-sm`}>
                  <SelectValue placeholder="Second model..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="font-mono">None</SelectItem>
                  
                  {dropdown2Models.map(m => (
                    <SelectItem 
                      key={`${m.model_id}-${m.human_id}`} 
                      value={`${m.model_id}-${m.human_id}`} 
                      className="font-mono"
                    >
                      {m.model_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Third comparison dropdown - only show if second comparison is selected */}
          {comparisonModel2 && (
            <div className={`flex items-center gap-2`}>
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: RADAR_COLORS.comparison3 }}></div>
              <Select
                onValueChange={(value) => {
                  if (value === "none") {
                    setComparisonModel3(null);
                    return;
                  }
                  
                  // Parse the value to get model_id and human_id
                  const [modelId, humanId] = value.split('-').map(Number);
                  
                  // Fetch the comparison model with the selected IDs
                  fetchComparisonModel(modelId, humanId, setComparisonModel3);
                }}
                value={comparisonModel3 ? `${comparisonModel3.id}-${comparisonModel3.human_id || 0}` : "none"}
              >
                <SelectTrigger className={`${isMobile ? 'w-full' : 'w-[200px]'} bg-background text-navbarForeground border-navbar font-mono text-sm`}>
                  <SelectValue placeholder="Third model..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="font-mono">None</SelectItem>
                  
                  {dropdown3Models.map(m => (
                    <SelectItem 
                      key={`${m.model_id}-${m.human_id}`} 
                      value={`${m.model_id}-${m.human_id}`} 
                      className="font-mono"
                    >
                      {m.model_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Modify the data structure to include both models' data
  const combinedSkillData = SKILLS.map(skill => {
    const mainModelSkill = buildSkillDistribution(model.environment_performance)
      .find(s => s.skill === skill) || { trueskill: 0, envs: [] };
      
    const comparisonModelSkill = comparisonModel 
      ? buildSkillDistribution(comparisonModel.environment_performance)
          .find(s => s.skill === skill) || { trueskill: 0, envs: [] }
      : { trueskill: 0, envs: [] };
      
    const comparisonModel2Skill = comparisonModel2 
      ? buildSkillDistribution(comparisonModel2.environment_performance)
          .find(s => s.skill === skill) || { trueskill: 0, envs: [] }
      : { trueskill: 0, envs: [] };
      
    const comparisonModel3Skill = comparisonModel3 
      ? buildSkillDistribution(comparisonModel3.environment_performance)
          .find(s => s.skill === skill) || { trueskill: 0, envs: [] }
      : { trueskill: 0, envs: [] };
  
    return {
      skill,
      mainTrueskill: mainModelSkill.trueskill,
      comparisonTrueskill: comparisonModelSkill.trueskill,
      comparisonTrueskill2: comparisonModel2Skill.trueskill,
      comparisonTrueskill3: comparisonModel3Skill.trueskill,
      // Keep the environment data for tooltips
      mainEnvs: mainModelSkill.envs,
      comparisonEnvs: comparisonModelSkill.envs,
      comparisonEnvs2: comparisonModel2Skill.envs,
      comparisonEnvs3: comparisonModel3Skill.envs
    };
  });

  // This function will sort models by their ELO values across all skills
  const sortModelsByArea = (mainModel, compModel1, compModel2, compModel3, skillData) => {
    // Calculate total area (sum of all ELO values) for each model
    const calculateArea = (dataKey) => {
      return skillData.reduce((sum, item) => sum + (item[dataKey] || 0), 0);
    };
  
    // Find the available model from dropdown selection by model_id and human_id
    const findAvailableModel = (model) => {
      if (!model || !availableModels) return null;
      
      // For human models (model_id = 0), find the matching entry in availableModels
      if (model.id === 0) {
        return availableModels.find(m => 
          m.is_human && m.human_id === model.human_id
        );
      }
      
      // For AI models, find by model_id
      return availableModels.find(m => 
        !m.is_human && m.model_id === model.id
      );
    };
  
    // Helper function to get the display name based on model info
    const getDisplayName = (model) => {
      // For humans, try to get the dropdown selection name first
      if (model.id === 0) {
        const availableModel = findAvailableModel(model);
        if (availableModel && availableModel.model_name) {
          return availableModel.model_name; // Use the dropdown selection name (e.g., "Humanity 1st")
        }
      }
      
      // Fallback to model_name if no dropdown selection is found
      return model.model_name;
    };
  
    // Create array of models with their areas
    const models = [];
    
    if (mainModel) {
      models.push({ 
        model: mainModel, 
        area: calculateArea('mainTrueskill'),
        name: getDisplayName(mainModel),
        dataKey: 'mainTrueskill',
        color: RADAR_COLORS.main
      });
    }
    
    if (compModel1) {
      models.push({ 
        model: compModel1, 
        area: calculateArea('comparisonTrueskill'),
        name: getDisplayName(compModel1),
        dataKey: 'comparisonTrueskill',
        color: RADAR_COLORS.comparison1
      });
    }
    
    if (compModel2) {
      models.push({ 
        model: compModel2, 
        area: calculateArea('comparisonTrueskill2'),
        name: getDisplayName(compModel2),
        dataKey: 'comparisonTrueskill2',
        color: RADAR_COLORS.comparison2
      });
    }
    
    if (compModel3) {
      models.push({ 
        model: compModel3, 
        area: calculateArea('comparisonTrueskill3'),
        name: getDisplayName(compModel3),
        dataKey: 'comparisonTrueskill3',
        color: RADAR_COLORS.comparison3
      });
    }
    
    // Sort by area - DESCENDING order so largest areas come first (rendered first, on bottom)
    return models.sort((a, b) => b.area - a.area);
  };

  // Extract all possible model ELO values for domain calculation
  const allTrueskillValues = combinedSkillData.flatMap(item => [
    item.mainTrueskill, 
    item.comparisonTrueskill, 
    item.comparisonTrueskill2,
    item.comparisonTrueskill3
  ].filter(trueskill => trueskill > 0));

  const sortedEnvironmentPerformance = [...model.environment_performance].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

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

      {/* Header Row: Model Name and Trueskill on the same line */}
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <h1
            className={`font-bold font-mono text-navbarForeground line-clamp-2 leading-tight ${isMobile ? "text-xl" : "text-4xl"}`}
          >
            {model.id === 0 && model.human_name ? model.human_name : model.model_name}
          </h1>
        </div>
        <div
          className={`flex-shrink-0 font-bold font-mono text-navbarForeground ${isMobile ? "text-3xl" : "text-5xl"}`}
        >
          {averageEnvTrueskill.toFixed(1)}
        </div>
      </div>

      {/* <p className={`text-mutedForeground font-mono mb-8 ${isMobile ? "text-xs" : "text-lg"}`}>{model.description}</p> */}

      {/* Top Row: Overall Statistics & Trueskill History */}
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

        {/* Trueskill History */}
        <Card className={`bg-[hsl(var(--navbar))] border-2 border-[hsl(var(--border))] ${isMobile ? "" : "flex-grow"}`}>
          <CardHeader>
            <CardTitle className={`font-mono ${isMobile ? "text-lg" : "text-2xl"} font-semibold text-navbarForeground`}>
              Trueskill History by Environment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-4">
              <div className="relative z-30">
                {/* Multi-select Environment component with persistent dropdown */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative w-[280px]" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
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
                        className={`transform transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
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
                    
                    {dropdownOpen && (
                      <div className="absolute z-50 w-full mt-1 bg-background border border-navbar rounded-md shadow-lg max-h-60 overflow-auto">
                        {/* Add sticky positioning to the Select All / Clear All container */}
                        <div className="flex border-b border-navbar p-1 sticky top-0 bg-background z-10">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEnvs([...Object.keys(envSubsets)]);
                            }}
                            className="flex-1 text-xs font-mono py-1 px-2 hover:bg-accent rounded mr-1"
                          >
                            Select All
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEnvs([]);
                            }}
                            className="flex-1 text-xs font-mono py-1 px-2 hover:bg-accent rounded ml-1"
                          >
                            Clear All
                          </button>
                        </div>
                        
                        {/* Sort Object.keys(envSubsets) alphabetically */}
                        {Object.keys(envSubsets).sort().map((env) => (
                          <div
                            key={env}
                            className={`relative flex items-center px-2 py-1.5 rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                              selectedEnvs.includes(env) ? 'bg-accent/50' : ''
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (selectedEnvs.includes(env)) {
                                setSelectedEnvs(selectedEnvs.filter(e => e !== env));
                              } else {
                                setSelectedEnvs([...selectedEnvs, env]);
                              }
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-4 w-4 border rounded flex items-center justify-center ${
                                  selectedEnvs.includes(env) ? 'bg-primary border-primary' : 'border-input'
                                }`}
                              >
                                {selectedEnvs.includes(env) && (
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
                              <span className="font-mono">{env}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {isMobile && (
                <div
                  ref={trueskillTooltipContainerRef}
                  className="absolute top-[130px] left-0 right-0 z-20 flex justify-center items-center h-[20px] bg-[hsl(var(--navbar))] bg-opacity-95 transition-all duration-200 p-1"
                />
              )}
              
              <div className={isMobile ? "overflow-x-auto relative z-10" : ""}>
                <div style={{ width: isMobile ? Math.max(400, model.trueskill_history.length * 1.5) : "100%", height: 450 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{
                        top: isMobile ? 200 : 20,
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
                          (dataMin) => Math.floor(dataMin) - 5,
                          (dataMax) => Math.ceil(dataMax) + 5,
                        ]}
                        tick={{ fill: "white", fontSize: 12, fontFamily: "var(--font-mono)" }}
                        axisLine={{ stroke: "white" }}
                        tickCount={7}
                      />
                      <Tooltip
                        content={
                          <CustomTrueskillTooltip
                            isMobile={isMobile}
                            containerRef={isMobile ? trueskillTooltipContainerRef : null}
                          />
                        }
                        position={isMobile ? { x: 0, y: 0 } : undefined}
                      />
                      
                      {/* Replace the default Legend with the custom one */}
                      <Legend 
                        content={<CustomLegendContent />}
                        verticalAlign="top"
                        align="center"
                        wrapperStyle={{ 
                          color: "white", 
                          fontFamily: "var(--font-mono)",
                          fontSize: isMobile ? 10 : 12,
                          marginTop: isMobile ? "-35px" : "-20px"
                        }}
                      />
                      
                      {/* Apply opacity to chart lines based on hover state */}
                      {chartData.length > 0 && 
                        Object.keys(chartData[0])
                          .filter(key => key !== 'date' && !key.endsWith('_sd'))
                          .map((key, index) => (
                            <Line
                              key={key}
                              type="monotone"
                              dataKey={key}
                              name={key}
                              stroke={CHART_COLORS[index % CHART_COLORS.length]}
                              strokeWidth={hoveredEnvironment === null || hoveredEnvironment === key ? 3 : 1.5}
                              opacity={hoveredEnvironment === null || hoveredEnvironment === key ? 1 : 0.4}
                              dot={false}
                              activeDot={{ r: isMobile ? 6 : 8 }}
                            />
                          ))
                      }
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
                      data={sortedEnvironmentPerformance}
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
                      <Bar yAxisId="left" dataKey="trueskill" fill="#8884d8" name="Trueskill" />
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
            {/* For mobile devices, we'll use a completely different layout structure */}
            {isMobile ? (
              <div className="flex flex-col space-y-6">
                {/* Model Selection UI - in its own contained section */}
                <div className="relative z-30">
                  <ModelComparisonSelect />
                </div>
                
                {/* Tooltip container - positioned as a separate section, not absolute */}
                <div
                  ref={RadarTooltipContainerRef}
                  className="bg-[hsl(var(--navbar))] bg-opacity-95 py-2 px-4 h-[200px] overflow-y-auto pointer-events-auto border border-[hsl(var(--border))] rounded-lg z-20"
                ></div>
                
                {/* Radar Chart Container - as a separate section below tooltip */}
                <div 
                  ref={chartContainerRef}
                  className="overflow-x-auto pt-4"
                >
                  <div 
                    style={{ 
                      width: "350px",
                      height: 450,
                      margin: "0 auto",
                      minWidth: "300px"
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart 
                        data={combinedSkillData}
                        margin={{ top: 20, right: 30, left: 30, bottom: 40 }}
                        outerRadius={90}
                      >
                        <PolarGrid stroke="white" radialLines={true} />
                        <PolarAngleAxis
                          dataKey="skill"
                          tick={{ 
                            fill: "white", 
                            fontSize: 8,
                            fontFamily: "var(--font-mono)",
                            dy: 6,
                            width: 60,
                            lineHeight: "1.2em"
                          }}
                          radius={90}
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
                          domain={calculateDomain(allTrueskillValues)}
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

                        {/* Dynamic rendering of sorted radar charts */}
                        {sortModelsByArea(model, comparisonModel, comparisonModel2, comparisonModel3, combinedSkillData).map((modelData, index) => (
                          <Radar
                            key={index}
                            name={modelData.name}
                            dataKey={modelData.dataKey}
                            stroke={modelData.color}
                            fill={modelData.color}
                            fillOpacity={0.6}
                            className="cursor-pointer"
                            radiusScale={0.75}
                            activeDot={{
                              r: 4,
                              stroke: "white",
                              strokeWidth: 2,
                              fill: modelData.color,
                            }}
                          />
                        ))}
                        
                        <Legend 
                          align="center"
                          verticalAlign="top"
                          wrapperStyle={{ 
                            color: "white", 
                            fontFamily: "var(--font-mono)",
                            fontSize: 9,
                            marginTop: "-40px" // Adjusted for mobile flow layout
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ) : (
              /* Desktop layout remains the same */
              <div className="relative">
                {/* Model Selection UI */}
                <div className="relative z-20">
                  <ModelComparisonSelect />
                </div>
                
                {/* Add a divider between selection and chart */}
                <div className="border-t border-[hsl(var(--border))] my-4"></div>
                
                <div className="flex gap-4">
                  {/* Tooltip Container for Desktop */}
                  <div 
                    ref={RadarTooltipContainerRef}
                    className="w-1/2 h-[400px] bg-[hsl(var(--navbar))] border border-[hsl(var(--border))] rounded-lg p-2 overflow-y-auto"
                  ></div>
                  
                  {/* Radar Chart Container */}
                  <div 
                    ref={chartContainerRef}
                    className="flex-1"
                    style={{ minHeight: '400px' }} 
                  >
                    <div 
                      style={{ 
                        width: "100%",
                        height: 450,
                        margin: "0 auto"
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart 
                          data={combinedSkillData}
                          margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
                          outerRadius={chartRadius}
                        >
                          <PolarGrid stroke="white" radialLines={true} />
                          <PolarAngleAxis
                            dataKey="skill"
                            tick={{ 
                              fill: "white", 
                              fontSize: 10,
                              fontFamily: "var(--font-mono)",
                              dy: 6,
                              width: 60,
                              lineHeight: "1.2em"
                            }}
                            radius={chartRadius}
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
                            domain={calculateDomain(allTrueskillValues)}
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

                          {/* Dynamic rendering of sorted radar charts */}
                          {sortModelsByArea(model, comparisonModel, comparisonModel2, comparisonModel3, combinedSkillData).map((modelData, index) => (
                            <Radar
                              key={index}
                              name={modelData.name}
                              dataKey={modelData.dataKey}
                              stroke={modelData.color}
                              fill={modelData.color}
                              fillOpacity={0.6}
                              className="cursor-pointer"
                              radiusScale={0.75}
                              activeDot={{
                                r: 6,
                                stroke: "white",
                                strokeWidth: 2,
                                fill: modelData.color,
                              }}
                            />
                          ))}
                          
                          <Legend 
                            align="center"
                            verticalAlign="top"
                            wrapperStyle={{ 
                              color: "white", 
                              fontFamily: "var(--font-mono)",
                              fontSize: 11,
                              marginTop: "-20px"
                            }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
                    <TableHead className="text-right">Trueskill Change</TableHead>
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
                          game.trueskill_change > 0
                            ? "text-green-500"
                            : game.trueskill_change < 0
                              ? "text-red-500"
                              : "text-gray-500"
                        }`}
                      >
                        {game.trueskill_change > 0 ? "+" : ""}
                        {game.trueskill_change.toFixed(2)}
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

