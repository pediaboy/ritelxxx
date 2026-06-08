import type { Metadata } from 'next'
import './globals.css'
import Starfield from '@/components/Starfield'

export const metadata: Metadata = {
  title: 'RITELCOMMUNITY.ID SCREENER',
  description: 'Premium Stock Screener untuk Investor Ritel Indonesia',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <Starfield />
        {children}
      </body>
    </html>
  )
}
