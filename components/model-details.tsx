// "use client"

// import React, { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { ArrowLeft } from "lucide-react"
// import {
//   ResponsiveContainer,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   BarChart,
//   Bar,
//   RadarChart,
//   PolarGrid,
//   PolarAngleAxis,
//   Radar,
//   LineChart,
//   Line,
// } from "recharts"
// import { supabase } from "@/lib/supabase"

// // Types
// interface ModelData {
//   id: number
//   model_name: string
//   description?: string
//   elo: number
//   games_played: number
//   win_rate: number
//   wins: number
//   draws: number
//   losses: number
//   avg_time: number
//   elo_history: {
//     interval_start: string
//     avg_elo: number
//   }[]
//   environment_performance: {
//     name: string
//     elo: number
//     games: number
//     win_rate: number
//     skill_1?: string
//     skill_2?: string
//     avg_move_time: number
//     wins: number
//     draws: number
//     losses: number
//   }[]
//   recent_games: {
//     game_id: number
//     environment: string
//     game_start_time: string
//     opponent_name: string
//     elo_change: number
//     outcome: string
//     reason: string
//   }[]
// }

// interface ModelDetailsProps {
//   modelName: string
// }

// // Skill definitions
// const SKILLS = [
//   "Theory of Mind",
//   "Strategic Planning",
//   "Persuasion",
//   "Conviction",
//   "Spatial Thinking",
//   "Uncertainty Evaluation",
//   "Bluffing"
// ]

// const SKILL_EXPLANATIONS: Record<string, string> = {
//   "Theory of Mind": "Understanding and predicting opponent behavior",
//   "Strategic Planning": "Long-term planning and goal-oriented thinking",
//   "Persuasion": "Ability to influence outcomes through communication",
//   "Conviction": "Confidence and commitment to chosen actions",
//   "Spatial Thinking": "Understanding and manipulating spatial relationships",
//   "Uncertainty Evaluation": "Handling ambiguous or incomplete information",
//   "Bluffing": "Strategic deception and misdirection"
// }

// // Custom tooltip for the radar chart
// // function CustomRadarTooltip({ active, payload }: any) {
// //   if (active && payload && payload.length > 0) {
// //     const data = payload[0].payload
// //     return (
// //       <div className="bg-black text-gray-300 p-2 rounded text-sm">
// //         <p className="font-bold m-0">{data.skill}</p>
// //         <p className="mt-1 mb-0 text-xs">Average Elo: {data.elo.toFixed(1)}</p>
// //         <p className="mt-1 mb-0 text-xs">{SKILL_EXPLANATIONS[data.skill]}</p>
// //       </div>
// //     )
// //   }
// //   return null
// // }

// function CustomRadarTooltip({ active, payload }: any) {
//   if (active && payload && payload.length > 0) {
//     const data = payload[0].payload;
//     return (
//       <div className="bg-black text-gray-300 p-2 rounded text-sm">
//         <p className="font-bold m-0">{data.skill}</p>
//         <p className="mt-1 mb-0 text-xs">
//           Average Elo: {data.elo.toFixed(1)}
//         </p>
//         <p className="mt-1 mb-0 text-xs">
//           {SKILL_EXPLANATIONS[data.skill]}
//         </p>
//         {data.envs && data.envs.length > 0 && (
//           <div className="mt-1">
//             <p className="text-xs font-medium">Environments:</p>
//             <ul className="list-disc list-inside text-xs">
//               {data.envs.map((env: any, idx: number) => (
//                 <li key={idx}>
//                   {env.name}: {env.elo.toFixed(1)}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     );
//   }
//   return null;
// }

// function CustomEnvTooltip({ active, payload }: any) {
//   if (active && payload && payload.length > 0) {
//     const data = payload[0].payload
//     return (
//       <div
//         style={{
//           backgroundColor: 'black',
//           padding: '10px',
//           borderRadius: '4px',
//           color: 'white'
//         }}
//       >
//         <p className="font-bold">{data.name}</p>
//         <p>Elo: {data.elo.toFixed(1)}</p>
//         <p>Win Rate: {(data.win_rate * 100).toFixed(1)}%</p>
//         <p>Games: {data.games}</p>
//         <p>W/D/L: {data.wins}/{data.draws}/{data.losses}</p>
//         <p>Avg. Move Time: {data.avg_move_time ? data.avg_move_time.toFixed(1) + 's' : 'N/A'}</p>
//       </div>
//     )
//   }
//   return null
// }

