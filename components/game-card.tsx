import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { FallbackImage } from "@/components/fallback-image"

interface GameCardProps {
  name: string
  href: string
  numPlayers: number
}

export function GameCard({ name, href, numPlayers }: GameCardProps) {
  const slug = name.toLowerCase()
  const gifSrc = `/gifs/${slug}.gif`

  return (
    <Link href={href} passHref>
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="relative mb-2" style={{ aspectRatio: "16 / 9" }}>
            <FallbackImage src={gifSrc} alt={`${name} gameplay`} className="rounded-md w-full h-full object-cover" />
          </div>
          <h3 className={cn("text-lg font-semibold text-center truncate", name.length > 12 ? "text-sm" : "")}>
            {name}
          </h3>
          <div className="flex justify-center mt-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-teal-900/40 text-gray-300">
              {numPlayers}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}