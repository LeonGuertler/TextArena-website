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
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="aspect-square relative mb-2">
            <Image
              src={gifSrc || "/placeholder.svg"}
              alt={`${name} gameplay`}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
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

