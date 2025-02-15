import fs from "fs"
import path from "path"
import { MDXRemote } from "next-mdx-remote/rsc"
import "@/styles/docs.css"

export default async function DocsPage() {
  const filePath = path.join(process.cwd(), "content", "docs.mdx")
  const content = await fs.promises.readFile(filePath, "utf8")

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <article className="docs-content font-mono">
            <MDXRemote source={content} />
          </article>
        </div>
      </main>
    </div>
  )
}
