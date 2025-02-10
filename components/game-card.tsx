import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { FallbackImage } from "@/components/fallback-image"

interface GameCardProps {
  name: string
  href: string
  category: string
}

export function GameCard({ name, href, category }: GameCardProps) {
  const slug = name.toLowerCase()
  const gifSrc = `/gifs/${category}/${slug}.gif`

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
        </CardContent>
      </Card>
    </Link>
  )
}