// export function ModelDetails({ modelName }: ModelDetailsProps) {
//   const router = useRouter()
//   const [model, setModel] = useState<ModelData | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     fetchModelDetails()
//   }, [modelName])
  
//   useEffect(() => {
//     if (model) {
//       console.log("Environment performance data:", model.environment_performance)
//       const skillData = buildSkillDistribution(model.environment_performance)
//       console.log("Computed skill distribution:", skillData)
//     }
//   }, [model])
  
//   async function fetchModelDetails() {
//     try {
//       setError(null)
//       setLoading(true)
      
//       console.log("Fetching details for model:", modelName)
//       const { data, error } = await supabase.rpc("get_model_details_by_name_v2", { 
//         model_name_param: modelName 
//       })
      
//       if (error) {
//         console.error("Database error:", error)
//         throw error
//       }
      
//       if (!data || data.length === 0) {
//         setModel(null)
//         return
//       }

//       // Transform the raw data into the expected format
//       const rawModel = data[0]

//       // Deduplicate environment performance data
//       const uniqueEnvs: Record<string, any> = {}
//       ;(rawModel.environment_performance || []).forEach((env: any) => {
//         const key = env.name || env.env_name || "Unknown"
//         // keep whichever record has the most games
//         if (!uniqueEnvs[key] || env.games > uniqueEnvs[key].games) {
//           uniqueEnvs[key] = env
//         }
//       })
//       const dedupedEnvs = Object.values(uniqueEnvs)

//       const processedModel: ModelData = {
//         id: rawModel.id,
//         model_name: rawModel.model_name,
//         description: rawModel.description || "No description available",
//         elo: Number(rawModel.elo) || 1000,
//         games_played: Number(rawModel.games_played) || 0,
//         win_rate: Number(rawModel.win_rate) || 0,
//         wins: Number(rawModel.wins) || 0,
//         draws: Number(rawModel.draws) || 0,
//         losses: Number(rawModel.losses) || 0,
//         avg_time: Number(rawModel.avg_time) || 0,
//         elo_history: (rawModel.elo_history || []).map((h: any) => ({
//           interval_start: new Date(h.interval_start).toISOString(),
//           avg_elo: h.avg_elo || 0
//         })),
//         environment_performance: dedupedEnvs.map((env: any) => ({
//           name: env.name || env.env_name || "Unknown",
//           elo: Number(env.elo) || 1000,
//           games: Number(env.games) || 0,
//           win_rate: Number(env.win_rate) || 0,
//           skill_1: env.skill_1,
//           skill_2: env.skill_2,
//           avg_move_time: Number(env.avg_move_time) || 0,
//           wins: Number(env.wins) || 0,
//           draws: Number(env.draws) || 0,
//           losses: Number(env.losses) || 0
//         })),
//         recent_games: (rawModel.recent_games || []).map((game: any) => ({
//           game_id: game.game_id,
//           environment: game.environment || "Unknown",
//           game_start_time: game.game_start_time,
//           opponent_name: game.opponent_name || "Unknown",
//           elo_change: Number(game.elo_change) || 0,
//           outcome: (game.outcome || "unknown").toLowerCase(),
//           reason: game.reason || "N/A"
//         }))
//         // Filter out "unknown" outcomes just in case
//         .filter((g: any) => g.outcome !== "unknown")
//       }

//       setModel(processedModel)
//     } catch (err) {
//       console.error("Error fetching model:", err)
//       setError("Could not load model details.")
//     } finally {
//       setLoading(false)
//     }
//   }



//   // function buildSkillDistribution(environments: ModelData["environment_performance"]) {
//   //   const agg: Record<string, { totalElo: number; count: number }> = {}
//   //   SKILLS.forEach(skill => {
//   //     agg[skill] = { totalElo: 0, count: 0 }
//   //   })
  
//   //   environments.forEach(env => {
//   //     if (env.skill_1 && SKILLS.includes(env.skill_1)) {
//   //       agg[env.skill_1].totalElo += env.elo
//   //       agg[env.skill_1].count += 1
//   //     }
//   //     if (env.skill_2 && SKILLS.includes(env.skill_2)) {
//   //       agg[env.skill_2].totalElo += env.elo
//   //       agg[env.skill_2].count += 1
//   //     }
//   //   })
  
