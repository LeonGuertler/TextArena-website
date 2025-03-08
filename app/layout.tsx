
// import "./globals.css"
// import type { Metadata } from "next"
// import { Inter } from "next/font/google"
// import { Sidebar } from "@/components/sidebar"
// import { AuthProvider } from "@/context/AuthContext"
// import type React from "react"
// import { Analytics } from "@vercel/analytics/react"
// import { WelcomeDialog } from "@/components/welcome-dialog"
// import { ResponsiveMain } from "@/components/responsive-main"
// import ConstructionBanner from "@/components/construction-banner"

// const inter = Inter({ subsets: ["latin"], variable: '--font-sans' })

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
//     <html lang="en" className={inter.variable + " dark"}>
//       <body className="font-sans">
//         {/* <ConstructionBanner /> */}
//         <AuthProvider>
//           <div className="flex h-screen">
//             <Sidebar />
//             <ResponsiveMain>
//               {children}
//             </ResponsiveMain>
//           </div>
//           <WelcomeDialog />
//         </AuthProvider>
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
  icons: {
    icon: "/favicon.ico", // This ensures the favicon is included in metadata
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable + " dark"}>
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body className="font-sans">
        {/* <ConstructionBanner /> */}
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
