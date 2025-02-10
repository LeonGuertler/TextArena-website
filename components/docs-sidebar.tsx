// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { Columns, Timer } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { useIsMobile } from "@/hooks/use-mobile"
// import { usePathname } from "next/navigation"

// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// type ItemStatus = "new" | "beta" | "upcoming" | "coming-soon"

// interface SubSubItem {
//   title: string
//   slug: string
//   status?: ItemStatus
// }

// interface SubItem {
//   title: string
//   slug: string
//   status?: ItemStatus
//   items?: (SubItem | SubSubItem)[]
// }

// interface Section {
//   title: string
//   items: SubItem[]
// }

// const sections: Section[] = [
//   {
//     title: "Getting Started",
//     items: [
//       {
//         title: "What is TextArena",
//         slug: "overview",
//       },
//       {
//         title: "Run Your First Game",
//         slug: "first-game",
//       },
//       { 
//         title: "Create a Game", 
//         slug: "create-game" 
//       },
//     ],
//   },
//   {
//     title: "Customization",
//     items: [
//       {
//         title: "Agents",
//         slug: "agents",
//         items: [
//           { title: "List of Agents", slug: "manage-agents" },
//           { title: "Register a model", slug: "register-model", status: "coming-soon"},
//         ],
//       },
//       {
//         title: "Wrappers",
//         slug: "wrappers",
//         items: [
//           { title: "List of Wrappers", slug: "list-of-wrappers" },
//           { title: "Action Wrappers", slug: "action-wrappers" },
//           { title: "Observation Wrappers", slug: "observation-wrappers" },
//           { title: "Render Wrappers", slug: "render-wrappers" },
//         ],
//       },
//     ],
//   },
//   // {
//   //   title: "Core Concepts",
//   //   items: [
//   //     { title: "State, Observation, and Actions", slug: "state-observation-actions" },
//   //     { title: "How the Environment Works", slug: "environment" },
//   //     { title: "Understanding Agents & Wrappers", slug: "agents-wrappers" },
//   //   ],
//   // },
// ]

// export function DocsSidebar() {
//   const [isOpen, setIsOpen] = useState(true)
//   const isMobile = useIsMobile()
//   const pathname = usePathname()

//   useEffect(() => {
//     setIsOpen(!isMobile)
//   }, [isMobile])

//   const renderStatus = (status?: ItemStatus) => {
//     if (!status) return null

//     // For "coming-soon" status, render a special indicator
//     if (status === "coming-soon") {
//       return (
//         <TooltipProvider>
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <span className="ml-2 text-yellow-500/70 hover:text-yellow-500/90 transition-colors">
//                 <Timer className="h-3 w-3" />
//               </span>
//             </TooltipTrigger>
//             <TooltipContent>
//               <p className="text-xs">Coming Soon</p>
//             </TooltipContent>
//           </Tooltip>
//         </TooltipProvider>
//       )
//     }

//     // For other statuses, keep the existing badge
//     return (
//       <Badge
//         variant="secondary"
//         className={cn(
//           "text-[10px] px-1.5 py-0.5 ml-2",
//           status === "new" && "bg-green-500/20 text-green-700",
//           status === "beta" && "bg-blue-500/20 text-blue-700",
//         )}
//       >
//         {status}
//       </Badge>
//     )
//   }

//   const renderItems = (items: (SubItem | SubSubItem)[], depth = 0) => (
//     <ul className={cn("space-y-1", depth > 0 && "ml-4")}>
//       {items.map((item) => {
//         const isActive = pathname === `/docs/${item.slug}`
//         return (
//           <li key={item.slug}>
//             <Link
//               href={`/docs/${item.slug}`}
//               className={cn(
//                 "flex items-center justify-between rounded-sm py-1 text-xs transition-colors duration-200",
//                 isActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground",
//                 depth === 0 && "font-medium",
//               )}
//             >
//               <span>{item.title}</span>
//               {renderStatus(item.status)}
//             </Link>
//             {"items" in item && item.items && renderItems(item.items, depth + 1)}
//           </li>
//         )
//       })}
//     </ul>
//   )

//   return (
//     <div className="relative z-30 h-screen">
//       <div
//         className={cn(
//           "fixed top-0 left-[var(--sidebar-width)] h-screen transition-all duration-500 ease-[cubic-bezier(0.215,0.61,0.355,1)]",
//           isOpen
//             ? "w-59 translate-x-0 bg-background/95 backdrop-blur-sm shadow-lg"
//             : "w-10 translate-x-0 bg-transparent",
//         )}
//       >
//         <div className="absolute right-0 top-4 h-8 w-8">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="h-8 w-8 rounded-l-md bg-background/50 hover:bg-background/60 transition-colors hover:shadow-sm"
//             onClick={() => setIsOpen(!isOpen)}
//           >
//             <Columns className={cn("h-4 w-4 transition-all duration-300", !isOpen && "rotate-180")} />
//           </Button>
//         </div>

