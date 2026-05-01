import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: 'Wellnest - Diabetes Risk Assessment',
  description: 'Know your diabetes risk before it knows you. Take our free 20-question assessment and get personalized health insights in under 3 minutes.',
  generator: 'v0.app',
  keywords: ['diabetes', 'health assessment', 'risk assessment', 'wellness', 'health check'],
}

export const viewport: Viewport = {
  themeColor: '#1D9E75',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background overflow-x-hidden overflow-y-auto">
      <body className={`${poppins.variable} font-sans antialiased min-h-screen overflow-y-auto`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
