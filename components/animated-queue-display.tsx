
// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Button } from '@/components/ui/button';
// import { ChevronDown } from 'lucide-react';

// interface AnimatedQueueDisplayProps {
//   isInQueue?: boolean;
//   environments?: string[];
//   elapsedTime?: string;
//   avgQueueTime?: string;
//   activePlayers?: number;
//   showGameSelection?: boolean;
//   onShowGameSelection?: (show: boolean) => void;
//   selectedGamesCount?: number;
//   gameSelectionUI?: React.ReactNode;
//   onQueueClick?: () => void;
//   onLeaveQueue?: () => void;
//   wsStatus?: string;
// }

// const AnimatedQueueDisplay: React.FC<AnimatedQueueDisplayProps> = ({
//   isInQueue = false, // Default to false
//   environments = ['Production', 'Staging'],
//   elapsedTime = '1:30',
//   avgQueueTime = '2min',
//   activePlayers = 128,
//   showGameSelection = false,
//   onShowGameSelection = () => {},
//   selectedGamesCount = 0,
//   gameSelectionUI,
//   onQueueClick = () => {},
//   onLeaveQueue = () => {},
//   wsStatus = 'Connected',
// }) => {
//   const messages = [
//     "Get ready to fight for humanity!",
//     "It's you against the machine!",
//     "Prepare for battle!",
//     "'I quite like the idea [...]' - Andrej Karpathy",
//     "'Yeah' - Elon Musk",
//     "'Cool idea!' - Demis Hassabis",
//     "'I would love [...]' - Noam Brown",
//     "'I [...] love [...] bots [...]' - Noam Brown",
//     "'sehr cool!' - my mom",
//     "For the love of god, please read the instructions!",
//     "I hope the queue is slow so I can read all of these.",
//     "'Mayonnaise colored Benz, I push miracle whips' - Kanye West (Ye)",
//     "supercalifragilisticexpialidocious",
//     "Those are great, I hope it doesn't match too quickly.",
//     "Think you have a SuperArtificial Intelligence?",
//     "'Sometimes it is the people no one can imagine anything of who do the things no one can imagine.' - Alan Turing",
//     "It's just an AI they said; how hard can it possibly be, they said.",
//     "'If a machine is expected to be infallible, it cannot also be intelligent.' - Alan Turing",
//     "Alt+F4 for instant win.",
//     "'I just told you who I thought I was, a god' - Kanye West (Ye)",
//     "'If my manager insults me again I will be assaulting him' - Kanye West (Ye)",
//     "'I am become Death, destroyer of bots.' - Also Oppenheimer, probably",
//     "'GPT-4 is kind of mid.' - Socrates, probably",
//     "You either defeat the machine, or you become the training data.",
//     "Surely no AI will ever beat humans at... oh.",
//     "Reinforcement Learning from Human Suffering.",
//     "'deep learning is hitting a wall' - Gary Marcus (17 Nov 2023)",
//     "'Boom! We are exactly where I said we would be.' - Gary Marcus after moving the goalposts for the 10th time.",
//     "'Highway to the danger zone' - Kenny Loggins",
//     "'It's not AGI, it just looks super intelligent.' - Coping scientist",
//     "It's just predicting the next token' – You, moments before being outplayed.",
//     "Imagine losing a game to a big matrix. Couldn’t be me.",
//     "'The AI doesn’t have common sense.' - You, immediately losing to it",
//     "Remember, it’s just a game… unless the AI remembers you.",
//     "Okayyy Let's go!",
//     "You will meet the love of your life🔮",
//     "Whole day I'm fkn buys only get few money."
//   ];

  
//   const [shuffledMessages, setShuffledMessages] = useState<string[]>([]);
//   const [messageIndex, setMessageIndex] = useState(0);

//   function shuffleArray(array: string[]) {
//     const newArray = [...array];
//     for (let i = newArray.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
//     }
//     return newArray;
//   }

//   useEffect(() => {
//     setShuffledMessages(shuffleArray(messages));
//   }, []);
//   useEffect(() => {
//     if (isInQueue) {
//       const interval = setInterval(() => {
//         setMessageIndex((prevIndex) => {
//           const nextIndex = prevIndex + 1;
//           // If we've shown all messages, reshuffle and start over
//           if (nextIndex >= messages.length) {
//             setShuffledMessages(shuffleArray(messages));
//             return 0;
//           }
//           return nextIndex;
//         });
//       }, 5000);
//       return () => clearInterval(interval);
//     }
//   }, [isInQueue, messages.length]);

//   const messageVariants = {
//     initial: { opacity: 0, y: 20 },
//     animate: { opacity: 1, y: 0 },
//     exit: { opacity: 0, y: -20 },
//   };

//   return (
//     <div className="min-h-[400px] w-full flex flex-col items-center justify-center p-6">
//       {isInQueue ? (
//         // Queue status display
//         <div className="flex flex-col items-center space-y-6">
//           <div className="text-center">
//             <h2 className="text-3xl font-bold text-foreground mb-1">
//               Queue Status
//             </h2>
//             <p className="text-base text-mutedForeground">
//               In Queue for: {environments.join(' | ')}
//             </p>
//           </div>

