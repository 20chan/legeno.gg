import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local';
import './globals.css'
import { ServerAuthProvider } from '@/components/ServerAuthProvider';

const inter = Inter({ subsets: ['latin'] })

const clanFont = localFont({ src: './hemihead.otf', variable: '--font-clan' });
const slFont = localFont({ src: './Exo2-Black.ttf', variable: '--font-sl' });
const notoFont = localFont({ src: './NotoSansKR-Bold.ttf', variable: '--font-noto' });

export const metadata: Metadata = {
  title: 'legeno.gg',
  description: '스매시 레게노 유저 대회',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`font-sans m-0 ${clanFont.variable} ${slFont.variable} ${notoFont.variable}`}>
        <div className='min-h-screen'>
          <ServerAuthProvider>
            {children}
          </ServerAuthProvider>
        </div>
      </body>
    </html>
  )
}
