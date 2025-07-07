"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Play, Eye, Trophy, Globe, BookOpen, Users,
  MessageSquare, ChevronLeft, ChevronRight,
  Github, Twitter, Timer, Columns, CircleUserRound
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Menu items and sections from your original code
const topMenuItems = [
  { name: "Play", icon: Play, href: "/" },
  { name: "Profile", icon: CircleUserRound, href: "/profile", isNew: true },
  // { name: "Watch", icon: Eye, href: "/watch" },
  { name: "Leaderboard", icon: Trophy, href: "/leaderboard" },
  { name: "Environments", icon: Globe, href: "/environments" },
  { name: "NeurIPS", icon: "/neurips-navbar-logo.svg", href: "/neurips", isNew: true },
]

const bottomMenuItems = [
  { name: "Documentation", icon: BookOpen, href: "/docs/overview" },
  { name: "About Us", icon: Users, href: "/about" },
  {
    name: "Feedback",
    icon: MessageSquare,
    href: "https://discord.com/channels/1257951838322561075/1336697495442427916",
  },
]

const socialIcons = [
  { name: "Discord", icon: "/discord.svg", href: "https://discord.gg/KMndsqwMaZ" },
  { name: "GitHub", icon: Github, href: "https://github.com/LeonGuertler/TextArena" },
  // { name: "X", icon: Twitter, href: "https://x.com/" },
]