//   //   return SKILLS.map(skill => ({
//   //     skill,
//   //     elo: agg[skill].count > 0 ? agg[skill].totalElo / agg[skill].count : 0
//   //   }))
//   // }
//   function buildSkillDistribution(
//     environments: ModelData["environment_performance"]
//   ) {
//     // Create an aggregation object that collects total Elo, count, and environment details
//     const agg: Record<
//       string,
//       { totalElo: number; count: number; envs: { name: string; elo: number }[] }
//     > = {};
  
//     SKILLS.forEach((skill) => {
//       agg[skill] = { totalElo: 0, count: 0, envs: [] };
//     });
  
//     environments.forEach((env) => {
//       // For the first skill slot
//       if (env.skill_1 && SKILLS.includes(env.skill_1)) {
//         agg[env.skill_1].totalElo += env.elo;
//         agg[env.skill_1].count += 1;
//         agg[env.skill_1].envs.push({ name: env.name, elo: env.elo });
//       }
//       // For the second skill slot
//       if (env.skill_2 && SKILLS.includes(env.skill_2)) {
//         agg[env.skill_2].totalElo += env.elo;
//         agg[env.skill_2].count += 1;
//         agg[env.skill_2].envs.push({ name: env.name, elo: env.elo });
//       }
//     });
  
//     return SKILLS.map((skill) => ({
//       skill,
//       elo: agg[skill].count > 0 ? agg[skill].totalElo / agg[skill].count : 0,
//       envs: agg[skill].envs, // Include the environments for this skill
//     }));
//   }
  
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="text-center">
//           <h2 className="text-xl font-semibold mb-2">Loading model data...</h2>
//           <p className="text-gray-600">Please wait while we fetch the details.</p>
//         </div>
//       </div>
//     )
//   }
  
//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="text-center">
//           <p className="text-red-600 text-lg mb-4">{error}</p>
//           <Button onClick={() => router.push("/leaderboard")}>
//             Return to Leaderboard
//           </Button>
//         </div>
//       </div>
//     )
//   }
  
//   if (!model) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="text-center">
//           <h2 className="text-xl font-semibold mb-4">Model not found</h2>
//           <p className="text-gray-600 mb-4">
//             The requested model could not be found in our database.
//           </p>
//           <Button onClick={() => router.push("/leaderboard")}>
//             Return to Leaderboard
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   const skillData = buildSkillDistribution(model.environment_performance)

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Back Button and Elo */}
//       <div className="flex justify-between items-center mb-6">
//         <Button variant="outline" size="sm" onClick={() => router.push("/leaderboard")}>
//           <ArrowLeft className="mr-2 h-4 w-4" /> Back to Leaderboard
//         </Button>
//         <div className="text-5xl font-bold">{Math.round(model.elo)}</div>
//       </div>
      
//       <h1 className="text-4xl font-bold mb-2">{model.model_name}</h1>
//       <p className="text-gray-600 mb-8">{model.description}</p>

//       {/* Top Row: Overall Stats & Elo History (2 columns) */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

