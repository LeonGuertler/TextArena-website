"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

interface ResponsiveMainProps {
  children: React.ReactNode
  className?: string
}

export function ResponsiveMain({ children, className }: ResponsiveMainProps) {
  const isMobile = useIsMobile()
  
  return (
    <main 
      id="main-content" 
      className={cn(
        "flex-1 overflow-y-auto transition-[padding] duration-300",
        isMobile ? "pl-0" : "pl-[66px]",
        className
      )}
    >
      {children}
    </main>
  )
}