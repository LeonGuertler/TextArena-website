
// import "./globals.css"
// import type { Metadata } from "next"
// import { Inter } from "next/font/google"
// import { Sidebar } from "@/components/sidebar"
// import { AuthProvider } from "@/context/AuthContext"
// import type React from "react"
// import { Analytics } from "@vercel/analytics/react"
// import { WelcomeDialog } from "@/components/welcome-dialog"

// const inter = Inter({ subsets: ["latin"], variable: '--font-sans' }) // Define variable here

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
//     <html lang="en" className={inter.variable + " dark"}> {/* Add dark class and font variable */}
//       <body className="font-sans"> {/* Apply font-sans here */}
//           <AuthProvider>
//             <div className="flex h-screen">
//               <Sidebar />
//               <main className="flex-1 overflow-y-auto">
//                 {children}
//               </main>
//             </div>
//             <WelcomeDialog />
//           </AuthProvider>
//         <Analytics />
//       </body>
//     </html>
//   )
// }

import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Sidebar } from "@/components/sidebar"
import { AuthProvider } from "@/context/AuthContext"
import type React from "react"
import { Analytics } from "@vercel/analytics/react"
import { WelcomeDialog } from "@/components/welcome-dialog"
import { ResponsiveMain } from "@/components/responsive-main"
import ConstructionBanner from "@/components/construction-banner"

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' })

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
    <html lang="en" className={inter.variable + " dark"}>
      <body className="font-sans">
        <ConstructionBanner />
        <AuthProvider>
          <div className="flex h-screen">
            <Sidebar />
            <ResponsiveMain>
              {children}
            </ResponsiveMain>
          </div>
          <WelcomeDialog />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}