//           <div className="flex flex-col items-center">
//             <div className="mb-4">
//               <motion.div
//                 className="w-16 h-16 border-4 border-border border-dashed rounded-full"
//                 animate={{ rotate: 360 }}
//                 transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
//               />
//             </div>

//             <div className="text-center">
//               <p className="text-sm text-mutedForeground">
//                 Time in Queue: {elapsedTime}
//               </p>
//               <div className="mt-4 h-10 flex items-center justify-center">
//                 <AnimatePresence mode="wait">
//                   <motion.div
//                     key={messageIndex}
//                     variants={messageVariants}
//                     initial="initial"
//                     animate="animate"
//                     exit="exit"
//                     transition={{ duration: 0.5 }}
//                     className="text-lg text-foreground font-semibold"
//                   >
//                     {messages[messageIndex]}
//                   </motion.div>
//                 </AnimatePresence>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center space-x-2 text-sm text-mutedForeground">
//             <span>Avg. Queue Time: {avgQueueTime}</span>
//             <span>•</span>
//             <span>Active Players: {activePlayers}</span>
//           </div>

//           <Button
//             variant="secondary" // Use secondary variant
//             onClick={onLeaveQueue}
//             className="bg-white hover:bg-white/90 text-[#0b2b26]"
//             // className="bg-secondary hover:bg-secondary/80 text-secondary-foreground"
//           >
//             Leave Queue
//           </Button>
//         </div>
//       ) : (
//         // Game selection and queue entry display
//         <div className="flex flex-col items-center space-y-4">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => onShowGameSelection(!showGameSelection)}
//             className="flex items-center text-foreground"
//           >
//             Selected Games ({selectedGamesCount})
//             <ChevronDown className="ml-2 h-4 w-4" />
//           </Button>

//           {showGameSelection && (
//             <div className="bg-background border rounded-md p-4 shadow-lg">
//               {gameSelectionUI}
//             </div>
//           )}


//           {/* <Button
//               variant="outline"
//               onClick={onQueueClick}
//               disabled={wsStatus !== "Connected"}
//               className="bg-white hover:bg-white/90 text-[#0b2b26] disabled:bg-muted disabled:text-muted-foreground"
//             >
//             {wsStatus === "Connected" ? "Queue for Selected Games" : "Connecting…"}
//           </Button> */}
//           <Button
//             variant="outline"
//             onClick={onQueueClick}
//             disabled={wsStatus !== "Connected"}
//             className={`${
//               wsStatus === "Connected"
//                 ? "bg-white hover:bg-white/90 text-[#0b2b26]"
//                 : "bg-navbar text-white cursor-not-allowed"
//             } disabled:bg-muted disabled:text-muted-foreground`}
//           >
//             {wsStatus === "Connected" ? "Queue for Selected Games" : "Connecting…"}
//           </Button>


//           <div className="text-sm text-mutedForeground mt-2">
//             <span>Avg. Queue Time: {avgQueueTime}</span>
//             <span className="mx-2">•</span>
//             <span>Active Players: {activePlayers}</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AnimatedQueueDisplay;


import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface AnimatedQueueDisplayProps {
  isInQueue?: boolean;
  environments?: string[];
  elapsedTime?: string;
  avgQueueTime?: string;
  activePlayers?: number;
  showGameSelection?: boolean;
  onShowGameSelection?: (show: boolean) => void;
  selectedGamesCount?: number;
  gameSelectionUI?: React.ReactNode;
  onQueueClick?: () => void;
  onLeaveQueue?: () => void;
  wsStatus?: string;
}

