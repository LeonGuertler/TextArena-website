"use client"

import { useChat } from "ai/react"
import { SendIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function Chat({ isInMatch }: { isInMatch: boolean }) {
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex items-start gap-2.5 max-w-3xl mx-auto",
              message.role === "user"
                ? "justify-end"
                : message.role === "assistant"
                  ? "justify-start"
                  : "justify-center",
            )}
          >
            <div
              className={cn(
                "rounded-lg px-4 py-2",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : message.role === "assistant"
                    ? "bg-muted"
                    : "bg-accent text-accent-foreground",
              )}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-4 relative">
        <div className="flex items-center gap-2 max-w-3xl mx-auto">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder={isInMatch ? "Type a message..." : "Waiting for match to start..."}
            className="flex-1"
            disabled={!isInMatch}
          />
          <Button type="submit" size="icon" disabled={!isInMatch}>
            <SendIcon className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>
    </div>
  )
}

