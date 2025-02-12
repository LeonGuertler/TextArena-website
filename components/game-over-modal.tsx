// 'use client';

// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Trophy, Minus, X, WifiOff, Share2, Copy, Bug, Maximize2, Minimize2, Check } from 'lucide-react';
// import html2canvas from 'html2canvas';
// import { toast } from 'sonner';

// interface GameOverModalProps {
//     gameResult: {
//       game_id: string | number;
//       outcome: string | null;
//       opponent_name: string;
//       opponent_elo: number;
//       change_in_elo: number;
//       reason: string;
//     };
//     onClose: () => void;
//     onReturnToQueue: () => void;
//     onMinimize: (minimized: boolean) => void;
//     chatRef: React.RefObject<HTMLDivElement>;
//     wsRef: React.RefObject<WebSocket>;
// }

// interface GameMessage {
//     sender: "left" | "right" | "center"
//     text: string
// }

// interface SharedGameData {
//     messages: GameMessage[];
//     metadata: {
//       game_id: string | number;
//       outcome: string | null;
//       opponent_name: string;
//       opponent_elo: number;
//       change_in_elo: number;
//       reason: string;
//       timestamp: string;
//     }
// }

// export function GameOverModal({ 
//   gameResult, 
//   onClose, 
//   onReturnToQueue,
//   onMinimize, 
//   chatRef, 
//   wsRef 
// }: GameOverModalProps) {
//   const [isMinimized, setIsMinimized] = useState(false);
//   const [bugReported, setBugReported] = useState(false);

//   const handleMinimize = () => {
//     setIsMinimized(true);
//     onMinimize(true);
//   };

//   const handleMaximize = () => {
//     setIsMinimized(false);
//     onMinimize(false);
//   };

//   const handleCopyGame = async () => {
//     try {
//       const response = await fetch('https://21d082661210.ngrok.app/save_game', {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           messages: Array.from(chatRef.current?.querySelectorAll('[class*="flex justify-"]') || [])
//             .map(messageEl => {
//               const element = messageEl as HTMLElement;
//               let sender: "left" | "right" | "center";
              
//               if (element.className.includes("justify-start")) {
//                 sender = "left";
//               } else if (element.className.includes("justify-end")) {
//                 sender = "right";
//               } else {
//                 sender = "center";
//               }

//               const textSpan = element.querySelector('span');
//               const text = textSpan?.textContent || "";

//               return { sender, text };
//             }),
//           metadata: {
//             game_id: String(gameResult.game_id),
//             outcome: gameResult.outcome,
//             opponent_name: gameResult.opponent_name,
//             opponent_elo: gameResult.opponent_elo,
//             change_in_elo: gameResult.change_in_elo,
//             reason: gameResult.reason,
//             timestamp: new Date().toISOString()
//           }
//         })
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to save game: ${await response.text()}`);
//       }

//       const data = await response.json();
//       const gameUrl = new URL(data.url, window.location.origin).toString();
      
//       await navigator.clipboard.writeText(gameUrl);
//       toast.success('Game URL copied to clipboard!');
//     } catch (error) {
//       console.error('Error copying game URL:', error);
//       toast.error('Failed to copy game URL');
//     }
//   };

//   const captureChat = async () => {
//     if (!chatRef.current) return null;
    
//     try {
//       const canvas = await html2canvas(chatRef.current, {
//         backgroundColor: '#000000',
//         scale: 2,
//       });
//       return canvas;
//     } catch (error) {
//       console.error('Error capturing chat:', error);
//       return null;
//     }
//   };

//   function truncateName(name: string) {
//     const maxLength = 25;
//     if (name.length <= maxLength) {
//       return name;
//     }
//     return name.slice(0, maxLength) + "...";
//   }

//   const handleShare = async () => {
//     try {
//       const messages = Array.from(chatRef.current?.querySelectorAll('[class*="flex justify-"]') || [])
//         .map(messageEl => {
//           const element = messageEl as HTMLElement;
//           let sender: "left" | "right" | "center";
          
//           if (element.className.includes("justify-start")) {
//             sender = "left";
//           } else if (element.className.includes("justify-end")) {
//             sender = "right";
//           } else {
//             sender = "center";
//           }

//           const textSpan = element.querySelector('span');
//           const text = textSpan?.textContent || "";

//           return { sender, text };
//         });

//       const gameData = {
//         messages,
//         metadata: {
//           game_id: String(gameResult.game_id),
//           outcome: gameResult.outcome,
//           opponent_name: gameResult.opponent_name,
//           opponent_elo: gameResult.opponent_elo,
//           change_in_elo: gameResult.change_in_elo,
//           reason: gameResult.reason,
//           timestamp: new Date().toISOString()
//         }
//       };

//       const response = await fetch('https://21d082661210.ngrok.app/save_game', {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(gameData)
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to save game: ${errorText}`);
//       }