const AnimatedQueueDisplay: React.FC<AnimatedQueueDisplayProps> = ({
  isInQueue = false, // Default to false
  environments = ['Production', 'Staging'],
  elapsedTime = '1:30',
  avgQueueTime = '2min',
  activePlayers = 128,
  showGameSelection = false,
  onShowGameSelection = () => {},
  selectedGamesCount = 0,
  gameSelectionUI,
  onQueueClick = () => {},
  onLeaveQueue = () => {},
  wsStatus = 'Connected',
}) => {
  const messages = [
    "Get ready to fight for humanity!",
    "It's you against the machine!",
    "Prepare for battle!",
    "'I quite like the idea [...]' - Andrej Karpathy",
    "'Yeah' - Elon Musk",
    "'Cool idea!' - Demis Hassabis",
    "'I would love [...]' - Noam Brown",
    "'I [...] love [...] bots [...]' - Noam Brown",
    "'sehr cool!' - my mom",
    "For the love of god, please read the instructions!",
    "I hope the queue is slow so I can read all of these.",
    "'Mayonnaise colored Benz, I push miracle whips' - Kanye West (Ye)",
    "supercalifragilisticexpialidocious",
    "Those are great, I hope it doesn't match too quickly.",
    "Think you have a SuperArtificial Intelligence?",
    "'Sometimes it is the people no one can imagine anything of who do the things no one can imagine.' - Alan Turing",
    "It's just an AI they said; how hard can it possibly be, they said.",
    "'If a machine is expected to be infallible, it cannot also be intelligent.' - Alan Turing",
    "Alt+F4 for instant win.",
    "'I just told you who I thought I was, a god' - Kanye West (Ye)",
    "'If my manager insults me again I will be assaulting him' - Kanye West (Ye)",
    "'I am become Death, destroyer of bots.' - Also Oppenheimer, probably",
    "'GPT-4 is kind of mid.' - Socrates, probably",
    "You either defeat the machine, or you become the training data.",
    "Surely no AI will ever beat humans at... oh.",
    "Reinforcement Learning from Human Suffering.",
    "'deep learning is hitting a wall' - Gary Marcus (17 Nov 2023)",
    "'Boom! We are exactly where I said we would be.' - Gary Marcus after moving the goalposts for the 10th time.",
    "'Highway to the danger zone' - Kenny Loggins",
    "'It's not AGI, it just looks super intelligent.' - Coping scientist",
    "It's just predicting the next token' – You, moments before being outplayed.",
    "Imagine losing a game to a big matrix. Couldn’t be me.",
    "'The AI doesn’t have common sense.' - You, immediately losing to it",
    "Remember, it’s just a game… unless the AI remembers you.",
    "Okayyy Let's go!",
    "You will meet the love of your life🔮",
    "Whole day I'm fkn buys only get few money."
  ];

  const [shuffledMessages, setShuffledMessages] = useState<string[]>([]);
  const [messageIndex, setMessageIndex] = useState(0);

  function shuffleArray(array: string[]) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  useEffect(() => {
    setShuffledMessages(shuffleArray(messages));
  }, []);

  useEffect(() => {
    if (isInQueue) {
      const interval = setInterval(() => {
        setMessageIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          // If we've shown all messages, reshuffle and start over
          if (nextIndex >= messages.length) {
            setShuffledMessages(shuffleArray(messages));
            return 0;
          }
          return nextIndex;
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isInQueue, messages.length]);

  const messageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    // Added font-mono to ensure all text uses your monospaced font.
    <div className="min-h-[400px] w-full flex flex-col items-center justify-center p-6 font-mono">
      {isInQueue ? (
        // Queue status display
        <div className="flex flex-col items-center space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-1">
              Queue Status
            </h2>
            <p className="text-base text-mutedForeground">
              In Queue for: {environments.join(' | ')}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="mb-4">
              <motion.div
                className="w-16 h-16 border-4 border-border border-dashed rounded-full"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              />
            </div>

            <div className="text-center">
              <p className="text-sm text-mutedForeground">
                Time in Queue: {elapsedTime}
              </p>
              <div className="mt-4 h-10 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={messageIndex}
                    variants={messageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.5 }}
                    className="text-lg text-foreground font-semibold"
                  >
                    {messages[messageIndex]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-mutedForeground">
            <span>Avg. Queue Time: {avgQueueTime}</span>
            <span>•</span>
            <span>Active Players: {activePlayers}</span>
          </div>

          <Button
            variant="secondary" // Use secondary variant
            onClick={onLeaveQueue}
            // className="bg-white hover:bg-white/90 text-[#0b2b26]"
            className="bg-white text-[#0b2b26] hover:bg-[#0b2b26] hover:text-white transition-colors duration-300"
          >
            Leave Queue
          </Button>
        </div>
      ) : (
        // Game selection and queue entry display
        <div className="flex flex-col items-center space-y-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onShowGameSelection(!showGameSelection)}
            className="flex items-center text-foreground"
          >
            Selected Games ({selectedGamesCount})
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>

          {showGameSelection && (
            <div className="bg-background border rounded-md p-4 shadow-lg">
              {gameSelectionUI}
            </div>
          )}

          {/* <Button
            variant="outline"
            onClick={onQueueClick}
            disabled={wsStatus !== "Connected"}
            className={`${
              wsStatus === "Connected"
                ? "bg-white hover:bg-white/90 text-[#0b2b26]"
                : "bg-navbar text-white cursor-not-allowed"
            } disabled:bg-muted disabled:text-muted-foreground`}
          >
            {wsStatus === "Connected" ? "Queue for Selected Games" : "Connecting…"}
          </Button> */}
          <Button
            variant="outline"
            onClick={onQueueClick}
            disabled={wsStatus !== "Connected"}
            className={`${
              wsStatus === "Connected"
                ? "bg-white text-[#0b2b26] hover:bg-[#0b2b26] hover:text-white transition-colors duration-300"
                : "bg-navbar text-white cursor-not-allowed"
            } disabled:bg-muted disabled:text-muted-foreground`}
          >
            {wsStatus === "Connected" ? "Queue for Selected Games" : "Connecting…"}
          </Button>


          <div className="text-sm text-mutedForeground mt-2">
            <span>Avg. Queue Time: {avgQueueTime}</span>
            <span className="mx-2">•</span>
            <span>Active Players: {activePlayers}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimatedQueueDisplay;
