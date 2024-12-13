import './globals.css'
import { Inter } from 'next/font/google'
import { Navigation } from './components/navigation'
import { Crimson_Text } from 'next/font/google'
import { AuthProvider } from './providers/auth-provider'
import { PionextCreditsProvider } from '@/contexts/pionext-credits-context'
import { generateMetadata } from './metadata'

const inter = Inter({ subsets: ['latin'] })
const crimsonText = Crimson_Text({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export { generateMetadata as metadata }

// Create a client wrapper component for providers
function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PionextCreditsProvider>
        {children}
      </PionextCreditsProvider>
    </AuthProvider>
  )
}

// Keep the layout as a server component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navigation />
          <main className="pt-[57px]">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}