//       const data = await response.json();

//       const outcomeText = gameResult.outcome?.toLowerCase() === 'win' ? 'won against' :
//                          gameResult.outcome?.toLowerCase() === 'loss' ? 'lost to' :
//                          gameResult.outcome?.toLowerCase() === 'draw' ? 'drew with' : 
//                          'played against';
      
//       const tweetText = `I just ${outcomeText} ${gameResult.opponent_name} in TextArena! Rating change: ${gameResult.change_in_elo >= 0 ? '+' : ''}${gameResult.change_in_elo}`;
      
//       const gameUrl = new URL(data.url, window.location.origin).toString();
//       const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(gameUrl)}`;
      
//       window.open(shareUrl, '_blank');
//       toast.success('Game shared successfully!');
//     } catch (error) {
//       console.error('Error in handleShare:', error);
//       toast.error(error instanceof Error ? error.message : 'Failed to share game');
//     }
//   };

//   const handleReportBug = () => {
//     if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
//       toast.error('Cannot report bug: WebSocket connection is not available');
//       return;
//     }

//     wsRef.current.send(JSON.stringify({
//       command: 'report_bug',
//       game_id: gameResult.game_id
//     }));

//     setBugReported(true);
//     toast.success('Bug report submitted successfully!');
//   };

//   const getOutcomeDisplay = () => {
//     if (!gameResult.outcome) {
//       return {
//         icon: <WifiOff className="h-12 w-12 text-white" />,
//         title: 'Connection Lost',
//         bgColor: 'bg-black',
//         textColor: 'text-white'
//       };
//     }
  
//     switch (gameResult.outcome.toLowerCase()) {
//       case 'win':
//         return {
//           icon: <Trophy className="h-12 w-12 text-yellow-500" />,
//           title: 'Victory!',
//           bgColor: 'bg-green-500/10',
//           textColor: 'text-green-500'
//         };
//       case 'draw':
//         return {
//           icon: <Minus className="h-12 w-12 text-blue-500" />,
//           title: 'Draw',
//           bgColor: 'bg-blue-500/10',
//           textColor: 'text-blue-500'
//         };
//       case 'loss':
//         return {
//           icon: <X className="h-12 w-12 text-red-500" />,
//           title: 'Defeat',
//           bgColor: 'bg-red-500/10',
//           textColor: 'text-red-500'
//         };
//       default:
//         return {
//           icon: <Trophy className="h-12 w-12 text-gray-500" />,
//           title: 'Game Over',
//           bgColor: 'bg-gray-500/10',
//           textColor: 'text-gray-500'
//         };
//     }
//   };

//   const outcomeDisplay = getOutcomeDisplay();

//   if (isMinimized) {
//     return (
//       <div className="fixed bottom-2 right-4 z-50">
//         <Button
//           onClick={handleMaximize}
//           // className="flex items-center gap-2 shadow-lg bg-[hsl(var(--navbar))] hover:bg-[hsl(var(--navbar))]"
//           className="flex items-center gap-2 shadow-lg bg-[hsl(var(--navbar))] hover:bg-[hsl(var(--navbar))] text-white"
//         >
//           <Maximize2 className="h-4 w-4" />
//           Show Game Results
//         </Button>
//       </div>
//     );
//   }

//   if (!gameResult.outcome) {
//     return (
//       <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80">
//         <div className="bg-black p-8 rounded-lg shadow-xl w-full max-w-md">
//           <div className="flex flex-col items-center text-center space-y-4">
//             <div className="rounded-full bg-black p-3">
//               <WifiOff className="h-8 w-8 text-white" />
//             </div>
//             <h2 className="text-xl font-semibold text-white">Connection Lost</h2>
//             <p className="text-white">
//               The connection to the server was lost.
//               Please try to queue again.
//             </p>
//             <Button onClick={onReturnToQueue} className="mt-4 bg-white hover:bg-gray-100 text-black">
//               Close
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }
  