//         {/* Overall Statistics */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Overall Statistics</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-2">
//               <div className="flex justify-between">
//                 <span className="font-medium">Games Played:</span>
//                 <span>{model.games_played}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="font-medium">Win Rate:</span>
//                 <span>{(model.win_rate * 100).toFixed(1)}%</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="font-medium">W/D/L:</span>
//                 <span>
//                   <span className="text-green-600">{model.wins}</span>/
//                   <span className="text-gray-600">{model.draws}</span>/
//                   <span className="text-red-600">{model.losses}</span>
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="font-medium">Avg. Time/Move:</span>
//                 <span>{model.avg_time.toFixed(1)}s</span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Elo History */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Elo History</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={model.elo_history}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis 
//                   dataKey="interval_start" 
//                   tickFormatter={(tick) => new Date(tick).toLocaleTimeString()} 
//                 />
//                 <YAxis 
//                   domain={["dataMin - 100", "dataMax + 100"]} 
//                   tickFormatter={(tick) => Math.round(tick)}
//                 />
//                 <Tooltip 
//                   labelFormatter={(label) => new Date(label).toLocaleString()}
//                   formatter={(value: number) => Math.round(value)}
//                 />
//                 <Legend />
//                 <Line 
//                   type="monotone" 
//                   dataKey="avg_elo" 
//                   name="Elo Rating"
//                   stroke="#8884d8" 
//                   strokeWidth={2}
//                   dot={false}
//                   activeDot={{ r: 8 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Environment Performance (Full width) */}
//       <div className="mb-8">
//         <Card>
//           <CardHeader>
//             <CardTitle>Performance by Environment</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={400}>
//               <BarChart
//                 data={model.environment_performance}
//                 margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis 
//                   dataKey="name" 
//                   tick={{ angle: -45, textAnchor: "end" }} 
//                   interval={0} 
//                 />
//                 <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
//                 <YAxis 
//                   yAxisId="right" 
//                   orientation="right" 
//                   stroke="#82ca9d"
//                   tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
//                 />
//                 <Tooltip content={<CustomEnvTooltip />} />
//                 <Legend verticalAlign="top" align="center" />
//                 <Bar 
//                   yAxisId="left" 
//                   dataKey="elo" 
//                   fill="#8884d8" 
//                   name="Elo" 
//                 />
//                 <Bar 
//                   yAxisId="right" 
//                   dataKey="win_rate" 
//                   fill="#82ca9d" 
//                   name="Win Rate" 
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Skill Distribution */}
//       <div className="mb-8">
//         <Card>
//           <CardHeader>
//             <CardTitle>Skill Distribution</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <RadarChart data={skillData}>
//                 <PolarGrid />
//                 <PolarAngleAxis 
//                   dataKey="skill"
//                   tick={{ fill: "gray", fontSize: 12 }}
//                 />
//                 <Tooltip content={<CustomRadarTooltip />} />
//                 <Radar 
//                   name="Skill Level" 
//                   dataKey="elo" 
//                   stroke="#8884d8" 
//                   fill="#8884d8" 
//                   fillOpacity={0.6} 
//                 />
//               </RadarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Recent Games */}
//       <div className="mb-8">
//         <Card>
//           <CardHeader>
//             <CardTitle>Recent Games</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Time</TableHead>
//                     <TableHead>Environment</TableHead>
//                     <TableHead>Opponent</TableHead>
//                     <TableHead className="text-right">Elo Change</TableHead>
//                     <TableHead>Outcome</TableHead>
//                     <TableHead>Reason</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {model.recent_games.map((game) => (
//                     <TableRow key={game.game_id}>
//                       <TableCell>
//                         {new Date(game.game_start_time).toLocaleString()}
//                       </TableCell>
//                       <TableCell>{game.environment}</TableCell>
//                       <TableCell>{game.opponent_name}</TableCell>
//                       <TableCell
//                         className={`text-right ${
//                           game.elo_change > 0
//                             ? "text-green-600"
//                             : game.elo_change < 0
//                             ? "text-red-600"
//                             : ""
//                         }`}
//                       >
//                         {game.elo_change > 0 ? "+" : ""}
//                         {Math.round(game.elo_change)}
//                       </TableCell>
//                       <TableCell
//                         className={
//                           game.outcome === "win"
//                             ? "text-green-600"
//                             : game.outcome === "loss"
//                             ? "text-red-600"
//                             : "text-gray-600"
//                         }
//                       >
//                         {game.outcome
//                           ? game.outcome.charAt(0).toUpperCase() +
//                             game.outcome.slice(1)
//                           : "Unknown"}
//                       </TableCell>
//                       <TableCell>{game.reason}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }
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
} from "recharts"
import { supabase } from "@/lib/supabase"

// Types
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
    skill_1?: string
    skill_2?: string
    avg_move_time: number
    wins: number
    draws: number
    losses: number
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

// Skill definitions
const SKILLS = [
  "Theory of Mind",
  "Strategic Planning",
  "Persuasion",
  "Conviction",
  "Spatial Thinking",
  "Uncertainty Evaluation",
  "Bluffing"
]

const SKILL_EXPLANATIONS: Record<string, string> = {
  "Theory of Mind": "Understanding and predicting opponent behavior",
  "Strategic Planning": "Long-term planning and goal-oriented thinking",
  "Persuasion": "Ability to influence outcomes through communication",
  "Conviction": "Confidence and commitment to chosen actions",
  "Spatial Thinking": "Understanding and manipulating spatial relationships",
  "Uncertainty Evaluation": "Handling ambiguous or incomplete information",
  "Bluffing": "Strategic deception and misdirection"
}

