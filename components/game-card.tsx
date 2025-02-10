import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface GameCardProps {
  name: string
  href: string
  gifSrc: string
}

export function GameCard({ name, href, gifSrc }: GameCardProps) {
  return (
    <Link href={href} passHref>
      {/* <Card className="cursor-pointer hover:shadow-md transition-shadow bg-navbar-foreground"> */}
      <Card className="cursor-pointer hover:shadow-md transition-shadow bg-navbar">

        <CardContent className="p-4">
          <div className="relative mb-2" style={{ aspectRatio: "16 / 9" }}>
            <Image
              src={gifSrc}
              alt={`${name} gameplay`}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
              onError={(e) => {
                e.currentTarget.src = "gifs/coming-soon.gif"; // Ensure a fallback image appears
              }}
            />
          </div>
          <h3 className={cn("text-lg font-semibold text-center truncate", name.length > 12 ? "text-sm" : "")}>
            {name}
          </h3>
        </CardContent>
      </Card>
    </Link>
  )
}