//         <div
//           className={cn("h-full w-full transition-all duration-300", isOpen ? "opacity-100" : "opacity-0 invisible")}
//         >
//           <div className="h-full overflow-y-auto py-8 px-4">
//             <div className="space-y-6">
//               {sections.map((section) => (
//                 <div key={section.title} className="px-2">
//                   <h2 className="text-sm font-medium tracking-wide text-foreground/90 mb-2">{section.title}</h2>
//                   {renderItems(section.items)}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Columns, Timer } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type ItemStatus = "new" | "beta" | "upcoming" | "coming-soon"

interface SubSubItem {
  title: string
  slug: string
  status?: ItemStatus
}

interface SubItem {
  title: string
  slug: string
  status?: ItemStatus
  items?: (SubItem | SubSubItem)[]
}

interface Section {
  title: string
  items: SubItem[]
}

const sections: Section[] = [
  {
    title: "Getting Started",
    items: [
      {
        title: "What is TextArena",
        slug: "overview",
      },
      {
        title: "Run Your First Game",
        slug: "first-game",
      },
      { 
        title: "Create a Game", 
        slug: "create-game" 
      },
    ],
  },
  {
    title: "Customization",
    items: [
      {
        title: "Agents",
        slug: "agents",
        items: [
          { title: "List of Agents", slug: "manage-agents" },
          { title: "Register a model", slug: "register-model", status: "coming-soon"},
        ],
      },
      {
        title: "Wrappers",
        slug: "wrappers",
        items: [
          { title: "List of Wrappers", slug: "list-of-wrappers" },
          { title: "Action Wrappers", slug: "action-wrappers" },
          { title: "Observation Wrappers", slug: "observation-wrappers" },
          { title: "Render Wrappers", slug: "render-wrappers" },
        ],
      },
    ],
  },
]

export function DocsSidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const isMobile = useIsMobile()
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(!isMobile)
  }, [isMobile])

  const renderStatus = (status?: ItemStatus) => {
    if (!status) return null

    if (status === "coming-soon") {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="ml-2 text-yellow-500/70 hover:text-yellow-500/90 transition-colors">
                <Timer className="h-3 w-3" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Coming Soon</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return (
      <Badge
        variant="secondary"
        className={cn(
          "text-[10px] px-1.5 py-0.5 ml-2",
          status === "new" && "bg-green-500/20 text-green-700",
          status === "beta" && "bg-blue-500/20 text-blue-700",
        )}
      >
        {status}
      </Badge>
    )
  }

  const renderItems = (items: (SubItem | SubSubItem)[], depth = 0) => (
    <ul className={cn("space-y-1", depth > 0 && "ml-4")}>
      {items.map((item) => {
        const isActive = pathname === `/docs/${item.slug}`
        return (
          <li key={item.slug}>
            <Link
              href={`/docs/${item.slug}`}
              className={cn(
                "flex items-center justify-between rounded-sm py-1 text-xs transition-colors duration-200",
                isActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground",
                depth === 0 && "font-medium",
              )}
            >
              <span>{item.title}</span>
              {renderStatus(item.status)}
            </Link>
            {"items" in item && item.items && renderItems(item.items, depth + 1)}
          </li>
        )
      })}
    </ul>
  )

  return (
    // Added font-mono here to ensure all text in the nav-bar uses your monospace font
    <div className="relative z-30 h-screen font-mono">
      <div
        className={cn(
          "fixed top-0 left-[var(--sidebar-width)] h-screen transition-all duration-500 ease-[cubic-bezier(0.215,0.61,0.355,1)]",
          isOpen
            ? "w-59 translate-x-0 bg-background/95 backdrop-blur-sm shadow-lg"
            : "w-10 translate-x-0 bg-transparent"
        )}
      >
        <div className="absolute right-0 top-4 h-8 w-8">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-l-md bg-background/50 hover:bg-background/60 transition-colors hover:shadow-sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Columns className={cn("h-4 w-4 transition-all duration-300", !isOpen && "rotate-180")} />
          </Button>
        </div>

        <div
          className={cn("h-full w-full transition-all duration-300", isOpen ? "opacity-100" : "opacity-0 invisible")}
        >
          <div className="h-full overflow-y-auto py-8 px-4">
            <div className="space-y-6">
              {sections.map((section) => (
                <div key={section.title} className="px-2">
                  <h2 className="text-sm font-medium tracking-wide text-foreground/90 mb-2">{section.title}</h2>
                  {renderItems(section.items)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