// Custom tooltip for the radar chart now shows environments with Elo scores.
function CustomRadarTooltip({ active, payload }: any) {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload
    return (
      <div className="bg-black text-gray-300 p-2 rounded text-sm">
        <p className="font-bold m-0">{data.skill}</p>
        <p className="mt-1 mb-0 text-xs">
          Average Elo: {data.elo.toFixed(1)}
        </p>
        <p className="mt-1 mb-0 text-xs">
          {SKILL_EXPLANATIONS[data.skill]}
        </p>
        {data.envs && data.envs.length > 0 && (
          <div className="mt-1">
            <p className="text-xs font-medium">Environments:</p>
            <ul className="list-disc list-inside text-xs">
              {data.envs.map((env: any, idx: number) => (
                <li key={idx}>
                  {env.name}: {env.elo.toFixed(1)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }
  return null
}

function CustomEnvTooltip({ active, payload }: any) {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload
    return (
      <div
        style={{
          backgroundColor: "black",
          padding: "10px",
          borderRadius: "4px",
          color: "white"
        }}
      >
        <p className="font-bold">{data.name}</p>
        <p>Elo: {data.elo.toFixed(1)}</p>
        <p>Win Rate: {(data.win_rate * 100).toFixed(1)}%</p>
        <p>Games: {data.games}</p>
        <p>
          W/D/L: {data.wins}/{data.draws}/{data.losses}
        </p>
        <p>
          Avg. Move Time:{" "}
          {data.avg_move_time
            ? data.avg_move_time.toFixed(1) + "s"
            : "N/A"}
        </p>
      </div>
    )
  }
  return null
}

// Build skill distribution including environment details for tooltip.
function buildSkillDistribution(
  environments: ModelData["environment_performance"]
) {
  const agg: Record<
    string,
    { totalElo: number; count: number; envs: { name: string; elo: number }[] }
  > = {}

  SKILLS.forEach((skill) => {
    agg[skill] = { totalElo: 0, count: 0, envs: [] }
  })

  environments.forEach((env) => {
    if (env.skill_1 && SKILLS.includes(env.skill_1)) {
      agg[env.skill_1].totalElo += env.elo
      agg[env.skill_1].count += 1
      agg[env.skill_1].envs.push({ name: env.name, elo: env.elo })
    }
    if (env.skill_2 && SKILLS.includes(env.skill_2)) {
      agg[env.skill_2].totalElo += env.elo
      agg[env.skill_2].count += 1
      agg[env.skill_2].envs.push({ name: env.name, elo: env.elo })
    }
  })

  return SKILLS.map((skill) => ({
    skill,
    elo: agg[skill].count > 0 ? agg[skill].totalElo / agg[skill].count : 0,
    envs: agg[skill].envs
  }))
}

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
        model_name_param: modelName 
      })
      
      if (error) {
        console.error("Database error:", error)
        throw error
      }
      
      if (!data || data.length === 0) {
        setModel(null)
        return
      }

      // Transform the raw data into the expected format
      const rawModel = data[0]

      // Deduplicate environment performance data
      const uniqueEnvs: Record<string, any> = {}
      ;(rawModel.environment_performance || []).forEach((env: any) => {
        const key = env.name || env.env_name || "Unknown"
        if (!uniqueEnvs[key] || env.games > uniqueEnvs[key].games) {
          uniqueEnvs[key] = env
        }
      })
      const dedupedEnvs = Object.values(uniqueEnvs)

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
          avg_elo: h.avg_elo || 0
        })),
        environment_performance: dedupedEnvs.map((env: any) => ({
          name: env.name || env.env_name || "Unknown",
          elo: Number(env.elo) || 1000,
          games: Number(env.games) || 0,
          win_rate: Number(env.win_rate) || 0,
          skill_1: env.skill_1,
          skill_2: env.skill_2,
          avg_move_time: Number(env.avg_move_time) || 0,
          wins: Number(env.wins) || 0,
          draws: Number(env.draws) || 0,
          losses: Number(env.losses) || 0
        })),
        recent_games: (rawModel.recent_games || []).map((game: any) => ({
          game_id: game.game_id,
          environment: game.environment || "Unknown",
          game_start_time: game.game_start_time,
          opponent_name: game.opponent_name || "Unknown",
          elo_change: Number(game.elo_change) || 0,
          outcome: (game.outcome || "unknown").toLowerCase(),
          reason: game.reason || "N/A"
        }))
        .filter((g: any) => g.outcome !== "unknown")
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
          <p className="text-gray-600">Please wait while we fetch the details.</p>
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
          <p className="text-gray-600 mb-4">
            The requested model could not be found in our database.
          </p>
          <Button onClick={() => router.push("/leaderboard")}>
            Return to Leaderboard
          </Button>
        </div>
      </div>
    )
  }

  // Calculate the average Elo from all environments (for the Performance by Environment table)
  const averageEnvElo =
    model.environment_performance.length > 0
      ? model.environment_performance.reduce((sum, env) => sum + env.elo, 0) / model.environment_performance.length
      : model.elo

  const skillData = buildSkillDistribution(model.environment_performance)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button and Average Environment Elo */}
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" size="sm" onClick={() => router.push("/leaderboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Leaderboard
        </Button>
        <div className="text-5xl font-bold">{Math.round(averageEnvElo)}</div>
      </div>
      
      <h1 className="text-4xl font-bold mb-2">{model.model_name}</h1>
      <p className="text-gray-600 mb-8">{model.description}</p>

      {/* Top Row: Overall Statistics & Elo History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Overall Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Games Played:</span>
                <span>{model.games_played}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Win Rate:</span>
                <span>{(model.win_rate * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">W/D/L:</span>
                <span>
                  <span className="text-green-600">{model.wins}</span>/
                  <span className="text-gray-600">{model.draws}</span>/
                  <span className="text-red-600">{model.losses}</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Avg. Time/Move:</span>
                <span>{model.avg_time.toFixed(1)}s</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Elo History */}
        <Card>
          <CardHeader>
            <CardTitle>Elo History</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={model.elo_history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="interval_start" 
                  tickFormatter={(tick) => new Date(tick).toLocaleTimeString()} 
                />
                <YAxis 
                  domain={["dataMin - 100", "dataMax + 100"]} 
                  tickFormatter={(tick) => Math.round(tick)}
                />
                <Tooltip 
                  labelFormatter={(label) => new Date(label).toLocaleString()}
                  formatter={(value: number) => Math.round(value)}
                />
                <Legend />
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

      {/* Environment Performance (Full width) */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Performance by Environment</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={model.environment_performance}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ angle: -45, textAnchor: "end" }} 
                  interval={0} 
                />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  stroke="#82ca9d"
                  tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                />
                <Tooltip content={<CustomEnvTooltip />} />
                <Legend verticalAlign="top" align="center" />
                <Bar 
                  yAxisId="left" 
                  dataKey="elo" 
                  fill="#8884d8" 
                  name="Elo" 
                />
                <Bar 
                  yAxisId="right" 
                  dataKey="win_rate" 
                  fill="#82ca9d" 
                  name="Win Rate" 
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Skill Distribution */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Skill Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={skillData}>
                <PolarGrid />
                <PolarAngleAxis 
                  dataKey="skill"
                  tick={{ fill: "gray", fontSize: 12 }}
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
        <Card>
          <CardHeader>
            <CardTitle>Recent Games</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
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
                      <TableCell>
                        {new Date(game.game_start_time).toLocaleString()}
                      </TableCell>
                      <TableCell>{game.environment}</TableCell>
                      <TableCell>{game.opponent_name}</TableCell>
                      <TableCell
                        className={`text-right ${
                          game.elo_change > 0
                            ? "text-green-600"
                            : game.elo_change < 0
                            ? "text-red-600"
                            : ""
                        }`}
                      >
                        {game.elo_change > 0 ? "+" : ""}
                        {Math.round(game.elo_change)}
                      </TableCell>
                      <TableCell
                        className={
                          game.outcome === "win"
                            ? "text-green-600"
                            : game.outcome === "loss"
                            ? "text-red-600"
                            : "text-gray-600"
                        }
                      >
                        {game.outcome
                          ? game.outcome.charAt(0).toUpperCase() +
                            game.outcome.slice(1)
                          : "Unknown"}
                      </TableCell>
                      <TableCell>{game.reason}</TableCell>
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
