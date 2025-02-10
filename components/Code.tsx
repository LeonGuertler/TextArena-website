import { cn } from "@/lib/utils"

interface CodeProps {
  children: string
  className?: string
  inline?: boolean
}

export function Code({ children, className, inline = false }: CodeProps) {
  // If it's inline code, render with inline styles
  if (inline) {
    return <code className="px-1.5 py-0.5 rounded-sm bg-muted font-mono text-sm">{children}</code>
  }

  // Otherwise, render as a code block
  return (
    <pre className={cn("p-4 rounded-md my-4 overflow-auto", "bg-muted font-mono", "text-sm leading-6", className)}>
      <code className={className}>{children}</code>
    </pre>
  )
}

