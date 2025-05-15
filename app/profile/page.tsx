"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox"; // Add this import
import { CircleUserRound, LogOut, Loader2, RefreshCw, Share2, Scale } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PolarRadiusAxis,
  Tooltip,
  Legend
} from "recharts";
import { createRoot } from "react-dom/client";

// Constants for the skill radar chart (imported from model-details.tsx)
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
];

const SKILL_EXPLANATIONS = {
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
};

// Statistics interfaces
interface HumanStatsType {
  total_games: number;
  total_wins: number;
  total_draws: number;
  total_losses: number;
  win_rate: number | null;
  net_trueskill_change: number | null;
}

interface EnvironmentStats {
  environment_id: number;
  env_name: string;
  games_played: number;
  win_rate: number;
  net_trueskill: number;
  percentile: number;
}

// Interface for environment performance (used for skill distribution)
interface EnvironmentPerformance {
  name: string;
  trueskill: number;
  games: number;
  win_rate: number;
  avg_move_time: number;
  wins: number;
  draws: number;
  losses: number;
  skill_1?: string;
  skill_1_weight?: number;
  skill_2?: string;
  skill_2_weight?: number;
  skill_3?: string;
  skill_3_weight?: number;
  skill_4?: string;
  skill_4_weight?: number;
  skill_5?: string;
  skill_5_weight?: number;
  is_balancedsubset?: boolean;
}