//   return (
//     <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//       <div className="bg-[hsl(var(--navbar))] p-8 rounded-lg shadow-xl w-full max-w-md relative">
//         <button 
//           onClick={handleMinimize}
//           className="absolute top-4 right-4 text-muted-foreground hover:text-[hsl(var(--navbar-foreground))] transition-colors"
//         >
//           <Minimize2 className="h-5 w-5" />
//         </button>

//         <div className="flex flex-col items-center text-center">
//           <div className={`rounded-full ${outcomeDisplay.bgColor} p-6 mb-4`}>
//             {outcomeDisplay.icon}
//           </div>

//           <h2 className={`text-2xl font-bold mb-6 ${outcomeDisplay.textColor}`}>
//             {outcomeDisplay.title}
//           </h2>

//           <div className="w-full space-y-4 mb-6">
//             <div className="flex justify-between items-center">
//               <span className="text-white">Opponent</span>
//               <span className="font-medium text-white">{truncateName(gameResult.opponent_name)}</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-white">Opponent Rating</span>
//               <span className="font-medium text-white">{gameResult.opponent_elo}</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-white">Rating Change</span>
//               <span className={`font-medium ${gameResult.change_in_elo >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//                 {gameResult.change_in_elo >= 0 ? '+' : ''}{gameResult.change_in_elo}
//               </span>
//             </div>
//             <div className="pt-4 border-t border-[hsl(var(--background))]">
//               <span className="text-sm text-muted-foreground">
//                 {gameResult.reason}
//               </span>
//             </div>
//           </div>

//           <div className="w-full space-y-3">
//             <Button 
//               onClick={onReturnToQueue} 
//               className="w-full bg-[hsl(var(--background))] hover:bg-[hsl(var(--background))] text-white"
//             >
//               Return to Queue
//             </Button>
            
//             <div className="grid grid-cols-3 gap-3">
//               <Button 
//                 variant="outline" 
//                 onClick={handleShare}
//                 className="flex items-center justify-center bg-[hsl(var(--background))] hover:bg-[hsl(var(--background))]"
//               >
//                 <Share2 className="h-4 w-4 mr-2" />
//                 Share
//               </Button>
              
//               <Button 
//                 variant="outline" 
//                 onClick={handleCopyGame}
//                 className="flex items-center justify-center bg-[hsl(var(--background))] hover:bg-[hsl(var(--background))]"
//               >
//                 <Copy className="h-4 w-4 mr-2" />
//                 Copy
//               </Button>
                
//                 <Button 
//                   variant="outline" 
//                   onClick={handleReportBug}
//                   disabled={bugReported}
//                   className={`flex items-center justify-center bg-[hsl(var(--background))] hover:bg-[hsl(var(--background))] ${
//                     bugReported ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : ''
//                   }`}
//                 >
//                   {bugReported ? (
//                     <>
//                       <Check className="h-4 w-4 mr-2" />
//                       Reported
//                     </>
//                   ) : (
//                     <>
//                       <Bug className="h-4 w-4 mr-2" />
//                       Report
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }



'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Trophy,
  Minus,
  X,
  WifiOff,
  Share2,
  Copy,
  Bug,
  Maximize2,
  Minimize2,
  Check,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

interface GameOverModalProps {
  gameResult: {
    game_id: string | number;
    outcome: string | null;
    opponent_name: string;
    opponent_elo: number;
    change_in_elo: number;
    reason: string;
  };
  onClose: () => void;
  onReturnToQueue: () => void;
  onMinimize: (minimized: boolean) => void;
  chatRef: React.RefObject<HTMLDivElement>;
  wsRef: React.RefObject<WebSocket>;
}

interface GameMessage {
  sender: "left" | "right" | "center";
  text: string;
}

interface SharedGameData {
  messages: GameMessage[];
  metadata: {
    game_id: string | number;
    outcome: string | null;
    opponent_name: string;
    opponent_elo: number;
    change_in_elo: number;
    reason: string;
    timestamp: string;
  };
}

