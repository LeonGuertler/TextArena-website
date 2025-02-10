import fs from "fs"
import path from "path"
import { MDXRemote } from "next-mdx-remote/rsc"
import dynamic from "next/dynamic"
import { Code } from "@/components/Code"
import { FallbackImage } from "@/components/fallback-image"
import remarkGfm from "remark-gfm"
import "@/styles/docs.css"
import type React from "react"
import { allGames } from "@/lib/games-data"

const Image = dynamic(() => import("next/image"), { ssr: false })

const components = {
  Image,
  code: ({ children, className }: { children: string; className?: string }) => {
    const isInline = !className
    return <Code inline={isInline}>{children}</Code>
  },
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full border border-border rounded-lg overflow-hidden" {...props} />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => <thead className="bg-muted/50" {...props} />,
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="px-4 py-2 text-left font-semibold border-b border-border" {...props} />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="px-4 py-2 border-t border-border" {...props} />
  ),
  tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => <tr className="m-0 p-0 even:bg-muted/25" {...props} />,
  h1: (props) => <h1 className="text-3xl font-bold tracking-tight mb-6" {...props} />,
  h2: (props) => <h2 className="text-2xl font-semibold tracking-tight mt-10 mb-4" {...props} />,
  h3: (props) => <h3 className="text-xl font-semibold tracking-tight mt-8 mb-4" {...props} />,
  p: (props) => <p className="leading-7 [&:not(:first-child)]:mt-6" {...props} />,
  ul: (props) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props} />,
}

export async function generateStaticParams() {
  return allGames.map((game) => ({
    category: game.category,
    slug: game.name.toLowerCase(),
  }))
}

export default async function DocsPage({ params }: { params: { category: string; slug: string } }) {
  const { category, slug } = params

  // Verify that this game exists in this category
  const game = allGames.find((g) => g.name.toLowerCase() === slug && g.category === category)

  if (!game) {
    return null
  }

  const filePath = path.join(process.cwd(), "content", "environments", category, `${slug}.mdx`)
  const defaultPath = path.join(process.cwd(), "content", "environments", "default.mdx")

  let content: string
  try {
    content = await fs.promises.readFile(filePath, "utf8")
  } catch (error) {
    // If the specific file doesn't exist, use the default template
    content = await fs.promises.readFile(defaultPath, "utf8")
    // Replace the title with the actual game name
    content = content.replace("# Coming Soon", `# ${game.name} (${category}-player) is on it's way!`)
  }

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* GIF Section */}
          <div className="mb-8 rounded-lg overflow-hidden border border-border">
            <FallbackImage
              src={`/gifs/${category}/${slug}.gif`}
              alt={`${game.name} environment demonstration`}
              className="w-full h-auto"
            />
          </div>

          <article className="docs-content font-mono">
            <MDXRemote
              source={content}
              components={components}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                },
              }}
            />
          </article>
        </div>
      </main>
    </div>
  )
}

