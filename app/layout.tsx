// // app/layout.tsx
// import "./globals.css"
// import type { Metadata } from "next"
// import { Inter } from "next/font/google"
// import { ThemeProvider } from "@/components/theme-provider"
// import { Sidebar } from "@/components/sidebar"
// import { AuthProvider } from "@/context/AuthContext"  // Import the AuthProvider
// import type React from "react"
// import { Analytics } from "@vercel/analytics/react"

// const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "TextArena",
//   description: "An AI-powered text adventure platform",
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
//           {/* Wrap your app with the AuthProvider */}
//           <AuthProvider>
//             <div className="flex h-screen">
//               <Sidebar />
//               <main className="flex-1 overflow-y-auto">
//                 {children}
//               </main>
//             </div>
//           </AuthProvider>
//         </ThemeProvider>
//       </body>
//     </html>
//   )
// }
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { AuthProvider } from "@/context/AuthContext"
import type React from "react"
import { Analytics } from "@vercel/analytics/react"
import { WelcomeDialog } from "@/components/welcome-dialog" // We'll create this

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TextArena",
  description: "An AI-powered text adventure platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <AuthProvider>
            <div className="flex h-screen">
              <Sidebar />
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            </div>
            <WelcomeDialog />
          </AuthProvider>
        </ThemeProvider>
        <Analytics /> {/* Add this line */}
      </body>
    </html>
  )
}