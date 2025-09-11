import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Modern Chat App',
  description: 'A modern, real-time chat application built with Next.js',
  keywords: ['chat', 'messaging', 'real-time', 'communication', 'nextjs'],
  authors: [{ name: 'Chat App Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Modern Chat App',
    description: 'Connect and chat with others in real-time',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#3B82F6" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <AuthProvider>
            <main className="min-h-screen bg-background text-foreground">
              {children}
            </main>
            <Toaster 
              position="bottom-right"
              expand={true}
              richColors={true}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}