export function GameOverModal({
  gameResult,
  onClose,
  onReturnToQueue,
  onMinimize,
  chatRef,
  wsRef,
}: GameOverModalProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [bugReported, setBugReported] = useState(false);

  const handleMinimize = () => {
    setIsMinimized(true);
    onMinimize(true);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
    onMinimize(false);
  };

  const handleCopyGame = async () => {
    try {
      const response = await fetch('https://api.textarena.ai/save_game', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: Array.from(chatRef.current?.querySelectorAll('[class*="flex justify-"]') || [])
            .map(messageEl => {
              const element = messageEl as HTMLElement;
              let sender: "left" | "right" | "center";

              if (element.className.includes("justify-start")) {
                sender = "left";
              } else if (element.className.includes("justify-end")) {
                sender = "right";
              } else {
                sender = "center";
              }

              const textSpan = element.querySelector('span');
              const text = textSpan?.textContent || "";

              return { sender, text };
            }),
          metadata: {
            game_id: String(gameResult.game_id),
            outcome: gameResult.outcome,
            opponent_name: gameResult.opponent_name,
            opponent_elo: gameResult.opponent_elo,
            change_in_elo: gameResult.change_in_elo,
            reason: gameResult.reason,
            timestamp: new Date().toISOString(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save game: ${await response.text()}`);
      }

      const data = await response.json();
      const gameUrl = new URL(data.url, window.location.origin).toString();

      await navigator.clipboard.writeText(gameUrl);
      toast.success('Game URL copied to clipboard!');
    } catch (error) {
      console.error('Error copying game URL:', error);
      toast.error('Failed to copy game URL');
    }
  };

  const captureChat = async () => {
    if (!chatRef.current) return null;

    try {
      const canvas = await html2canvas(chatRef.current, {
        backgroundColor: '#000000',
        scale: 2,
      });
      return canvas;
    } catch (error) {
      console.error('Error capturing chat:', error);
      return null;
    }
  };

  function truncateName(name: string) {
    const maxLength = 25;
    if (name.length <= maxLength) {
      return name;
    }
    return name.slice(0, maxLength) + '...';
  }

  const handleShare = async () => {
    try {
      const messages = Array.from(chatRef.current?.querySelectorAll('[class*="flex justify-"]') || [])
        .map(messageEl => {
          const element = messageEl as HTMLElement;
          let sender: "left" | "right" | "center";

          if (element.className.includes("justify-start")) {
            sender = "left";
          } else if (element.className.includes("justify-end")) {
            sender = "right";
          } else {
            sender = "center";
          }

          const textSpan = element.querySelector('span');
          const text = textSpan?.textContent || "";

          return { sender, text };
        });

      const gameData = {
        messages,
        metadata: {
          game_id: String(gameResult.game_id),
          outcome: gameResult.outcome,
          opponent_name: gameResult.opponent_name,
          opponent_elo: gameResult.opponent_elo,
          change_in_elo: gameResult.change_in_elo,
          reason: gameResult.reason,
          timestamp: new Date().toISOString(),
        },
      };

      const response = await fetch('https://api.textarena.ai/save_game', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save game: ${errorText}`);
      }

      const data = await response.json();

      const outcomeText =
        gameResult.outcome?.toLowerCase() === 'win'
          ? 'won against'
          : gameResult.outcome?.toLowerCase() === 'loss'
          ? 'lost to'
          : gameResult.outcome?.toLowerCase() === 'draw'
          ? 'drew with'
          : 'played against';

      const tweetText = `I just ${outcomeText} ${gameResult.opponent_name} in TextArena! Rating change: ${
        gameResult.change_in_elo >= 0 ? '+' : ''
      }${gameResult.change_in_elo}`;

      const gameUrl = new URL(data.url, window.location.origin).toString();
      const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        tweetText
      )}&url=${encodeURIComponent(gameUrl)}`;

      window.open(shareUrl, '_blank');
      toast.success('Game shared successfully!');
    } catch (error) {
      console.error('Error in handleShare:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to share game');
    }
  };

  const handleReportBug = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      toast.error('Cannot report bug: WebSocket connection is not available');
      return;
    }

    wsRef.current.send(
      JSON.stringify({
        command: 'report_bug',
        game_id: gameResult.game_id,
      })
    );

    setBugReported(true);
    toast.success('Bug report submitted successfully!');
  };

  const getOutcomeDisplay = () => {
    if (!gameResult.outcome) {
      return {
        icon: <WifiOff className="h-12 w-12 text-white" />,
        title: 'Connection Lost',
        bgColor: 'bg-black',
        textColor: 'text-white',
      };
    }

    switch (gameResult.outcome.toLowerCase()) {
      case 'win':
        return {
          icon: <Trophy className="h-12 w-12 text-yellow-500" />,
          title: 'Victory!',
          bgColor: 'bg-green-500/10',
          textColor: 'text-green-500',
        };
      case 'draw':
        return {
          icon: <Minus className="h-12 w-12 text-blue-500" />,
          title: 'Draw',
          bgColor: 'bg-blue-500/10',
          textColor: 'text-blue-500',
        };
      case 'loss':
        return {
          icon: <X className="h-12 w-12 text-red-500" />,
          title: 'Defeat',
          bgColor: 'bg-red-500/10',
          textColor: 'text-red-500',
        };
      default:
        return {
          icon: <Trophy className="h-12 w-12 text-gray-500" />,
          title: 'Game Over',
          bgColor: 'bg-gray-500/10',
          textColor: 'text-gray-500',
        };
    }
  };

  const outcomeDisplay = getOutcomeDisplay();

  // Minimized state: add `font-mono` to the container.
  if (isMinimized) {
    return (
      <div className="fixed bottom-2 right-4 z-50 font-mono">
        <Button
          onClick={handleMaximize}
          className="flex items-center gap-2 shadow-lg bg-[hsl(var(--navbar))] hover:bg-[hsl(var(--navbar))] text-white"
        >
          <Maximize2 className="h-4 w-4" />
          Show Game Results
        </Button>
      </div>
    );
  }

  // Connection lost branch: add `font-mono` here as well.
  if (!gameResult.outcome) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 font-mono">
        <div className="bg-black p-8 rounded-lg shadow-xl w-full max-w-md">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="rounded-full bg-black p-3">
              <WifiOff className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Connection Lost</h2>
            <p className="text-white">
            Your opponent has disconnected from the server. This game won't be counted.
              {/* The connection to the server was lost. */}
              {/* Please try to queue again. */}
            </p>
            <Button onClick={onReturnToQueue} className="mt-4 bg-white hover:bg-gray-100 text-black">
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Normal modal branch: add `font-mono` to the outer container.
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 font-mono">
      <div className="bg-[hsl(var(--navbar))] p-8 rounded-lg shadow-xl w-full max-w-md relative">
        <button
          onClick={handleMinimize}
          className="absolute top-4 right-4 text-muted-foreground hover:text-[hsl(var(--navbar-foreground))] transition-colors"
        >
          <Minimize2 className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`rounded-full ${outcomeDisplay.bgColor} p-6 mb-4`}>
            {outcomeDisplay.icon}
          </div>

          <h2 className={`text-2xl font-bold mb-6 ${outcomeDisplay.textColor}`}>
            {outcomeDisplay.title}
          </h2>

          <div className="w-full space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-white">Opponent</span>
              <span className="font-medium text-white">{truncateName(gameResult.opponent_name)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white">Opponent Rating</span>
              <span className="font-medium text-white">{gameResult.opponent_elo}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white">Rating Change</span>
              <span className={`font-medium ${gameResult.change_in_elo >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {gameResult.change_in_elo >= 0 ? '+' : ''}{gameResult.change_in_elo}
              </span>
            </div>
            <div className="pt-4 border-t border-[hsl(var(--background))]">
              <span className="text-sm text-muted-foreground">{gameResult.reason}</span>
            </div>
          </div>

          <div className="w-full space-y-3">
            <Button
              onClick={onReturnToQueue}
              className="w-full bg-[hsl(var(--background))] hover:bg-[hsl(var(--background))] text-white"
            >
              Return to Queue
            </Button>

            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                onClick={handleShare}
                className="flex items-center justify-center bg-[hsl(var(--background))] hover:bg-[hsl(var(--background))]"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>

              <Button
                variant="outline"
                onClick={handleCopyGame}
                className="flex items-center justify-center bg-[hsl(var(--background))] hover:bg-[hsl(var(--background))]"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>

              <Button
                variant="outline"
                onClick={handleReportBug}
                disabled={bugReported}
                className={`flex items-center justify-center bg-[hsl(var(--background))] hover:bg-[hsl(var(--background))] ${
                  bugReported ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : ''
                }`}
              >
                {bugReported ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Reported
                  </>
                ) : (
                  <>
                    <Bug className="h-4 w-4 mr-2" />
                    Report
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
