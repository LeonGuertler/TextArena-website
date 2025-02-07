"use client"

import { useEffect, useRef, useState } from "react"
import { supabase } from "@/lib/supabase"
import { EnvironmentSelector } from "@/components/environment-selector"
import AnimatedQueueDisplay from "@/components/animated-queue-display"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { GameOverModal } from '@/components/game-over-modal'
import { Toaster } from 'sonner'
import { HumanStats } from '@/components/HumanStats'
import { useAuth } from "@/context/AuthContext"
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

  // opponent time
  const [opponentTimeLeft, setOpponentTimeLeft] = useState(0)
  const opponentIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Game Over popup
  const [gameResult, setGameResult] = useState<GameResult | null>(null)
  const [isGameResultMinimized, setIsGameResultMinimized] = useState(false)

  // Connection lost popup state
  const [connectionLost, setConnectionLost] = useState(false)

  const [isMuted, setIsMuted] = useState(false)
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
    stopOpponentTimer() // Add this line
    setPlayerId(null)
    playerIdRef.current = null
    setShowGameSelection(true)
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
          const activeEnvIds = data.filter(e => e.active).map(e => parseInt(e.id))
          setSelectedGames(activeEnvIds)
        }
      })
  }, [])

  // Check matchmaking status periodically
  const checkMatchmakingStatus = async () => {
    try {
      //const response = await fetch('https://localhost:8000/check_matchmaking', {
      const response = await fetch('https://0ffd0c14d46d.ngrok.app/check_matchmaking', {
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

    //const ws = new WebSocket(`wss://localhost:8000/ws?token=${token}`)
    // const ws = new WebSocket(`wss://0ffd0c14d46d.ngrok.app/ws?token=${token}`)
    const ws = new WebSocket(`wss://0ffd0c14d46d.ngrok.app/ws?user_id=${token}`)
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
      stopOpponentTimer() // Add this line
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
        setOpponentTimeLeft(180)  // Initialize opponent timer
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
        setMessages(prev => [...prev, { sender: "center", text: "Game Over." }])
        setGameResult({
          game_id: msg.game_id,
          opponent_name: msg.opponent_name,
          opponent_elo: msg.opponent_elo,
          change_in_elo: msg.change_in_elo,
          outcome: msg.outcome,
          reason: msg.reason || "Unknown"
        })
        break

      case "error":
        console.error("Backend error:", msg.message)
        break

      default:
        console.warn("Unhandled command:", msg)
        break
    }
  }

  // function startMyTurn(observation: any[], myPlayer: number) {
  //   appendObservation(observation, myPlayer)
  //   setMyTurn(true)
  //   setTimeLeft(180)
  //   new Audio(SOUND_MYTURN).play()
  //   inputRef.current?.focus()

  //   if (intervalRef.current) clearInterval(intervalRef.current)
  //   intervalRef.current = setInterval(() => {
  //     setTimeLeft(t => {
  //       if (t <= 1) {
  //         stopTurnTimer()
  //         setMyTurn(false)
  //         wsRef.current?.send(JSON.stringify({ command: "action", action: "TIMEOUT" }))
  //         return 0
  //       }
  //       return t - 1
  //     })
  //   }, 1000)
  // }
  // Sound effect: match found with rare chance
  function playMatchFoundSound() {
    if (isMuted) return;
    const rnd = Math.random()
    if (rnd < 0.1) {
      // 10% chance for rare sound
      new Audio(SOUND_MATCHFOUND_RARE).play()
    } else {
      // 90% chance for common sound
      new Audio(SOUND_MATCHFOUND_COMMON).play()
    }
  }

  // Sound effect: my turn
  function playMyTurnSound() {
    if (isMuted) return;
    new Audio(SOUND_MYTURN).play()
  }


  function startMyTurn(observation: any[], myPlayer: number) {
    appendObservation(observation, myPlayer)
    setMyTurn(true)
    setTimeLeft(180)
  
    // Stop opponent timer if it's running
    stopOpponentTimer()  
    playMyTurnSound()
  
    // Auto-focus the input bar
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
    const ws = wsRef.current
    if (!ws || ws.readyState !== WebSocket.OPEN) return

    if (selectedGames.length === 0) {
      alert("Please select at least one environment.")
      return
    }
    setShowGameSelection(false)
    ws.send(JSON.stringify({ command: "queue", environments: selectedGames }))
  }

  function handleLeaveQueue() {
    const ws = wsRef.current
    if (!ws || ws.readyState !== WebSocket.OPEN) return
    ws.send(JSON.stringify({ command: "leave" }))
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
    <div className="flex flex-col h-screen relative">
      {/* <HumanStats /> */}

      <div ref={chatContainerRef} className="flex-1 overflow-auto p-4 font-mono">
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

      {/* Connection limit overlay */}
      {!serverStats.allowConnection && (
        <div className="absolute inset-0 bg-background/95 flex items-center justify-center z-50">
          <div className="max-w-md p-6 text-center space-y-4">
            <h2 className="text-xl font-semibold text-red-500">Server At Capacity</h2>
            <p className="text-muted-foreground">
              We're currently experiencing high traffic and cannot accept new connections.
              Please try again later.
            </p>
            <p className="text-sm text-muted-foreground">
              Current active players: {serverStats.activePlayers}
            </p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Match input bar */}
      {/* {isInMatch && (
        <div className="p-4 border-t border-gray-300 flex items-center gap-2">
          <input
            ref={inputRef}
            className="border p-2 flex-1 text-sm font-mono"
            type="text"
            placeholder={myTurn ? "Type your move..." : "Waiting for opponent..."}
            value={playerInput}
            onChange={(e) => setPlayerInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                sendAction()
              }
            }}
            disabled={!myTurn}
          />
          <Button onClick={sendAction} disabled={!myTurn || !playerInput.trim()}>
            Send
          </Button>
          {myTurn && (
            <span className="ml-2 text-sm text-muted-foreground">Time Left: {timeLeft}s</span>
          )}
        </div>
      )} */}
      {isInMatch && (
        <div className="p-4 border-t border-gray-300 flex items-center gap-2">
          {myTurn ? (
            <>
              <input
                ref={inputRef}
                className="border p-2 flex-1 text-sm font-mono"
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
              <Button onClick={sendAction} disabled={!myTurn || !playerInput.trim()}>
                Send
              </Button>
              <span className="ml-2 text-sm text-muted-foreground">Time Left: {timeLeft}s</span>
            </>
          ) : (
            <>
              <span className="text-sm font-mono">
                Waiting for Opponent... (Time left: {opponentTimeLeft}s)
              </span>
            </>
          )}
        </div>
      )}

      {/* Queue overlay */}
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

      {/* WebSocket status */}
      {/* <div className="absolute top-4 right-4 text-sm text-muted-foreground z-30">
        WebSocket: {wsStatus}
      </div> */}
      {/* WebSocket status and mute button */}
      {/* <div className="absolute top-4 right-4 flex items-center gap-4 z-30">
        <button 
          onClick={() => setIsMuted(prev => !prev)} 
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4zM22 9l-6 6M16 9l6 6"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
          )}
        </button>
        <span className="text-sm text-muted-foreground">
          WebSocket: {wsStatus}
        </span>
      </div> */}
      {/* Top-right controls group */}
      {/* <div className="absolute top-4 right-4 flex items-center gap-4 z-30">
        <button 
          onClick={() => setStatsVisible(prev => !prev)} 
          className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <BarChart2 className="h-5 w-5" />
          {statsVisible ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

        <button 
          onClick={() => setIsMuted(prev => !prev)} 
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {isMuted ? (
            <Volume2Off className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </button>

        <span className="text-sm text-muted-foreground">
          WebSocket: {wsStatus}
        </span>
      </div>
      {/* Human stats component */}
      {/* Top-right controls group */}
    <div className="absolute top-4 right-4 flex items-center gap-4 z-50">
        {/* Stats toggle button */}
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

        {/* Mute/unmute button */}
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

        {/* Optionally show WS status, etc. */}
        <span className="text-sm text-muted-foreground">
          WebSocket: {wsStatus}
        </span>
      </div>

      {/* HumanStats panel (no superimposed button inside) */}
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
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-40">
          <div className="bg-black p-6 rounded-md shadow-lg w-full max-w-sm text-white text-center">
            <h2 className="text-lg font-semibold mb-2">Connection Lost</h2>
            <p className="mb-4">The connection to the server was lost. Please try to queue again.</p>
            <Button onClick={handleConnectionLostClose} className="mx-auto">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}