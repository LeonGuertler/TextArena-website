
import fs from "fs"
import path from "path"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import dynamic from "next/dynamic"
import { DocsSidebar } from "@/components/docs-sidebar"
import { Code } from "@/components/Code"
import "@/styles/docs.css"

const Image = dynamic(() => import("next/image"), { ssr: false })

const components = {
  Image,
  code: ({ children, className }: { children: string; className?: string }) => {
    // Check if this is inline code (no language specified)
    const isInline = !className
    return <Code inline={isInline}>{children}</Code>
  },
}

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), "content", "docs"))
  return files.map((filename) => ({
    slug: filename.replace(".mdx", ""),
  }))
}

export default async function DocsPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const filePath = path.join(process.cwd(), "content", "docs", `${slug}.mdx`)

  try {
    const content = await fs.promises.readFile(filePath, "utf8")

    return (
      <div className="flex min-h-screen">
        <DocsSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <article className="docs-content font-mono">
              <MDXRemote source={content} components={components} />
            </article>
          </div>
        </main>
      </div>
    )
  } catch (error) {
    notFound()
  }
}