// Custom Radar Tooltip component
function CustomRadarTooltip({ active, payload, isMobile, containerRef }) {
  const rootRef = useRef(null);

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

    const renderContent = (root) => {
      if (active && payload && payload.length > 0) {
        const data = payload[0].payload;
        
        // Get environments
        const allEnvNames = new Set();
        
        // Helper function to filter and add environments
        const addFilteredEnvs = (envs) => {
          if (!envs) return;
          
          // Only add environments where is_balancedsubset is true
          envs.filter(env => env.is_balancedsubset === true)
            .forEach(env => allEnvNames.add(env.name));
        };
        
        // Collect environment names
        addFilteredEnvs(data.mainEnvs);
        
        // Convert to array and sort alphabetically
        const allEnvironments = [...allEnvNames].sort();
        
        // Color mapping
        const colorMapping = {
          mainTrueskill: RADAR_COLORS.main
        };
        
        // Create models array with the data that's needed
        const modelList = [];
        
        // Add main model if it has data
        if (data.mainTrueskill > 0) {
          modelList.push({ 
            name: 'Your Skills',
            color: colorMapping.mainTrueskill,
            trueskill: data.mainTrueskill,
            envs: data.mainEnvs ? data.mainEnvs.filter(env => env.is_balancedsubset === true) : [],
            dataKey: 'mainTrueskill'
          });
        }
        
        // Sort models by skill trueskill (highest first) for display
        const models = modelList;

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

            {/* Overall Trueskill */}
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
                  // Get this environment's data for the model
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
                  
                  // Find the percentage for the main model
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

// Helper functions
function safeToFixed(num, fractionDigits = 1) {
  return typeof num === "number" ? num.toFixed(fractionDigits) : "N/A";
}

async function fetchHumanNumericId(token) {
  const { data, error } = await supabase
    .from("humans")
    .select("id")
    .eq("cookie_id", token)
    .single();

  if (error) {
    console.error("Error fetching numeric ID from token:", error);
    return null;
  }
  if (!data) {
    console.error("No human found for token:", token);
    return null;
  }
  return data.id;
}

async function fetchNetTrueskillChange(numericHumanId) {
  try {
    const { data, error } = await supabase
      .from("player_games")
      .select("trueskill_change")
      .eq("human_id", numericHumanId);

    if (error) {
      console.error("Error fetching net trueskill change:", error);
      return 0;
    }

    if (!data || data.length === 0) {
      return 0;
    }

    const total = data.reduce((acc, row) => {
      return acc + (row.trueskill_change ?? 0);
    }, 0);

    return total;
  } catch (err) {
    console.error("Error in fetchNetTrueskillChange:", err);
    return 0;
  }
}

// Function to build skill distribution (from model-details.tsx)
function buildSkillDistribution(environments) {
  // First, filter to only include environments with is_balancedsubset = true
  const balancedEnvironments = environments.filter(env => env.is_balancedsubset === true);
  
  // Initialize aggregation structure
  const agg = {};
  SKILLS.forEach((skill) => {
    agg[skill] = { weightedTrueskill: 0, totalWeight: 0, envs: [] };
  });

  // Now process only the balanced environments
  balancedEnvironments.forEach((env) => {
    // Loop through up to five possible skill fields.
    for (let i = 1; i <= 5; i++) {
      const skillKey = `skill_${i}`;
      const weightKey = `skill_${i}_weight`;
      const skillValue = env[skillKey];
      const rawWeight = env[weightKey];
      if (skillValue && rawWeight && Number(rawWeight) > 0) {
        const normalizedSkill = skillValue;
        if (SKILLS.includes(normalizedSkill)) {
          const weight = Number(rawWeight);
          agg[normalizedSkill].weightedTrueskill += env.trueskill * weight;
          agg[normalizedSkill].totalWeight += weight;
          agg[normalizedSkill].envs.push({ 
            name: env.name, 
            trueskill: env.trueskill, 
            weight, 
            is_balancedsubset: env.is_balancedsubset
          });
        }
      }
    }
  });

  // Compute each environment's relative weight and return final results
  return SKILLS.map((skill) => {
    const { weightedTrueskill, totalWeight, envs } = agg[skill];
    const envsWithRelative = envs.map((env) => ({
      name: env.name,
      trueskill: env.trueskill,
      weight: env.weight,
      relativeWeight: totalWeight > 0 ? env.weight / totalWeight : 0,
      is_balancedsubset: env.is_balancedsubset
    }));
    return {
      skill,
      trueskill: totalWeight > 0 ? weightedTrueskill / totalWeight : 0,
      totalWeight,
      envs: envsWithRelative,
    };
  });
}

// Helper function to calculate domain for the radar chart
const calculateDomain = (trueskillValues) => {
  // Filter out undefined/null/zero values
  const validTrueskillValues = trueskillValues.filter(value => value !== undefined && value !== null && value > 0);

  if (validTrueskillValues.length === 0) return [0, 100]; // Default if no valid data

  const maxValue = Math.max(...validTrueskillValues);

  // Apply a buffer to make the chart look nice
  const buffer = Math.max(1, maxValue * 0.1);
  
  return [0, Math.ceil(maxValue + buffer)];
};

export default function ProfilePage() {
  const { isAuthenticated, isInitialized, login, register, logout, currentUser, token } = useAuth();
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    humanName: "",
    agreeToTerms: false,
    agreeToMarketing: false,
  });
  
  const [activeTab, setActiveTab] = useState("login");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Stats state
  const [stats, setStats] = useState(null);
  const [envStats, setEnvStats] = useState([]);
  const [overallPercentile, setOverallPercentile] = useState(null);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // New state for skill distribution
  const [numericHumanId, setNumericHumanId] = useState(null);
  const [environmentPerformance, setEnvironmentPerformance] = useState([]);
  const [isSkillDistributionLoading, setIsSkillDistributionLoading] = useState(true);
  const RadarTooltipContainerRef = useRef(null);
  const chartContainerRef = useRef(null);
  
  const isMobile = useIsMobile ? useIsMobile() : false;
  const [chartRadius, setChartRadius] = useState(isMobile ? 90 : 150);
  
  // Save registration data temporarily for login attempt
  const [savedRegistrationData, setSavedRegistrationData] = useState(null);
  
  // Effect to automatically fill login form after registration
  useEffect(() => {
    if (savedRegistrationData && activeTab === "login") {
      setLoginData({
        email: savedRegistrationData.email,
        password: savedRegistrationData.password
      });
      setSavedRegistrationData(null); // Clear after use
    }
  }, [activeTab, savedRegistrationData]);
  
  // Update radius based on container width - only for desktop
  useEffect(() => {
    const updateRadius = () => {
      if (!isMobile && chartContainerRef.current) {
        const containerWidth = chartContainerRef.current.offsetWidth;
        // Calculate radius as a proportion of container width for desktop only
        const newRadius = Math.min(containerWidth / 2.5, 150);
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
  }, [isMobile, isAuthenticated]);
  
  // Stats fetching
  const fetchStats = async () => {
    if (!isInitialized || !token) return;
    setIsRefreshing(true);
    setStatsError(null);
    setIsStatsLoading(true);

    try {
      const { data: overallData, error: overallError } = await supabase.rpc("get_human_stats", { human_cookie_id: String(token) });
      if (overallError) throw overallError;

      const { data: envData, error: envError } = await supabase.rpc("get_human_env_stats", { human_cookie_id: String(token) });
      if (envError) throw envError;

      const { data: percentileData, error: percentileError } = await supabase.rpc("get_overall_performance_percentile", { human_cookie_id: String(token) });
      
      // Get numeric human ID
      const humanId = await fetchHumanNumericId(String(token));
      setNumericHumanId(humanId);
      
      let netTrueskill = 0;
      if (humanId) {
        netTrueskill = await fetchNetTrueskillChange(humanId);
        
        // Fetch environment performance data for skill distribution
        await fetchEnvironmentPerformance(humanId);
      }

      if (!overallData || !overallData[0]) {
        throw new Error('No stats data available');
      }

      const wins = Number(overallData[0].total_wins) || 0;
      const draws = Number(overallData[0].total_draws) || 0;
      const losses = Number(overallData[0].total_losses) || 0;
      const completedGames = wins + draws + losses;

      const overallStats = {
        total_games: completedGames,
        total_wins: wins,
        total_draws: draws,
        total_losses: losses,
        win_rate: completedGames > 0 ? (wins / completedGames) * 100 : 0,
        net_trueskill_change: netTrueskill
      };

      setStats(overallStats);
      setEnvStats(envData || []);
      if (percentileData && percentileData.length > 0) {
        setOverallPercentile(percentileData[0].overall_percentile);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
      setStatsError(err instanceof Error ? err.message : "Failed to load stats");
    } finally {
      setIsStatsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  // Function to fetch environment performance data for skill distribution
  const fetchEnvironmentPerformance = async (humanId) => {
    setIsSkillDistributionLoading(true);
    try {
      if (!humanId) return;
      
      // Use the get_model_details_by_id_v4 RPC
      const { data, error } = await supabase.rpc("get_model_details_by_id_v4", {
        model_id_param: 0, // For humans this is always 0
        human_id_param: humanId
      });
      
      if (error) {
        console.error("Error fetching environment performance:", error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.log("No environment performance data found");
        return;
      }
      
      // Process environment data like in model-details.tsx
      const uniqueEnvs = {};
      (data[0].environment_performance || []).forEach((env) => {
        const key = env.name || env.env_name || "Unknown";
        if (!uniqueEnvs[key] || env.games > uniqueEnvs[key].games) {
          uniqueEnvs[key] = env;
        }
      });
      
      const dedupedEnvs = Object.values(uniqueEnvs);
      setEnvironmentPerformance(dedupedEnvs);
    } catch (err) {
      console.error("Error in fetchEnvironmentPerformance:", err);
    } finally {
      setIsSkillDistributionLoading(false);
    }
  };

  // Fetch stats when authenticated and initialized
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchStats();
    }
  }, [isAuthenticated, isInitialized, token]);
  
  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    
    try {
      const result = await login(loginData.email, loginData.password);
      if (result.success) {
        setSuccess("Logged in successfully!");
        setLoginData({ email: "", password: "" });
      } else {
        // Enhanced error handling
        if (result.error?.message?.includes("CORS")) {
          setError("Network error: Could not connect to the authentication server. If you're on localhost, this is expected behavior.");
        } else {
          setError(result.error?.message || "Login failed. Please check your credentials.");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle register form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    
    // Validate passwords match
    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    
    // Validate terms of service is checked
    if (!registerData.agreeToTerms) {
      setError("You must agree to the Terms of Service.");
      setIsLoading(false);
      return;
    }
    
    try {
      const result = await register(
        registerData.email,
        registerData.password,
        registerData.humanName,
        registerData.agreeToTerms,
        registerData.agreeToMarketing
      );
      
      if (result.success) {
        setSuccess("Account created and logged in successfully!");
        setRegisterData({
          email: "",
          password: "",
          confirmPassword: "",
          humanName: "",
          agreeToTerms: false,
          agreeToMarketing: false,
        });
      } else {
        // Enhanced CORS error handling
        if (result.error?.message?.includes("CORS") || 
            result.error?.message?.includes("Failed to fetch")) {
          
          // Save registration data for login attempt
          setSavedRegistrationData({
            email: registerData.email,
            password: registerData.password
          });
          
          // Show more helpful error message
          setError("Registration may have succeeded but we couldn't confirm it due to a network error. Please try logging in with your credentials.");
          
          // Automatically switch to login tab with a slight delay
          setTimeout(() => {
            setActiveTab("login");
          }, 1500);
        } else {
          setError(result.error?.message || "Registration failed. Please try again.");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const result = await logout();
      if (result.success) {
        setSuccess("Logged out successfully!");
      } else {
        setError("Failed to log out.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to attempt login after registration
  const attemptLoginAfterRegistration = async () => {
    if (savedRegistrationData) {
      setIsLoading(true);
      try {
        const result = await login(
          savedRegistrationData.email,
          savedRegistrationData.password
        );
        if (result.success) {
          setSuccess("Successfully logged in with your new account!");
          setSavedRegistrationData(null);
        } else {
          setError("Failed to login with new account. Please try manually.");
        }
      } catch (err) {
        setError("An error occurred during automatic login. Please try manually.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Effect to attempt login automatically when needed
  useEffect(() => {
    if (activeTab === "login" && savedRegistrationData) {
      attemptLoginAfterRegistration();
    }
  }, [activeTab, savedRegistrationData]);

  // Create the skill data for radar chart
  const createSkillData = () => {
    const skillDistribution = buildSkillDistribution(environmentPerformance);
    
    return SKILLS.map(skill => {
      const mainModelSkill = skillDistribution.find(s => s.skill === skill) || { trueskill: 0, envs: [] };
      
      return {
        skill,
        mainTrueskill: mainModelSkill.trueskill,
        mainEnvs: mainModelSkill.envs,
      };
    });
  };
  
  // Calculate domain for radar chart
  const allTrueskillValues = environmentPerformance.length > 0 
    ? createSkillData().map(item => item.mainTrueskill).filter(val => val > 0)
    : [];

  // For sharing stats
  const handleShare = () => {
    if (!stats) return;
  
    const bestEnvs = [...envStats]
      .filter(env => env.is_best === true)
      .sort((a, b) => parseFloat(b.net_trueskill) - parseFloat(a.net_trueskill))
      .slice(0, 3);
  
    const challengingEnvs = [...envStats]
      .filter(env => env.is_best === false)
      .sort((a, b) => parseFloat(a.net_trueskill) - parseFloat(b.net_trueskill))
      .slice(0, 3)
      .reverse();
  
    const bestEnvsText = bestEnvs.length
      ? bestEnvs
          .map(
            (env, idx) =>
              `${idx + 1}. ${env.env_name}: WR ${safeToFixed(parseFloat(env.win_rate))}%`
          )
          .join("\n")
      : "N/A";
  
    const challengingEnvsText = challengingEnvs.length
      ? challengingEnvs
          .map(
            (env, idx) =>
              `${idx + 1}. ${env.env_name}: WR ${safeToFixed(parseFloat(env.win_rate))}%`
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

  // Show loading state while authentication is initializing
  if (!isInitialized) {
    return (
      <div className="container max-w-4xl py-10 flex flex-col items-center justify-center min-h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-white/70" />
        <p className="mt-4 text-white/70">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className={`${isMobile ? "px-2" : "container"} max-w-4xl py-6 sm:py-10`}>
      <h1 className="text-3xl font-bold mb-6 sm:mb-8 text-white font-mono">
        {isAuthenticated ? "Your Profile" : "Welcome to TextArena"}
      </h1>
  
      {/* Alert messages */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription className="font-mono">{error}</AlertDescription>
        </Alert>
      )}
  
      {success && (
        <Alert className="mb-6 bg-green-500/20 border-green-500/50">
          <AlertDescription className="font-mono">{success}</AlertDescription>
        </Alert>
      )}
  
      {/* Authentication card */}
      {isAuthenticated ? (
        <div className="space-y-6 sm:space-y-8">
          <Card className={`bg-[#021213]/50 border-white/10 text-white ${isMobile ? "mx-auto w-full" : ""}`}>
            <CardHeader className="pb-1">
              {/* First row: greeting and logout button side by side */}
              <div className="flex items-center justify-between w-full mb-1">
                <div className="flex items-center">
                  <CircleUserRound className={`${isMobile ? "h-5 w-5" : "h-6 w-6"} text-white/70 mr-2`} />
                  <CardTitle className="font-mono">Hello, {currentUser?.humanName || "Player"}!</CardTitle>
                </div>
                <Button 
                  variant="destructive" 
                  onClick={handleLogout}
                  disabled={isLoading}
                  className={`font-mono ${isMobile ? "text-xs py-1 px-2 h-7 min-h-0 min-w-0" : ""}`}
                  size={isMobile ? undefined : "sm"}
                >
                  {isLoading ? (
                    <Loader2 className={`${isMobile ? "h-3 w-3 mr-1" : "h-4 w-4 mr-2"} animate-spin`} />
                  ) : (
                    <LogOut className={`${isMobile ? "h-3 w-3 mr-1" : "h-4 w-4 mr-2"}`} />
                  )}
                  {isMobile ? "Logout" : "Sign Out"}
                </Button>
              </div>
              
              {/* Second row: description text below for both mobile and desktop */}
              <CardDescription className={`text-white/70 font-mono ${isMobile ? "text-xs" : ""}`}>
                You are currently signed in to your TextArena account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className={`mb-4 font-mono ${isMobile ? "text-xs" : ""}`}>
                Below you can view your game statistics and performance details.
              </p>
              
              {/* Stats Display */}
              <div className={`${isMobile ? "p-4" : "p-6"} border border-white/10 rounded-md bg-white/5`}>
                {isStatsLoading ? (
                  <div className="text-center py-4 flex flex-col items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-white/70 mb-2" />
                    <p className="text-white/70 font-mono">Loading your game statistics...</p>
                  </div>
                ) : statsError ? (
                  <div className="text-center text-red-500 py-4">
                    <p className="font-mono">{statsError}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={fetchStats} 
                      className="mt-2 font-mono"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : stats ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className={`${isMobile ? "text-base" : "text-lg"} font-medium font-mono`}>Your Game Statistics</h3>
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
                      </div>
                    </div>
                    
                    <div className="space-y-2 bg-black/20 p-4 rounded-md">
                      <div className="flex justify-between items-center">
                        <span className={`${isMobile ? "text-xs" : "text-sm"} font-medium font-mono`}>Games Played</span>
                        <span className={`${isMobile ? "text-xs" : "text-sm"} font-mono`}>{stats.total_games}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`${isMobile ? "text-xs" : "text-sm"} text-green-500 font-mono`}>Win: {stats.total_wins}</span>
                        <span className={`${isMobile ? "text-xs" : "text-sm"} text-gray-500 font-mono`}>Draw: {stats.total_draws}</span>
                        <span className={`${isMobile ? "text-xs" : "text-sm"} text-red-500 font-mono`}>Loss: {stats.total_losses}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`${isMobile ? "text-xs" : "text-sm"} font-medium font-mono`}>Win Rate (WR)</span>
                        <span className={`${isMobile ? "text-xs" : "text-sm"} font-mono`}>{safeToFixed(stats.win_rate)}%</span>
                      </div>
                    </div>

                    {envStats.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2 bg-black/20 p-4 rounded-md">
                          <h4 className={`${isMobile ? "text-xs" : "text-sm"} font-medium border-b border-white/10 pb-1 font-mono`}>
                            Best Environments
                          </h4>
                          {envStats.filter(env => env.is_best === true).length > 0 ? (
                            envStats
                              .filter(env => env.is_best === true)
                              .sort((a, b) => parseFloat(b.net_trueskill) - parseFloat(a.net_trueskill))
                              .slice(0, 3)
                              .map((env, idx) => (
                                <div
                                  key={env.environment_id}
                                  className={`flex justify-between items-center ${isMobile ? "text-[10px]" : "text-xs"} font-mono`}
                                >
                                  <span>{`${idx + 1}. ${env.env_name}`}</span>
                                  <div className="flex flex-col items-end">
                                    <span>WR: {safeToFixed(parseFloat(env.win_rate))}%</span>
                                    <div className="flex gap-2">
                                      <span className="text-white">
                                        TS: {safeToFixed(parseFloat(env.net_trueskill))}
                                      </span>
                                      <span className="text-white">
                                        PCT: {safeToFixed(parseFloat(env.percentile))}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))
                          ) : (
                            <div className="text-center py-4">
                              <p className={`text-white/70 mb-2 font-mono ${isMobile ? "text-xs" : "text-sm"}`}>Play more games to discover your best environments!</p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.location.href = '/'}
                                className="mt-2 font-mono"
                              >
                                Play Now
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2 bg-black/20 p-4 rounded-md">
                          <h4 className={`${isMobile ? "text-xs" : "text-sm"} font-medium border-b border-white/10 pb-1 font-mono`}>
                            Challenging Environments
                          </h4>
                          {envStats.filter(env => env.is_best === false).length > 0 ? (
                            envStats
                              .filter(env => env.is_best === false)
                              .sort((a, b) => parseFloat(a.net_trueskill) - parseFloat(b.net_trueskill))
                              .slice(0, 3)
                              .reverse()
                              .map((env, idx) => (
                                <div
                                  key={env.environment_id}
                                  className={`flex justify-between items-center ${isMobile ? "text-[10px]" : "text-xs"} font-mono`}
                                >
                                  <span>{`${idx + 1}. ${env.env_name}`}</span>
                                  <div className="flex flex-col items-end">
                                    <span>WR: {safeToFixed(parseFloat(env.win_rate))}%</span>
                                    <div className="flex gap-2">
                                      <span className="text-white">
                                        TS: {safeToFixed(parseFloat(env.net_trueskill))}
                                      </span>
                                      <span className="text-white">
                                        PCT: {safeToFixed(parseFloat(env.percentile))}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))
                          ) : (
                            <div className="text-center py-4">
                              <p className={`text-white/70 mb-2 font-mono ${isMobile ? "text-xs" : "text-sm"}`}>Play more games to discover your challenging environments!</p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.location.href = '/'}
                                className="mt-2 font-mono"
                              >
                                Play Now
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className={`text-white/70 mb-2 font-mono ${isMobile ? "text-xs" : "text-sm"}`}>No game data available yet.</p>
                    <p className={`text-white/70 ${isMobile ? "text-xs" : "text-sm"} font-mono`}>
                      Start playing to see your stats here!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Skill Distribution Radar Chart */}
          {stats && environmentPerformance.length > 0 && (
            <Card className={`bg-[#021213]/50 border-white/10 text-white ${isMobile ? "mx-auto w-full" : ""}`}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Scale className={`${isMobile ? "h-5 w-5" : "h-6 w-6"} text-white/70`} />
                  <CardTitle className={`font-mono ${isMobile ? "text-base" : ""}`}>Your Skill Distribution</CardTitle>
                </div>
                <CardDescription className={`text-white/70 font-mono ${isMobile ? "text-xs" : ""}`}>
                  This chart shows your skills across different strategic dimensions based on your game performance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSkillDistributionLoading ? (
                  <div className="text-center py-10 flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-white/70 mb-3" />
                    <p className="text-white/70 font-mono">Loading your skill distribution...</p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* For mobile devices, we'll use a completely different layout structure */}
                    {isMobile ? (
                      <div className="flex flex-col space-y-6">
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
                                data={createSkillData()}
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

                                <Radar
                                  name="Your Skills"
                                  dataKey="mainTrueskill"
                                  stroke={RADAR_COLORS.main}
                                  fill={RADAR_COLORS.main}
                                  fillOpacity={0.6}
                                  className="cursor-pointer"
                                  radiusScale={0.75}
                                  activeDot={{
                                    r: 4,
                                    stroke: "white",
                                    strokeWidth: 2,
                                    fill: RADAR_COLORS.main,
                                  }}
                                />
                                
                                <Legend 
                                  align="center"
                                  verticalAlign="top"
                                  wrapperStyle={{ 
                                    color: "white", 
                                    fontFamily: "var(--font-mono)",
                                    fontSize: 9,
                                    marginTop: "-40px"
                                  }}
                                />
                              </RadarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Desktop layout */
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
                                data={createSkillData()}
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

                                <Radar
                                  name="Your Skills"
                                  dataKey="mainTrueskill"
                                  stroke={RADAR_COLORS.main}
                                  fill={RADAR_COLORS.main}
                                  fillOpacity={0.6}
                                  className="cursor-pointer"
                                  radiusScale={0.75}
                                  activeDot={{
                                    r: 6,
                                    stroke: "white",
                                    strokeWidth: 2,
                                    fill: RADAR_COLORS.main,
                                  }}
                                />
                                
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
                    )}
                    
                    <div className="mt-4 text-center text-white/70 text-sm">
                      <p className="font-mono">Click on the chart to see detailed skill information. The radar visualizes your skill levels across different cognitive and strategic dimensions.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card className={`bg-[#021213]/50 border-white/10 text-white ${isMobile ? "mx-auto w-full" : ""}`}>
          <CardHeader>
            <CardTitle className="font-mono">Sign In to Your Account</CardTitle>
            <CardDescription className="text-white/70 font-mono">
              Access your game stats and track your progress.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 bg-[#021213]">
                <TabsTrigger value="login" className="font-mono">Login</TabsTrigger>
                <TabsTrigger value="register" className="font-mono">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="pt-4">
                <form onSubmit={handleLogin}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email" className="font-mono">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        required
                        className="bg-[#021213]/70 border-white/10 font-mono"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password" className="font-mono">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        className="bg-[#021213]/70 border-white/10 font-mono"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      />
                    </div>
                    <Button type="submit" disabled={isLoading} className="font-mono">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="register" className="pt-4">
                <form onSubmit={handleRegister}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name" className="font-mono">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        required
                        className="bg-[#021213]/70 border-white/10 font-mono"
                        value={registerData.humanName}
                        onChange={(e) => setRegisterData({ ...registerData, humanName: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="register-email" className="font-mono">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="name@example.com"
                        required
                        className="bg-[#021213]/70 border-white/10 font-mono"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="register-password" className="font-mono">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        required
                        className="bg-[#021213]/70 border-white/10 font-mono"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirm-password" className="font-mono">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        required
                        className="bg-[#021213]/70 border-white/10 font-mono"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      />
                    </div>
                    
                    {/* New checkbox for Terms of Service */}
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="terms" 
                        checked={registerData.agreeToTerms}
                        onCheckedChange={(checked) => 
                          setRegisterData({ ...registerData, agreeToTerms: checked === true })
                        }
                        required
                      />
                      <label 
                        htmlFor="terms" 
                        className="text-sm font-mono text-white/70 cursor-pointer"
                      >
                        I agree to the <a href="/terms" className="text-blue-400 hover:underline" target="_blank">Terms of Service</a>
                      </label>
                    </div>
                    
                    {/* New checkbox for marketing communications */}
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="marketing" 
                        checked={registerData.agreeToMarketing}
                        onCheckedChange={(checked) => 
                          setRegisterData({ ...registerData, agreeToMarketing: checked === true })
                        }
                      />
                      <label 
                        htmlFor="marketing" 
                        className="text-sm font-mono text-white/70 cursor-pointer"
                      >
                        TextArena is pretty cool. I don't mind helping out and receiving emails for coming hackathons and competitions. Give me some prize money - I need them for GPU.
                      </label>
                    </div>
                    
                    <Button type="submit" disabled={isLoading} className="font-mono">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}