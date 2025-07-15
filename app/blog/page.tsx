import fs from "fs"
import path from "path"
import { MDXRemote } from "next-mdx-remote/rsc"
import { Code } from "@/components/Code"
import "@/styles/docs.css"

const components = {
  // Handle headers with IDs for anchor links
  h1: ({ children, ...props }: any) => {
    const id = typeof children === 'string' 
      ? children.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      : undefined
    return <h1 id={id} {...props}>{children}</h1>
  },
  h2: ({ children, ...props }: any) => {
    const id = typeof children === 'string' 
      ? children.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      : undefined
    return <h2 id={id} {...props}>{children}</h2>
  },
  h3: ({ children, ...props }: any) => {
    const id = typeof children === 'string' 
      ? children.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      : undefined
    return <h3 id={id} {...props}>{children}</h3>
  },
  h4: ({ children, ...props }: any) => {
    const id = typeof children === 'string' 
      ? children.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      : undefined
    return <h4 id={id} {...props}>{children}</h4>
  },
  h5: ({ children, ...props }: any) => {
    const id = typeof children === 'string' 
      ? children.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      : undefined
    return <h5 id={id} {...props}>{children}</h5>
  },
  h6: ({ children, ...props }: any) => {
    const id = typeof children === 'string' 
      ? children.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      : undefined
    return <h6 id={id} {...props}>{children}</h6>
  },
  // Handle code blocks and inline code using the imported Code component
  code: ({ children, className, ...props }: { children: string; className?: string }) => {
    // Extract language from className (e.g., "language-python" -> "python")
    const language = className?.replace('language-', '') || ''
    
    // Check if this is inline code (no language specified or no className)
    const isInline = !className || !className.startsWith('language-')
    
    return (
      <Code 
        inline={isInline} 
        language={language}
        {...props}
      >
        {children}
      </Code>
    )
  },
  // Handle pre tags to ensure proper structure - remove extra wrapper
  pre: ({ children, ...props }: any) => {
    return <>{children}</>
  },
}

export default async function DocsPage() {
  const filePath = path.join(process.cwd(), "content", "blog.mdx")
  const content = await fs.promises.readFile(filePath, "utf8")

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <article className="docs-content font-mono">
            <MDXRemote source={content} components={components} />
          </article>
        </div>
      </main>
    </div>
  )
}