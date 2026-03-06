import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Sidebar } from '@/components/layout/sidebar'
import { ThemeToggle } from '@/components/ui/theme-toggle'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Artiom Cavtea | Web Developer',
  description: 'Web Developer based in Chisinau. Specializing in modern web applications with Next.js, TypeScript, and React.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 lg:ml-[245px]">
              {/* Dark Mode Toggle - Fixed Top Right */}
              <div className="fixed top-4 right-4 z-50">
                <ThemeToggle />
              </div>

              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