// Docs navigation data structure
const sections = [
  {
    title: "Getting Started",
    items: [
      { title: "What is TextArena", slug: "overview" },
      { title: "Run Your First Game", slug: "first-game" },
      { title: "Register a model", slug: "register-model" }, //, status: "coming-soon" },
      { title: "Create a Game", slug: "create-game" },
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

const NavItem = ({ item, isCollapsed, setIsMainCollapsed, isMobile }) => {
  const pathname = usePathname()
  const isActive = pathname === item.href

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            target={item.name === "Feedback" ? "_blank" : undefined}
            rel={item.name === "Feedback" ? "noopener noreferrer" : undefined}
            onClick={() => {
              if (isMobile) setIsMainCollapsed(true) // Only close sidebar if mobile
            }}
          >
            <span
              className={cn(
                "group flex w-full items-center rounded-md px-2 py-1.5 relative",
                "hover:bg-gray-200/10 transition-colors duration-200",
                isActive ? "text-white" : "text-white/70 hover:text-white",
                isCollapsed ? "justify-center" : "justify-start"
              )}
            >
              <span className="relative inline-block">
                {typeof item.icon === "string" ? (
                  <img
                    src={item.icon}
                    alt={item.name}
                    className={cn(
                      "transition-transform duration-200 group-hover:scale-110",
                      isCollapsed ? "h-5 w-5" : "h-4 w-4 mr-3"
                    )}
                  />
                ) : (
                  <item.icon
                    className={cn(
                      "transition-transform duration-200 group-hover:scale-110",
                      isCollapsed ? "h-5 w-5" : "h-4 w-4 mr-3"
                    )}
                  />
                )}

                {item.isNew && isCollapsed && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#3B82F6] border-[2px] border-[#021213]" />
                )}
              </span>

              {!isCollapsed && (
                <>
                  <span className="flex items-center gap-1 transition-colors duration-200 group-hover:text-white">
                    {item.name}
                    {item.isNew && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-[#E0ECFF] text-[#2563EB] rounded-full font-medium tracking-wide">
                        NEW
                      </span>
                    )}
                  </span>
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/50 w-0 group-hover:w-full transition-all duration-500 ease-in-out" />
                </>
              )}
            </span>
          </Link>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right" className="font-medium">
            {item.name}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}

const DocItem = ({ item, depth = 0, setIsDocsVisible, isMobile }) => {
  return (
    <li>
      <Link
        href={`/docs/${item.slug}`}
        className={cn(
          "flex items-center justify-between rounded-sm py-1 text-xs relative group",
          "text-white/70 hover:text-white transition-colors duration-200",
          depth === 0 && "font-medium"
        )}
        onClick={() => {
          if (isMobile) setIsDocsVisible(false) // Only close docs sidebar if mobile
        }}
      >
        <span>{item.title}</span>
        {item.status === "coming-soon" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="ml-2 text-yellow-500/70">
                  <Timer className="h-3 w-3 transition-transform duration-200 group-hover:scale-110" />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Coming Soon</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/50 w-0 group-hover:w-full transition-all duration-500 ease-in-out" />
      </Link>
      {item.items && (
        <ul className="ml-4 mt-1 space-y-1">
          {item.items.map((subItem) => (
            <DocItem key={subItem.slug} item={subItem} depth={depth + 1} setIsDocsVisible={setIsDocsVisible} isMobile={isMobile} />
          ))}
        </ul>
      )}
    </li>
  )
}



const Sidebar = () => {
  const [isMainCollapsed, setIsMainCollapsed] = useState(true)
  const [isDocsVisible, setIsDocsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const isDocsPage = pathname?.startsWith('/docs')

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsMainCollapsed(true)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!isDocsPage) {
      setIsDocsVisible(false)
    }
  }, [isDocsPage])

  const sidebarWidth = isMobile 
    ? (isMainCollapsed ? '0' : '200px')
    : (isMainCollapsed ? '60px' : '200px')

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isMobile && (
        <div
          className={cn(
            "fixed inset-0 bg-black/50 backdrop-blur-sm z-30",
            "transition-opacity duration-200 ease-in-out",
            isMainCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
          onClick={() => setIsMainCollapsed(true)}
        />
      )}

      {/* Toggle Button - Always visible */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMainCollapsed(!isMainCollapsed)}
        className={cn(
          "fixed top-2 z-50 h-8 w-8",
          "rounded-lg",
          "bg-[#021213] hover:bg-[#0a2f30]",
          "text-white/70 hover:text-white",
          "transition-all duration-200",
          "border border-white/10",
          isMainCollapsed ? "left-[13px]" : "left-[158px]",
          !isMobile && "ml-0"  // Reset margin for non-mobile
        )}
        style={{
          left: !isMobile ? (isMainCollapsed ? "13px" : "153px") : (isMainCollapsed ? "13px" : "158px")
        }}
      >
        {isMainCollapsed ? (
          <ChevronRight className="h-4 w-4 transition-transform duration-200" />
        ) : (
          <ChevronLeft className="h-4 w-4 transition-transform duration-200" />
        )}
      </Button>

      {/* Main Sidebar */}
      <div
        className={cn(
          "h-full bg-[#021213] font-mono shadow-lg",
          "transition-all duration-200 ease-in-out",
          isMobile ? [
            "fixed left-0 top-0 z-40",
            isMainCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
          ] : [
            "relative",  // Changed from fixed to relative for non-mobile
            "border-r border-white/10"
          ]
        )}
        style={{ 
          width: sidebarWidth,
          minWidth: sidebarWidth,
          maxWidth: sidebarWidth,
          marginLeft: !isMobile ? "0" : undefined  // Reset margin for non-mobile
        }}
      >
        <div className="flex h-[50px] items-center border-b border-white/10 px-4 transition-all duration-200 ease-in-out">
          {!isMainCollapsed && (
            <Link href="/" className={cn(
                "cursor-pointer",
                "transition-all duration-200 ease-in-out",
                isMainCollapsed ? "opacity-0 invisible" : "opacity-100 visible delay-100"
              )}>
              <span className="text-lg font-bold px-2">TextArena</span>
            </Link>
          )}
        </div>

        <ScrollArea className="flex-grow h-[calc(100vh-50px)]">
          <div className="flex flex-col gap-1 p-2">
            {topMenuItems.map((item) => (
              <NavItem key={item.name} item={item} isCollapsed={isMainCollapsed} setIsMainCollapsed={setIsMainCollapsed} isMobile={isMobile} />
            ))}
          </div>
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0">
          <div className="flex flex-col gap-1 border-t border-white/10 p-2">
            {bottomMenuItems.map((item) => (
              <NavItem key={item.name} item={item} isCollapsed={isMainCollapsed} setIsMainCollapsed={setIsMainCollapsed} isMobile={isMobile} />
            ))}
          </div>

          <div className={cn(
            "flex border-t border-white/10 p-2",
            isMainCollapsed ? "flex-col items-center" : "justify-center gap-2"
          )}>
            {socialIcons.map((item) => (
              <TooltipProvider key={item.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={item.href} target="_blank" rel="noopener noreferrer">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-white/70 hover:text-white
                                 hover:bg-white/10 transition-all duration-200 group"
                      >
                        {typeof item.icon === "string" ? (
                          <img src={item.icon || "/placeholder.svg"} alt={item.name} className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                        ) : (
                          <item.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
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
        </div>
      </div>

      {/* Docs Sidebar Toggle Button */}
      {isDocsPage && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDocsVisible(!isDocsVisible)}
          className={cn(
            "fixed top-2 z-50 h-8 w-8",
            "rounded-lg",
            "bg-[#021213] hover:bg-[#0a2f30]",
            "text-white/70 hover:text-white",
            "transition-all duration-200",
            "border border-white/10",
            isMobile 
              ? (isMainCollapsed ? "left-14" : "left-[210px]")
              : (isMainCollapsed ? "left-[71px]" : "left-[211px]")
          )}
        >
          <Columns className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
        </Button>
      )}

      {/* Docs Sidebar */}
      {isDocsPage && (
        <div
          className={cn(
            "fixed h-full bg-[#021213]/85 border-l border-white/10 font-mono",
            "transition-all duration-300 ease-in-out z-30",
            "backdrop-blur-sm shadow-lg",
            isDocsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          style={{ 
            width: isDocsVisible ? '200px' : '0',
            left: isMobile 
              ? (isMainCollapsed ? '0' : '200px')
              : (isMainCollapsed ? '60px' : '200px')
          }}
        >
          <ScrollArea className="h-full px-4">
            <div className="pt-16 pb-6">
              <div className="space-y-6">
                {sections.map((section) => (
                  <div key={section.title} className="px-2">
                    <h2 className="mb-2 text-sm font-medium text-white/90">
                      {section.title}
                    </h2>
                    <ul className="space-y-1">
                      {section.items.map((item) => (
                        <DocItem key={item.slug} item={item} setIsDocsVisible={setIsDocsVisible} isMobile={isMobile} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </>
  )
}

export { Sidebar }