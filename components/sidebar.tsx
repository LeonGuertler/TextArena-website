"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Play,
  Eye,
  Trophy,
  Globe,
  BookOpen,
  Users,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Github, Twitter } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const topMenuItems = [
  { name: "Play", icon: Play, href: "/" },
  { name: "Watch", icon: Eye, href: "/watch" },
  { name: "Leaderboard", icon: Trophy, href: "/leaderboard" },
  { name: "Environments", icon: Globe, href: "/environments" },
]

const bottomMenuItems = [
  { name: "Documentation", icon: BookOpen, href: "/docs" },
  { name: "About Us", icon: Users, href: "/about" },
  {
    name: "Feedback",
    icon: MessageSquare,
    href: "https://discord.com/channels/1257951838322561075/1336697495442427916",
  },
]

const socialIcons = [
  { name: "Discord", icon: "/discord.svg", href: "https://discord.gg/KPacHzK23e" },
  { name: "GitHub", icon: Github, href: "https://github.com/LeonGuertler/TextArena" },
  { name: "X", icon: Twitter, href: "https://x.com/LeonGuertler" },
]

function NavItem({ item, isCollapsed }: { item: { name: string; icon: any; href: string }; isCollapsed: boolean }) {
  const pathname = usePathname()
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            target={item.name === "Feedback" ? "_blank" : undefined}
            rel={item.name === "Feedback" ? "noopener noreferrer" : undefined}
          >
            <span
              className={cn(
                "group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:bg-muted hover:text-foreground",
                pathname === item.href ? "bg-muted font-medium text-foreground" : "text-muted-foreground",
                isCollapsed ? "justify-center" : "justify-start",
              )}
            >
              <item.icon className={cn("mr-2", isCollapsed ? "h-6 w-6" : "h-4 w-4")} />
              {!isCollapsed && <span>{item.name}</span>}
            </span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{item.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true)

  return (
    <div className={cn("flex flex-col border-r bg-background", isCollapsed ? "w-[70px]" : "w-[240px]")}>
      <div className="flex h-[60px] items-center px-2 border-b">
        {!isCollapsed && <span className="text-lg font-bold px-2">TextArena</span>}
        <Button
          variant="ghost"
          size="icon"
          className={cn("ml-auto", isCollapsed && "mx-auto")}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <ScrollArea className="flex-grow">
        <nav className="flex flex-col gap-2 p-2">
          {topMenuItems.map((item) => (
            <NavItem key={item.name} item={item} isCollapsed={isCollapsed} />
          ))}
        </nav>
      </ScrollArea>
      <nav className="flex flex-col gap-2 p-2 border-t">
        {bottomMenuItems.map((item) => (
          <NavItem key={item.name} item={item} isCollapsed={isCollapsed} />
        ))}
      </nav>
      {!isCollapsed && (
        <div className="flex justify-center gap-2 p-2 border-t">
          {socialIcons.map((item) => (
            <TooltipProvider key={item.name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={item.href} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      {typeof item.icon === "string" ? (
                        <img src={item.icon || "/placeholder.svg"} alt={item.name} className="h-4 w-4" />
                      ) : (
                        <item.icon className="h-4 w-4" />
                      )}
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      )}
    </div>
  )
}

