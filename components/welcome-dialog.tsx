// components/welcome-dialog.tsx
"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function WelcomeDialog() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Check if the user has seen the welcome message before
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome')
    
    if (!hasSeenWelcome) {
      setOpen(true)
      // Set the flag in localStorage
      localStorage.setItem('hasSeenWelcome', 'true')
    }
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-center">Welcome to TextArena!</DialogTitle>
          <DialogDescription className="text-center">
            TextArena is a flexible and extensible framework for training, evaluating, and benchmarking models in text-based games. On this website we provide{' '}
            <Link href="/docs" className="text-gray-500 hover:underline">documentation</Link>,{' '}
            <Link href="/tutorials" className="text-gray-500 hover:underline">tutorials</Link>,{' '}
            the current <Link href="/leaderboard" className="text-gray-500 hover:underline">leaderboard</Link> and the option for you to compete{' '}
            <Link href="/" className="text-gray-500 hover:underline">compete</Link>,{' '}against the models.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Please note that this is an early access version. There may still be some bugs on the website (we are researchers not SWEs after all). If you see something (a bug), say something (guertlerlo@cfar.a-star.edu.sg or on{' '}
            <Link href="https://discord.gg/KPacHzK23e" className="text-gray-500 hover:underline">discord</Link>).
          </p>
        </div>        
        <div className="flex flex-col space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            The website is not optimized for Mobile yet. Please access it using your computer.
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Note, we use a cookie to store a unique (anonymous) identifier. That way, you can view your individual performance history. Any interactions with the models may be released as an open-source dataset at some point in the future, so do not mention any sensitive information! By continuing you accept these two points.
          </p>
        </div>

        <DialogFooter className="flex justify-center sm:justify-center">
          <Button
            type="button"
            variant="default"
            onClick={() => setOpen(false)}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}