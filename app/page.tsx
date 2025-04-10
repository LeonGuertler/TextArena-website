"use client"

import { useEffect, useRef, useState } from "react"
import { supabase } from "@/lib/supabase"
import { EnvironmentSelector } from "@/components/environment-selector"
import AnimatedQueueDisplay from "@/components/animated-queue-display"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { GameOverModal } from "@/components/game-over-modal"
import { Toaster } from "sonner"
import { useAuth } from "@/context/AuthContext"
import { HumanStats } from "@/components/HumanStats"
import {
  BarChart2,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  Signal
} from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile";

// ===== Types =====
type EnvOption = {
  id: string
  env_name: string
  description: string
  active: boolean
  num_players: number
}

type Message = {
  sender: "left" | "right" | "center"
  text: string
}

type GameResult = {
  opponent_name: string
  opponent_elo: number
  change_in_elo: number
  game_id: number
  outcome: string
  reason: string
}

type MatchmakingStatus = {
  avg_queue_time: number
  num_players_in_queue: number
  allow_connection: boolean
}

// Server URLs - Update these with your actual server addresses
const MATCHMAKING_WS_URI = "wss://matchmaking.textarena.ai/ws"

// Sound effect paths
const SOUND_MATCHFOUND_COMMON = "/sounds/match_found_common.wav"
const SOUND_MATCHFOUND_RARE = "/sounds/match_found_rare.wav"
const SOUND_MYTURN = "/sounds/my_turn.wav"

