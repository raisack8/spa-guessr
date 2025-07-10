import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SpaGuessr - 温泉当てゲーム',
  description: '日本の美しい温泉を写真から当てるGeoGuessr風ゲーム',
  keywords: ['温泉', 'ゲーム', 'GeoGuessr', '日本', '旅行'],
  authors: [{ name: 'SpaGuessr Team' }],
  openGraph: {
    title: 'SpaGuessr - 温泉当てゲーム',
    description: '日本の美しい温泉を写真から当てるGeoGuessr風ゲーム',
    type: 'website',
    locale: 'ja_JP',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={inter.className}>
      <head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v3.5.1/mapbox-gl.css"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="spa-container">
          {children}
        </div>
      </body>
    </html>
  )
} 