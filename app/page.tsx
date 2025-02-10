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
  VolumeX
} from "lucide-react"

// ===== Types =====
type EnvOption = {
  id: string
  env_name: string
  description: string
  active: boolean
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
  num_active_players: number
  allow_connection: boolean
}

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

  // WebSocket
  const { token, isInitialized } = useAuth()
  const wsRef = useRef<WebSocket | null>(null)
  const [wsStatus, setWsStatus] = useState("Disconnected")

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
    setIsInMatch(false)
    setGameResult(null)
    setIsGameResultMinimized(false)
    setMyTurn(false)
    setMessages([])
    setPlayerInput("")
    setIsInQueue(false)
    setQueueStartTime(null)
    stopTurnTimer()
    stopOpponentTimer()
    setPlayerId(null)
    playerIdRef.current = null
    setShowGameSelection(true)
    setConnectionLost(false) // Reset connection lost state

    // Reconnect WebSocket if needed
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      const newWs = new WebSocket(`wss://25a9f94cfc79.ngrok.app/ws?user_id=${token}`)
      wsRef.current = newWs

      newWs.onopen = () => {
        console.log("WebSocket reconnected")
        setWsStatus("Connected")
      }

      newWs.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data)
          handleServerMessage(msg)
        } catch (err) {
          console.warn("Non-JSON message:", event.data)
        }
      }
    }
  }

  // Fetch environment options
  useEffect(() => {
    supabase
      .from("environments")
      .select("id, env_name, description, active")
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching environments:", error)
        } else if (data) {
          setEnvOptions(data)
          // Filter the environments based on your default selection.
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
      const response = await fetch('https://25a9f94cfc79.ngrok.app/check_matchmaking', {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to check matchmaking status')
      }

      const data: MatchmakingStatus = await response.json()

      setServerStats({
        avgQueueTime: formatQueueTime(data.avg_queue_time),
        activePlayers: data.num_active_players,
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

  // WebSocket connection
  useEffect(() => {
    if (!isInitialized || !token) return

    const ws = new WebSocket(`wss://25a9f94cfc79.ngrok.app/ws?user_id=${token}`)
    wsRef.current = ws

    ws.onopen = () => {
      console.log("WebSocket connected")
      setWsStatus("Connected")
    }

    ws.onmessage = (event) => {
      console.log("Received from backend:", event.data)
      try {
        const msg = JSON.parse(event.data)
        handleServerMessage(msg)
      } catch (err) {
        console.warn("Non-JSON message:", event.data)
      }
    }

    ws.onerror = (error) => {
      console.error("WebSocket error:", error)
      setWsStatus("Error")
    }

    ws.onclose = () => {
      console.log("WebSocket closed")
      setWsStatus("Disconnected")
      stopTurnTimer()
      stopOpponentTimer()
      setConnectionLost(true)
    }

    return () => {
      ws.close()
    }
  }, [isInitialized, token])

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

  // Server message handler
  function handleServerMessage(msg: any) {
    switch (msg.command) {
      case "init":
        setServerStats({
          avgQueueTime: formatQueueTime(msg.avg_queue_time),
          activePlayers: msg.num_active_players,
          allowConnection: msg.allow_connection
        })
        break

      case "queued":
        setIsInQueue(true)
        setQueueStartTime(Date.now())
        if (msg.avg_queue_time !== undefined && msg.num_active_players !== undefined) {
          setServerStats(prev => ({
            ...prev,
            avgQueueTime: formatQueueTime(msg.avg_queue_time),
            activePlayers: msg.num_active_players
          }))
        }
        break

      case "left":
        setIsInQueue(false)
        setQueueStartTime(null)
        break

      case "match_found":
        setIsInQueue(false)
        setIsInMatch(true)
        setQueueStartTime(null)
        setPlayerId(msg.player_id)
        playerIdRef.current = msg.player_id
        setOpponentTimeLeft(180)
        playMatchFoundSound()

        if (msg.observation) {
          if (Array.isArray(msg.observation) && msg.observation.length > 0) {
            const firstObs = msg.observation[0]
            if (Array.isArray(firstObs)) {
              firstObs[0] = "game"
            }
          }
          startMyTurn(msg.observation, msg.player_id)
        }
        break

      case "observation":
        if (playerIdRef.current !== null) {
          startMyTurn(msg.observation, playerIdRef.current)
        }
        break

      case "game_over":
        setMyTurn(false)
        stopTurnTimer()
        stopOpponentTimer()
        setMessages(prev => [...prev, { sender: "center", text: "Game Over." }])
        setGameResult({
          game_id: msg.game_id,
          opponent_name: msg.opponent_name,
          opponent_elo: msg.opponent_elo,
          change_in_elo: msg.change_in_elo,
          outcome: msg.outcome,
          reason: msg.reason || "Unknown"
        })

        // If game ended due to disconnection, ensure proper cleanup
        if (msg.reason === "disconnect" || msg.reason?.includes("disconnect")) {
          setIsInMatch(false)
          setQueueStartTime(null)
          setShowGameSelection(false)
        }
        break

      case "error":
        console.error("Backend error:", msg.message)
        break

      default:
        console.warn("Unhandled command:", msg)
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
          wsRef.current?.send(JSON.stringify({ command: "action", action: "TIMEOUT" }))
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
      if (prev.length > 0 && newMsgs.length > 0 && prev[prev.length - 1].text === newMsgs[0].text) {
        return [...prev, ...newMsgs.slice(1)]
      }
      return [...prev, ...newMsgs]
    })
  }

  function sendAction() {
    if (!myTurn || !playerInput.trim()) return
    if (!isInMatch || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return

    const userMessage = playerInput.trim()
    setMessages(prev => [...prev, { sender: "right", text: userMessage }])
    wsRef.current.send(JSON.stringify({ command: "action", action: userMessage }))
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
    setMessages([]) // (Optional) Clear any leftover messages if desired.
    setQueueStartTime(null)

    const ws = wsRef.current

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      const newWs = new WebSocket(`wss://25a9f94cfc79.ngrok.app/ws?user_id=${token}`)
      wsRef.current = newWs
    
      newWs.onopen = () => {
        console.log("WebSocket reconnected")
        setWsStatus("Connected")
        // Send the queue command after reconnection.
        if (selectedGames.length > 0) {
          newWs.send(JSON.stringify({ command: "queue", environments: selectedGames }))
          setShowGameSelection(false)
        }
      }
    
      newWs.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data)
          handleServerMessage(msg)
        } catch (err) {
          console.warn("Non-JSON message:", event.data)
        }
      }
    
      newWs.onerror = (error) => {
        console.error("WebSocket error:", error)
        setWsStatus("Error")
      }
    
      newWs.onclose = () => {
        console.log("WebSocket closed")
        setWsStatus("Disconnected")
        stopTurnTimer()
        stopOpponentTimer()
        setConnectionLost(true)
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
    const ws = wsRef.current
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
    wsRef.current = null
  }

  return (
    // Added font-mono here so that all text on the page uses the monospaced font.
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

          return (
            <div key={i} className={containerClass}>
              <div className={maxWidthClass}>
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

      {/* Overlay: Waiting for opponent’s first action */}
      {isInMatch && !myTurn && messages.length === 0 && (
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
      {!isInMatch && !isGameResultMinimized && serverStats.allowConnection && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-20">
          <AnimatedQueueDisplay
            isInQueue={isInQueue}
            environments={selectedGames.map(envId => {
              const env = envOptions.find(e => parseInt(e.id) === envId)
              return env ? env.env_name : `Env #${envId}`
            })}
            elapsedTime={elapsedTime}
            avgQueueTime={serverStats.avgQueueTime}
            activePlayers={serverStats.activePlayers}
            showGameSelection={showGameSelection}
            onShowGameSelection={setShowGameSelection}
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
          />
        </div>
      )}

      {/* Top Right Panel */}
      <div className="absolute top-4 right-4 z-50">
        <div className="flex items-center gap-4 bg-black/30 backdrop-blur-md p-2 rounded-lg">
          {/* Stats Toggle Button */}
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

          {/* Mute/Unmute Button */}
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

          {/* WebSocket Status */}
          <span className="text-sm text-muted-foreground">
            WebSocket: {wsStatus}
          </span>
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
          wsRef={wsRef}
        />
      )}

      {/* Connection Lost Modal */}
      {connectionLost && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-40">
          <div className="bg-navbar p-6 rounded-md shadow-lg w-full max-w-sm text-navbarForeground text-center font-mono">
            <h2 className="text-lg font-semibold mb-2">Connection Lost</h2>
            <p className="mb-4">
              The connection to the server was lost. Please try to queue again.
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