function formatQueueTime(seconds: number): string {
  if (isNaN(seconds)) return "0s"

  if (seconds < 60) {
    return `${Math.round(seconds)}s`
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.round(seconds % 60)

  if (remainingSeconds === 0) {
    return `${minutes}min`
  }

  return `${minutes}min ${remainingSeconds}s`
}

export default function PlayPage() {
  const DEFAULT_SELECTED_ENVIRONMENTS = [0, 3, 6, 8, 9, 10, 12, 13, 14, 15]

  // Environment & queue states
  const [envOptions, setEnvOptions] = useState<EnvOption[]>([])
  const [selectedGames, setSelectedGames] = useState<number[]>([])
  const [showGameSelection, setShowGameSelection] = useState(false)
  const [isInQueue, setIsInQueue] = useState(false)
  const [isInMatch, setIsInMatch] = useState(false)
  const [gameConnected, setGameConnected] = useState(false)
  const [isMatchFound, setIsMatchFound] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('');

  // WebSocket - separate refs for matchmaking and game connections
  const { token, isInitialized } = useAuth()
  const matchmakingWsRef = useRef<WebSocket | null>(null)
  const gameWsRef = useRef<WebSocket | null>(null)
  const [wsStatus, setWsStatus] = useState("Disconnected")
  
  // Game server info from matchmaking
  const [gameServerIP, setGameServerIP] = useState<string | null>(null)
  const [environmentId, setEnvironmentId] = useState<number | null>(null)

  // Player & turn
  const [playerId, setPlayerId] = useState<number | null>(null)
  const playerIdRef = useRef<number | null>(null)
  const [myTurn, setMyTurn] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Messages
  const [messages, setMessages] = useState<Message[]>([])
  const [playerInput, setPlayerInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Queue timing
  const [queueStartTime, setQueueStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState("00:00")

  // Opponent time
  const [opponentTimeLeft, setOpponentTimeLeft] = useState(0)
  const opponentIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Game Over popup
  const [gameResult, setGameResult] = useState<GameResult | null>(null)
  const [isGameResultMinimized, setIsGameResultMinimized] = useState(false)

  // Connection lost popup state
  const [connectionLost, setConnectionLost] = useState(false)
  
  // Add this state variable
  const [timeoutInfo, setTimeoutInfo] = useState<{
    playerId: number | null;
    isMe: boolean;
    message: string;
  }>({
    playerId: null,
    isMe: false,
    message: "Your opponent has disconnected from the server."
  });

  // Mute state & ref to avoid stale closures in callbacks
  const [isMuted, setIsMuted] = useState(false)
  const isMutedRef = useRef(isMuted)
  useEffect(() => {
    isMutedRef.current = isMuted
  }, [isMuted])

  const [statsVisible, setStatsVisible] = useState(false)

  // Server stats
  const [serverStats, setServerStats] = useState<{
    avgQueueTime: string
    activePlayers: number
    allowConnection: boolean
  }>({
    avgQueueTime: "0min",
    activePlayers: 0,
    allowConnection: true
  })

  // Matchmaking status check interval
  const matchmakingCheckInterval = useRef<NodeJS.Timeout | null>(null)

  // Return to queue handler
  const handleReturnToQueue = () => {
    // Close any existing WebSocket connections
    if (gameWsRef.current) {
      gameWsRef.current.close();
      gameWsRef.current = null;
    }
    
    if (matchmakingWsRef.current) {
      matchmakingWsRef.current.close();
      matchmakingWsRef.current = null;
    }
    
    // Reset all game state
    setGameConnected(false);
    setIsInMatch(false);
    setIsMatchFound(false); // Also reset match found state
    setConnectionStatus('');
    setGameResult(null);
    setIsGameResultMinimized(false);
    setMyTurn(false);
    setMessages([]);
    setPlayerInput("");
    setIsInQueue(false);
    setQueueStartTime(null);
    stopTurnTimer();
    stopOpponentTimer();
    setPlayerId(null);
    playerIdRef.current = null;
    setShowGameSelection(true);
    setConnectionLost(false);
    setGameServerIP(null);
    setEnvironmentId(null);

    // Reconnect to matchmaking if needed
    connectToMatchmaking();
  }

  // Detect mobile devices
  const isMobile = useIsMobile();

  // Get icon color based on connection state
  const getIconColor = (status) => {
    switch (status.toLowerCase()) {
      case 'connected':
        return 'text-green-500';
      case 'disconnected':
        return 'text-red-500';
      case 'error':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  }

  // Connect to the matchmaking server
  const connectToMatchmaking = () => {
    if (!isInitialized || !token) return
    
    // Close any existing connections
    if (matchmakingWsRef.current) {
      matchmakingWsRef.current.close()
    }
    
    // Set up new connection to matchmaking server
    const matchmakingWs = new WebSocket(`${MATCHMAKING_WS_URI}?user_id=${token}`)
    matchmakingWsRef.current = matchmakingWs
    
    matchmakingWs.onopen = () => {
      console.log("Connected to matchmaking server")
      setWsStatus("Connected")
    }
    
    matchmakingWs.onmessage = (event) => {
      console.log("Received from matchmaking:", event.data)
      try {
        const msg = JSON.parse(event.data)
        handleMatchmakingMessage(msg)
      } catch (err) {
        console.warn("Non-JSON message from matchmaking:", event.data)
      }
    }
    
    matchmakingWs.onerror = (error) => {
      console.error("Matchmaking WebSocket error:", error)
      setWsStatus("Error")
    }
    
    matchmakingWs.onclose = () => {
      console.log("Matchmaking WebSocket closed")
      // Only set disconnected if we're not transitioning to a game server
      if (!gameServerIP) {
        setWsStatus("Disconnected")
      }
    }
  }
  
  // Connect to a game server after getting server info from matchmaking
  const connectToGameServer = () => {
    if (!gameServerIP || !token) {
      console.error("No game server IP or token available");
      return;
    }
    
    // Explicitly hide queue UI elements but keep match found state
    setShowGameSelection(false);
    setIsInQueue(false);
    setQueueStartTime(null);
    
    // Close any existing game connection
    if (gameWsRef.current) {
      gameWsRef.current.close();
    }
    
    // ===== BUFFER PERIOD BEFORE ATTEMPTING CONNECTION =====
    // Show "Match Found" animation for a bit longer to give server time to initialize
    const bufferPeriod = 10000; // 10 second buffer before first connection attempt
    const initialDelay = 7000; // Additional 3 second server preparation time after buffer
    const totalDelayBeforeConnect = bufferPeriod + initialDelay;
    
    // Update UI to show initialization starting
    setConnectionStatus("Preparing game environment...");
    
    console.log(`Waiting ${bufferPeriod/1000}s buffer period for match found screen...`);
    
    // First wait for buffer period to show match found animation
    setTimeout(() => {
      setConnectionStatus("Initializing game server...");
      console.log(`Buffer period complete. Waiting ${initialDelay/1000}s for server initialization...`);
      
      // Then wait for server initialization
      setTimeout(() => {
        // Retry configuration
        const maxAttempts = 10;
        let currentAttempt = 1;
        const baseDelay = 2000; // 2 seconds
        
        // Function to attempt connection with retries
        const attemptConnection = () => {
          console.log(`Connecting to game server (attempt ${currentAttempt}/${maxAttempts}): ${gameServerIP}`);
          setConnectionStatus(`Connecting to game server (attempt ${currentAttempt}/${maxAttempts})...`);
          
          // Set up new connection to game server
          const gameWs = new WebSocket(`wss://${gameServerIP}/ws?token=${token}`);
          gameWsRef.current = gameWs;
          
          let connectionTimeout = setTimeout(() => {
            // If connection is still connecting after 10 seconds, consider it failed
            if (gameWs.readyState === WebSocket.CONNECTING) {
              console.log("Connection attempt timed out after 10 seconds");
              gameWs.close();
              retryConnection();
            }
          }, 10000);
          
          gameWs.onopen = () => {
            clearTimeout(connectionTimeout);
            console.log("Connected to game server:", gameServerIP);
            setWsStatus("Connected");
            setConnectionStatus("Connected to game server. Waiting for game to start...");
            
            // Successfully connected, now transition to game UI
            setGameConnected(true);
            setIsMatchFound(false); // Hide the match found UI
            
            // // Only add the connection message once we've transitioned to the game UI
            // // This prevents duplicate messages between AnimatedQueueDisplay and the game chat
            // setMessages([{
            //   sender: "center",
            //   text: "Connected to game server. Waiting for game to start..."
            // }]);
            
            // Start sending periodic pings to keep connection alive
            const pingInterval = setInterval(() => {
              if (gameWs.readyState === WebSocket.OPEN) {
                gameWs.send(JSON.stringify({ command: "ping" }));
              } else {
                clearInterval(pingInterval);
              }
            }, 25000);
          };
          
          gameWs.onmessage = (event) => {
            console.log("Received from game server:", event.data);
            try {
              const msg = JSON.parse(event.data);
              handleGameServerMessage(msg);
            } catch (err) {
              console.warn("Non-JSON message from game server:", event.data);
            }
          };
          
          gameWs.onerror = (error) => {
            clearTimeout(connectionTimeout);
            console.error("Game server WebSocket error:", error);
            setWsStatus("Error");
            retryConnection();
          };
          
          gameWs.onclose = (event) => {
            clearTimeout(connectionTimeout);
            console.log(`Game server WebSocket closed with code ${event.code}`);
            setWsStatus("Disconnected");
            stopTurnTimer();
            stopOpponentTimer();
            
            // Only show connection lost if we're still in an active match
            // and don't have a game result (which would indicate proper game end)
            if (isInMatch && !gameResult) {
              // If this is the first few connection attempts, don't show connection lost yet
              if (currentAttempt >= maxAttempts / 2) {
                setConnectionLost(true);
                setGameConnected(false); // Reset gameConnected state
                setIsMatchFound(false); // Also reset match found state
              } else {
                retryConnection();
              }
            } else if (currentAttempt >= maxAttempts) {
              // If we've exhausted all attempts and never got into a match
              setGameConnected(false);
              setIsMatchFound(false); // Reset match found state
              setConnectionLost(true);
            }
          };
        };
        
        // Function to handle retries with exponential backoff
        const retryConnection = () => {
          if (currentAttempt < maxAttempts) {
            currentAttempt++;
            // Calculate delay with exponential backoff (2^attempt seconds)
            const delay = Math.min(baseDelay * Math.pow(2, currentAttempt - 1), 30000); // Max 30 seconds
            console.log(`Retrying connection in ${delay/1000}s (attempt ${currentAttempt}/${maxAttempts})`);
            
            // Update connection status
            setConnectionStatus(`Connection failed. Retrying in ${Math.round(delay/1000)}s...`);
            
            // Only update messages if we're not showing the match found UI anymore
            if (!isMatchFound) {
              setMessages(prev => [...prev, {
                sender: "center",
                text: `Connection failed. Retrying in ${Math.round(delay/1000)}s...`
              }]);
            }
            
            setTimeout(attemptConnection, delay);
          } else {
            console.error("Failed to connect after maximum attempts");
            setGameConnected(false); // Make sure to reset this
            setIsMatchFound(false); // Also reset match found state
            setConnectionLost(true);
            
            // Only add failure message if we're not showing the match found UI
            if (!isMatchFound) {
              setMessages(prev => [...prev, {
                sender: "center",
                text: "Failed to connect to game server after multiple attempts."
              }]);
            }
          }
        };
        
        // Start the first connection attempt
        attemptConnection();
        
      }, initialDelay);
    }, bufferPeriod);
  };

  // Fetch environment options
  useEffect(() => {
    supabase
    .from("environments")
    .select("id, env_name, description, active, num_players")
    .then(({ data, error }) => {
      if (error) {
        console.error("Error fetching environments:", error)
      } else if (data) {
        setEnvOptions(data)
        const defaultEnvIds = data
          .filter((e) => DEFAULT_SELECTED_ENVIRONMENTS.includes(parseInt(e.id)))
          .map((e) => parseInt(e.id))
        setSelectedGames(defaultEnvIds)
      }
    })
  }, [])

  // Check matchmaking status periodically
  const checkMatchmakingStatus = async () => {
    try {
      // Updated to use the new matchmaking server
      const response = await fetch('https://matchmaking.textarena.ai/check_matchmaking', {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to check matchmaking status')
      }

      const data: MatchmakingStatus = await response.json()

      setServerStats({
        avgQueueTime: formatQueueTime(data.avg_queue_time),
        activePlayers: data.num_players_in_queue,
        allowConnection: data.allow_connection
      })
    } catch (error) {
      console.error('Error checking matchmaking status:', error)
    }
  }

  // Set up matchmaking status checks
  useEffect(() => {
    checkMatchmakingStatus()
    matchmakingCheckInterval.current = setInterval(checkMatchmakingStatus, 30000)
    return () => {
      if (matchmakingCheckInterval.current) {
        clearInterval(matchmakingCheckInterval.current)
      }
    }
  }, [])

  // Initial connection to matchmaking
  useEffect(() => {
    if (!isInitialized || !token) return
    connectToMatchmaking()
    
    return () => {
      // Clean up connections on unmount
      if (matchmakingWsRef.current) {
        matchmakingWsRef.current.close()
      }
      if (gameWsRef.current) {
        gameWsRef.current.close()
      }
    }
  }, [isInitialized, token])

  // Connect to game server when IP becomes available
  useEffect(() => {
    if (gameServerIP) {
      connectToGameServer()
    }
  }, [gameServerIP])

  // Update elapsed queue time
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (queueStartTime) {
      timer = setInterval(() => {
        const diff = Date.now() - queueStartTime
        const minutes = Math.floor(diff / 60000)
        const seconds = Math.floor((diff % 60000) / 1000)
        setElapsedTime(
          `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        )
      }, 1000)
    } else {
      setElapsedTime("00:00")
    }
    return () => clearInterval(timer)
  }, [queueStartTime])

  // Auto-scroll messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Reset queue on game over
  useEffect(() => {
    if (gameResult) {
      setIsInQueue(false)
      setQueueStartTime(null)
    }
  }, [gameResult])

  // Matchmaking message handler
  // Matchmaking message handler
  function handleMatchmakingMessage(msg: any) {
    switch (msg.command) {
      case "init":
        setServerStats({
          avgQueueTime: formatQueueTime(msg.avg_queue_time),
          activePlayers: msg.num_players_in_queue,
          allowConnection: msg.allow_connection
        })
        break

      case "queued":
        setIsInQueue(true)
        setQueueStartTime(Date.now())
        if (msg.avg_queue_time !== undefined && msg.num_players_in_queue !== undefined) {
          setServerStats(prev => ({
            ...prev,
            avgQueueTime: formatQueueTime(msg.avg_queue_time),
            activePlayers: msg.num_players_in_queue
          }))
        }
        break

      case "left":
        setIsInQueue(false)
        setQueueStartTime(null)
        break

      case "match_found":
        playMatchFoundSound();
        console.log("Match found! Game info:", msg);
        
        // Reset queue states but keep isInQueue true to show transition
        setQueueStartTime(null);
        
        // Explicitly hide game selection UI 
        setShowGameSelection(false);
        
        // Store game server information
        const serverUrl = msg.game_url || msg.server_ip;
        if (!serverUrl) {
          console.error("No game server URL/IP provided in match_found message");
          return;
        }
        
        // Store the game server URL and environment ID
        setGameServerIP(serverUrl);
        setEnvironmentId(msg.environment_id);
        
        // Set matchFound state to true to show the match found screen
        setIsMatchFound(true);
        
        // Set connection status for the AnimatedQueueDisplay
        setConnectionStatus("Connecting to game server...");
        
        // Don't add messages when using AnimatedQueueDisplay
        // We'll only add messages once the actual game connection happens
        
        break;

      case "error":
        console.error("Matchmaking error:", msg.message)
        // Show error to the user
        setMessages(prev => [...prev, {
          sender: "center",
          text: `Matchmaking error: ${msg.message}`
        }])
        break

      default:
        console.warn("Unhandled matchmaking command:", msg)
        break
    }
  }

  // Game server message handler
  function handleGameServerMessage(msg: any) {
    switch (msg.command) {
      case "observation":
        if (msg.player_id !== undefined) {
          // First observation also sets the player ID
          console.log("Setting player ID and activating match UI:", msg.player_id);
          setPlayerId(msg.player_id);
          playerIdRef.current = msg.player_id;
          setIsInMatch(true); // Now we're in a match with player IDs assigned
          setGameResult(null); // Clear any previous game results
          setIsGameResultMinimized(false);
          setShowGameSelection(false); // Ensure game selection is hidden
          startMyTurn(msg.observation, msg.player_id);
        } else if (playerIdRef.current !== null) {
          startMyTurn(msg.observation, playerIdRef.current);
        }
        break;
  
      case "game_over":
        setMyTurn(false)
        stopTurnTimer()
        stopOpponentTimer()
        setMessages(prev => [...prev, { sender: "center", text: "Game Over." }])
        setGameResult({
          game_id: msg.game_id,
          opponent_name: msg.opponents,
          opponent_elo: msg.opponents_ts,
          change_in_elo: msg.trueskill_change,
          outcome: msg.outcome,
          reason: msg.reason || "Unknown"
        })
        
        // Mark that the match is over
        setIsInMatch(false)
        
        // The rest of the game_over handler remains the same
        if (msg.reason === "disconnect" || msg.reason?.includes("disconnect")) {
          setQueueStartTime(null)
          setShowGameSelection(false)
        }
        break
        
      case "timed_out":
        setMyTurn(false)
        stopTurnTimer()
        stopOpponentTimer()
        
        // Extract player ID information if available in the message
        let timedOutPlayerId = null;
        let timedOutMessage = msg.message || "A player timed out";
        let isCurrentPlayer = false;
        
        // Check if the message contains player ID information
        if (timedOutMessage.includes("Player")) {
          // Try to extract player ID from message like "Player 0 timed out"
          const match = timedOutMessage.match(/Player (\d+)/);
          if (match && match[1]) {
            timedOutPlayerId = parseInt(match[1]);
            // Check if it was the current player who timed out
            isCurrentPlayer = timedOutPlayerId === playerIdRef.current;
          }
        }
        
        // Set timeout information with appropriate message
        setTimeoutInfo({
          playerId: timedOutPlayerId,
          isMe: isCurrentPlayer,
          message: isCurrentPlayer 
            ? "You have timed out. This game won't be counted."
            : "Your opponent has timed out. This game won't be counted."
        });
        
        setMessages(prev => [...prev, { 
          sender: "center", 
          text: `Game ended: ${timedOutMessage}` 
        }]);
        
        // Mark that the match is over
        setIsInMatch(false);
        setConnectionLost(true);
        break;
  
      case "server_shutdown":
        setMessages(prev => [...prev, { 
          sender: "center", 
          text: "The game server is shutting down. Game complete." 
        }])
        // Handle similar to disconnection
        setIsInMatch(false)
        if (!gameResult) {
          setConnectionLost(true)
        }
        break
  
      case "error":
        console.error("Game server error:", msg.message)
        setMessages(prev => [...prev, { 
          sender: "center", 
          text: `Error: ${msg.message}` 
        }])
        break
  
      case "pong":
        // Response to our ping - no action needed
        break
  
      case "action_ack":
        // Acknowledgment of our action - can be used for UI feedback
        console.log("Action acknowledged by server")
        break
  
      default:
        console.warn("Unhandled game server command:", msg)
        break
    }
  }

  // Sound effect: match found (with rare chance)
  function playMatchFoundSound() {
    if (isMutedRef.current) return
    const rnd = Math.random()
    if (rnd < 0.1) {
      new Audio(SOUND_MATCHFOUND_RARE).play()
    } else {
      new Audio(SOUND_MATCHFOUND_COMMON).play()
    }
  }

  // Sound effect: my turn
  function playMyTurnSound() {
    if (isMutedRef.current) return
    new Audio(SOUND_MYTURN).play()
  }

  function startMyTurn(observation: any[], myPlayer: number) {
    appendObservation(observation, myPlayer)
    setMyTurn(true)
    setTimeLeft(180)

    stopOpponentTimer()
    playMyTurnSound()

    inputRef.current?.focus()

    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          stopTurnTimer()
          setMyTurn(false)
          // gameWsRef.current?.send(JSON.stringify({ command: "action", action: "TIMEOUT" }))
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  function stopTurnTimer() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setTimeLeft(0)
  }

  function startOpponentTimer() {
    setOpponentTimeLeft(180)
    if (opponentIntervalRef.current) clearInterval(opponentIntervalRef.current)
    opponentIntervalRef.current = setInterval(() => {
      setOpponentTimeLeft(t => {
        if (t <= 1) {
          clearInterval(opponentIntervalRef.current!)
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  function stopOpponentTimer() {
    if (opponentIntervalRef.current) {
      clearInterval(opponentIntervalRef.current)
      opponentIntervalRef.current = null
    }
    setOpponentTimeLeft(0)
  }

  function appendObservation(obs: any[], myPlayer: number) {
    const newMsgs = obs.map(([senderId, text]: [any, string]) => {
      const id = String(senderId).toLowerCase()
      if (id === "game" || id === "-1" || senderId === -1) {
        return { sender: "center" as const, text }
      } else if (senderId === myPlayer) {
        return { sender: "right" as const, text }
      } else {
        return { sender: "left" as const, text }
      }
    })
  
    setMessages(prev => {
      // Filter out server-echoed messages that are just the user's input with formatting
      const filteredMsgs = newMsgs.filter(newMsg => {
        if (newMsg.sender !== "right") return true; // Keep non-user messages
        
        // Check if this is just an echo of the last user message
        if (prev.length > 0) {
          const lastMsg = prev[prev.length - 1];
          
          // If the last message was from the user
          if (lastMsg.sender === "right") {
            const userInput = lastMsg.text;
            const serverEcho = newMsg.text;
            
            // Check if server echo is the same as user input or just has brackets/formatting
            const normalizedInput = userInput.trim();
            const normalizedEcho = serverEcho.replace(/^\[|\]$/g, '').trim();
            
            // If it's essentially the same message, filter it out
            if (normalizedInput === normalizedEcho || 
                serverEcho.includes(userInput)) {
              return false;
            }
          }
        }
        return true;
      });
  
      return [...prev, ...filteredMsgs];
    });
  }

  function sendAction() {
    if (!myTurn || !playerInput.trim()) return
    if (!isInMatch || !gameWsRef.current || gameWsRef.current.readyState !== WebSocket.OPEN) return

    const userMessage = playerInput.trim()
    setMessages(prev => [...prev, { sender: "right", text: userMessage }])
    gameWsRef.current.send(JSON.stringify({ command: "action", action: userMessage }))
    setMyTurn(false)
    setPlayerInput("")
    stopTurnTimer()
    startOpponentTimer()
  }

  function handleQueueClick() {
    // Clear game-over state to allow the queue overlay to appear.
    setGameResult(null)
    setIsGameResultMinimized(false)
    setIsInMatch(false)
    setMessages([])
    setQueueStartTime(null)

    const ws = matchmakingWsRef.current

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      // Reconnect to matchmaking
      connectToMatchmaking()
      
      // We'll queue once the connection is established in the onopen handler
      const newWs = matchmakingWsRef.current
      if (newWs) {
        const originalOnOpen = newWs.onopen
        newWs.onopen = (event) => {
          // Call the original handler if it exists
          if (originalOnOpen) originalOnOpen.call(newWs, event)
          
          // Then send the queue command
          if (selectedGames.length > 0) {
            newWs.send(JSON.stringify({ command: "queue", environments: selectedGames }))
            setShowGameSelection(false)
          }
        }
      }
      
      return
    }
    
    if (selectedGames.length === 0) {
      alert("Please select at least one environment.")
      return
    }

    ws.send(JSON.stringify({ command: "queue", environments: selectedGames }))
    setShowGameSelection(false)
  }

  function handleLeaveQueue() {
    const ws = matchmakingWsRef.current
    if (!ws || ws.readyState !== WebSocket.OPEN) return

    ws.send(JSON.stringify({ command: "leave" }))
    // Update local state to reflect that the user has left the queue.
    setIsInQueue(false)
    setQueueStartTime(null)
    setShowGameSelection(true)
  }

  function handleConnectionLostClose() {
    setConnectionLost(false)
    setIsInMatch(false)
    setIsInQueue(false)
    setMyTurn(false)
    setPlayerInput("")
    setGameConnected(false)
    setIsMatchFound(false)
    setGameResult(null)
    setIsGameResultMinimized(false)
    setShowGameSelection(true)  // Show game selection in the queue overlay
    setConnectionStatus('')
    setMessages([])
    
    // Clear WebSocket references
    if (gameWsRef.current) {
      gameWsRef.current.close()
      gameWsRef.current = null
    }
    
    if (matchmakingWsRef.current) {
      matchmakingWsRef.current.close()
      matchmakingWsRef.current = null
    }
    
    // Reconnect to matchmaking
    connectToMatchmaking()
  }

  // Rest of the component remains largely the same (render methods)
  return (
    <div className="flex flex-col h-screen relative font-mono">
      {/* Chat Messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-auto pt-16 px-4 pb-4">
        {messages.map((m, i) => {
          let containerClass = "flex justify-center mb-2"
          let maxWidthClass = "max-w-[60%]"

          if (m.sender === "left") containerClass = "flex justify-start mb-2"
          else if (m.sender === "right") containerClass = "flex justify-end mb-2"

          let bubbleClass = "text-muted-foreground"
          if (m.sender === "left") {
            bubbleClass = "bg-accent text-accent-foreground px-3 py-1.5 rounded-lg"
          } else if (m.sender === "right") {
            bubbleClass = "bg-primary text-primary-foreground px-3 py-1.5 rounded-lg"
          }

          // Name text alignment class based on sender position
          const nameAlignClass = m.sender === "left" ? "text-left" : "text-right"

          return (
            <div key={i} className={containerClass}>
              <div className={maxWidthClass}>
                {/* Player name with appropriate alignment */}
                {m.sender !== "center" && (
                  <div className={`text-xs text-muted-foreground mb-1 ${nameAlignClass}`}>
                    {m.sender === "left" ? `Player ${playerId === 0 ? 1 : 0}` : `Player ${playerId}`}
                  </div>
                )}
                <span
                  className={cn(
                    bubbleClass,
                    "whitespace-pre-wrap break-words inline-block",
                    m.sender === "center" ? "text-center w-full" : ""
                  )}
                >
                  {m.text}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Overlay: Waiting for opponent's first action */}
      {gameConnected && !myTurn && messages.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-background/80 p-4 rounded">
            <span className="text-lg text-muted-foreground">
              Waiting for opponent to submit the first action...
            </span>
          </div>
        </div>
      )}

      {/* Connection Limit Overlay */}
      {!serverStats.allowConnection && (
        <div className="absolute inset-0 bg-background/95 flex items-center justify-center z-50">
          <div className="max-w-md p-6 text-center space-y-4 font-mono">
            <h2 className="text-xl font-semibold text-red-500">Server At Capacity</h2>
            <p className="text-muted-foreground">
              We're currently experiencing high traffic and cannot accept new connections.
              Please try again later.
            </p>
            <p className="text-sm text-muted-foreground">
              Current active players: {serverStats.activePlayers}
            </p>
            <Button onClick={() => window.location.reload()} className="mt-4 bg-primary hover:bg-primary/80 text-primary-foreground">
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Match Input Bar */}
      {isInMatch && (
        <div className="p-4 border-t border-gray-300 flex items-center gap-2">
          {myTurn ? (
            <>
              <input
                ref={inputRef}
                className="border p-2 flex-1 text-sm bg-navbar"
                type="text"
                placeholder="Type your move..."
                value={playerInput}
                onChange={(e) => setPlayerInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    sendAction()
                  }
                }}
                autoFocus
              />
              <Button onClick={sendAction} disabled={!myTurn || !playerInput.trim()} className="bg-primary hover:bg-primary/80 text-primary-foreground">
                Send
              </Button>
              <span className="ml-2 text-sm text-muted-foreground">Time Left: {timeLeft}s</span>
            </>
          ) : (
            <span className="text-sm">
              Waiting for Opponent... (Time left: {opponentTimeLeft}s)
            </span>
          )}
        </div>
      )}

      {/* Queue Overlay */}
      {!isInMatch && !gameConnected && !connectionLost && !isGameResultMinimized && serverStats.allowConnection && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-20">
          <AnimatedQueueDisplay
            isInQueue={isInQueue}
            isMatchFound={isMatchFound}
            environments={selectedGames.map(envId => {
              const env = envOptions.find(e => parseInt(e.id) === envId)
              return env ? env.env_name : `Env #${envId}`
            })}
            elapsedTime={elapsedTime}
            avgQueueTime={serverStats.avgQueueTime}
            activePlayers={serverStats.activePlayers}
            showGameSelection={showGameSelection}
            onShowGameSelection={(show) => {
              // Only allow showing game selection if we're not connecting to a game
              if ((!gameConnected && !isMatchFound) || !show) {
                setShowGameSelection(show)
              }
            }}
            selectedGamesCount={selectedGames.length}
            gameSelectionUI={
              <EnvironmentSelector
                options={envOptions}
                selectedGames={selectedGames}
                onSelectedGamesChange={setSelectedGames}
              />
            }
            onQueueClick={handleQueueClick}
            onLeaveQueue={handleLeaveQueue}
            wsStatus={wsStatus}
            connectionStatus={connectionStatus}
          />
        </div>
      )}

      {/* Top Right Panel */}
      <div className="absolute top-4 right-4 z-50">
        <div className="flex items-center bg-black/30 backdrop-blur-md p-2 rounded-lg">
          {/* Stats Toggle */}
          <div className="flex items-center px-3">
            <button
              onClick={() => setStatsVisible((prev) => !prev)}
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <BarChart2 className="h-5 w-5" />
              {statsVisible ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Mute/Unmute */}
          <div className="flex items-center px-3 border-x border-gray-700">
            <button
              onClick={() => setIsMuted((prev) => !prev)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* WebSocket Status */}
          <div className="flex items-center px-3">
            {!isMobile ? (
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                WebSocket: {wsStatus}
              </span>
            ) : (
              <Signal 
                className={cn(
                  "h-4 w-4",
                  getIconColor(wsStatus)
                )}
              />
            )}
          </div>
        </div>
      </div>

      {/* HumanStats Panel */}
      <HumanStats
        isMinimized={!statsVisible}
        setIsMinimized={(min) => setStatsVisible(!min)}
      />

      {/* Game Over Modal */}
      {gameResult && (
        <GameOverModal
          gameResult={gameResult}
          onClose={() => setGameResult(null)}
          onReturnToQueue={handleReturnToQueue}
          onMinimize={(minimized) => setIsGameResultMinimized(minimized)}
          chatRef={chatContainerRef}
          wsRef={gameWsRef}
        />
      )}

      {/* Connection Lost Modal */}
      {connectionLost && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-40">
          <div className="bg-navbar p-6 rounded-md shadow-lg w-full max-w-sm text-navbarForeground text-center font-mono">
            <h2 className="text-lg font-semibold mb-2">
              {timeoutInfo.isMe ? "You Timed Out" : "Connection Lost"}
            </h2>
            <p className="mb-4">
              {timeoutInfo.message}
            </p>
            <Button
              onClick={handleConnectionLostClose}
              className="mx-auto bg-background hover:bg-muted text-foreground font-mono"
            >
              Close
            </Button>
          </div>
        </div>
      )}

    </div>
  )
}